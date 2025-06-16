export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customer, items, amount } = req.body;

    console.log("Received PIX payment request:", {
      name: customer?.name, 
      email: customer?.email, 
      cpf: customer?.document?.substring(0, 3) + "...", 
      amount
    });

    // Validate required fields
    if (!customer?.name || !customer?.email || !customer?.document) {
      return res.status(400).json({
        error: "Campos obrigatórios: nome, email, cpf"
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Itens do pedido obrigatórios' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    // Clean phone and CPF
    const cleanPhone = customer.phone?.replace(/\D/g, '') || '11999999999';
    const cleanCpf = customer.document.replace(/\D/g, '');

    // Validate phone and CPF format according to API requirements
    if (cleanCpf.length !== 11) {
      return res.status(400).json({
        error: "CPF deve ter exatamente 11 dígitos",
        details: `CPF fornecido tem ${cleanCpf.length} dígitos`
      });
    }

    if (cleanPhone.length < 8 || cleanPhone.length > 12) {
      return res.status(400).json({
        error: "Telefone deve ter entre 8 e 12 dígitos",
        details: `Telefone fornecido tem ${cleanPhone.length} dígitos`
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validate API key
    if (!process.env.FOR4PAYMENTS_API_KEY) {
      console.error("FOR4PAYMENTS_API_KEY not found in environment");
      return res.status(500).json({
        error: "Configuração da API não encontrada",
        details: "FOR4PAYMENTS_API_KEY não configurada"
      });
    }

    // Official For4Payments API endpoint from documentation
    const endpoint = "https://app.for4payments.com.br/api/v1/transaction.purchase";
    
    // Calculate amounts ensuring minimum values
    const amountInCents = Math.max(Math.round(amount * 100), 500);
    
    // Prepare payment data according to official API documentation
    const paymentData = {
      name: customer.name.trim(),
      email: customer.email.trim().toLowerCase(),
      cpf: cleanCpf,
      phone: cleanPhone,
      paymentMethod: "PIX",
      amount: amountInCents,
      traceable: true,
      items: items.map(item => ({
        unitPrice: item.priceInCents || amountInCents,
        title: item.name || "Plano Megaflix",
        quantity: item.quantity || 1,
        tangible: false
      })),
      externalId: `megaflix_${Date.now()}`,
      cep: "01000000",
      street: "Rua Exemplo",
      number: "123",
      district: "Centro",
      city: "São Paulo",
      state: "SP",
      postbackUrl: `https://${req.headers.host}/api/webhook-for4payments`
    };

    console.log("Sending request to For4Payments:", JSON.stringify({
      ...paymentData,
      cpf: "***HIDDEN***"
    }, null, 2));

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.FOR4PAYMENTS_API_KEY
      },
      body: JSON.stringify(paymentData)
    });

    console.log(`For4Payments response status: ${response.status}`);
    
    const responseText = await response.text();
    console.log(`For4Payments response: ${responseText.substring(0, 1000)}...`);

    if (!response.ok) {
      console.error(`For4Payments API Error: ${response.status}`);
      
      let parsedError = null;
      try {
        parsedError = JSON.parse(responseText);
      } catch (e) {
        console.error("Could not parse error response as JSON");
      }
      
      if (response.status === 500) {
        return res.status(500).json({
          error: "Erro interno da For4Payments",
          status: response.status,
          details: parsedError?.message || "Erro ao processar pagamento PIX",
          code: parsedError?.code || "INTERNAL_SERVER_ERROR",
          suggestions: [
            "Verificar se a conta For4Payments está ativa e aprovada",
            "Confirmar se PIX está habilitado na conta",
            "Validar se a chave API não expirou"
          ]
        });
      }
      
      return res.status(500).json({
        error: "Erro na API For4Payments",
        status: response.status,
        details: responseText.substring(0, 200)
      });
    }

    let pixData;
    try {
      pixData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse For4Payments response as JSON:", e);
      return res.status(500).json({
        error: "Resposta inválida da API For4Payments",
        details: "Resposta não é um JSON válido"
      });
    }

    // Send order data to Utmify if configured
    if (process.env.UTMIFY_API_TOKEN) {
      try {
        const urlParams = new URLSearchParams(req.url?.split('?')[1] || '');
        const utmifyOrderData = {
          orderId: pixData.id || `megaflix_${Date.now()}`,
          platform: "Megaflix",
          paymentMethod: "pix",
          status: "waiting_payment",
          createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
          approvedDate: null,
          refundedAt: null,
          customer: {
            name: customer.name,
            email: customer.email,
            phone: cleanPhone,
            document: cleanCpf,
            country: "BR",
            ip: req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || "127.0.0.1"
          },
          products: items.map(item => ({
            id: item.id || "megaflix-subscription",
            name: item.name || "Plano Megaflix",
            planId: null,
            planName: null,
            quantity: item.quantity || 1,
            priceInCents: item.priceInCents || amountInCents
          })),
          trackingParameters: {
            src: urlParams.get('src') || null,
            sck: urlParams.get('sck') || null,
            utm_source: urlParams.get('utm_source') || null,
            utm_campaign: urlParams.get('utm_campaign') || null,
            utm_medium: urlParams.get('utm_medium') || null,
            utm_content: urlParams.get('utm_content') || null,
            utm_term: urlParams.get('utm_term') || null
          },
          commission: {
            totalPriceInCents: amountInCents,
            gatewayFeeInCents: Math.round(amountInCents * 0.05),
            userCommissionInCents: Math.round(amountInCents * 0.95)
          },
          isTest: false
        };

        const utmifyResponse = await fetch("https://api.utmify.com.br/api-credentials/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": process.env.UTMIFY_API_TOKEN
          },
          body: JSON.stringify(utmifyOrderData)
        });

        if (utmifyResponse.ok) {
          console.log("Order data sent to Utmify successfully");
        } else {
          console.error("Utmify API Error:", await utmifyResponse.text());
        }
      } catch (error) {
        console.error("Error sending to Utmify:", error);
      }
    }

    // Return PIX payment data
    return res.status(200).json({
      id: pixData.id || pixData.transactionId || `megaflix_${Date.now()}`,
      status: pixData.status || "pending",
      qrCode: pixData.qrCode || pixData.pixQrCode || pixData.pix_qr_code || null,
      qrCodeText: pixData.qrCodeText || pixData.pixCode || pixData.pix_code || pixData.code || null,
      pixUrl: pixData.pixUrl || pixData.pix_url || null,
      amount: amount,
      expiresAt: pixData.expiresAt || pixData.expires_at || null
    });

  } catch (error) {
    console.error("Function error:", error);
    return res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message
    });
  }
}