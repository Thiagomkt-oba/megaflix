export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customer, items, amount } = req.body;

    // Validação dos dados
    if (!customer?.name || !customer?.email || !customer?.document) {
      return res.status(400).json({ error: 'Dados do cliente obrigatórios' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Itens do pedido obrigatórios' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    // Validação básica de CPF (11 dígitos)
    const cpfClean = customer.document.replace(/\D/g, '');
    if (cpfClean.length !== 11) {
      return res.status(400).json({ error: 'CPF deve conter 11 dígitos' });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Calcula o total em centavos dos itens
    const totalAmountInCents = items.reduce((total, item) => total + item.priceInCents, 0);

    // Monta o payload correto para 4ForPayments API conforme documentação
    const pixData = {
      name: customer.name,
      email: customer.email,
      cpf: customer.document.replace(/\D/g, ''),
      phone: customer.phone?.replace(/\D/g, '') || '11999999999',
      paymentMethod: "PIX",
      amount: totalAmountInCents,
      traceable: true,
      items: items.map(item => ({
        title: item.name,
        unitPrice: item.priceInCents,
        quantity: item.quantity || 1,
        tangible: false
      })),
      cep: "01000000",
      street: "Rua Exemplo",
      number: "123",
      district: "Centro",
      city: "São Paulo",
      state: "SP",
      checkoutUrl: `https://${req.headers.host}/checkout`,
      referrerUrl: req.headers.referer || `https://${req.headers.host}`,
      postbackUrl: `https://${req.headers.host}/api/webhook-for4payments`
    };

    let data;

    // Verifica se a API key está configurada e tenta chamada real
    if (!process.env.FOR4PAYMENTS_API_KEY) {
      console.log('API Key não configurada, usando modo demonstração');
      // Versão de demonstração - simula resposta da API
      data = {
        id: `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: "waiting_payment",
        pix: {
          qr_code: "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5925MEGAFLIX%20STREAMING%20LTDA6009SAO%20PAULO62070503***630469F0",
          qr_code_text: "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5925MEGAFLIX STREAMING LTDA6009SAO PAULO62070503***630469F0",
          url: "https://pix.example.com/pay/demo"
        }
      };
    } else {
      // Chama a API da 4ForPayments
      const response = await fetch("https://app.for4payments.com.br/api/v1/transaction.purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.FOR4PAYMENTS_API_KEY
        },
        body: JSON.stringify(pixData)
      });

      const responseText = await response.text();
      console.log('4ForPayments Response Status:', response.status);
      console.log('4ForPayments Response Headers:', Object.fromEntries(response.headers.entries()));
      console.log('4ForPayments Response Body:', responseText);

      if (!response.ok) {
        console.error('Erro 4ForPayments Status:', response.status);
        console.error('Erro 4ForPayments Body:', responseText);
        
        // Se a API retornar erro 500, retornar erro informativo
        if (response.status === 500) {
          console.log('API 4ForPayments retornando erro 500');
          return res.status(500).json({ 
            error: 'Serviço de pagamento temporariamente indisponível. Tente novamente em alguns instantes ou entre em contato com o suporte.' 
          });
        } else {
          return res.status(400).json({ 
            error: `Erro na API de pagamento (${response.status}): ${responseText}` 
          });
        }
      } else {
        try {
          data = JSON.parse(responseText);
          console.log('Dados parseados com sucesso:', data);
        } catch (parseError) {
          console.error('Erro ao parsear JSON:', parseError);
          console.error('Response body que causou erro:', responseText);
          console.error('Response status:', response.status);
          console.error('Response headers:', Object.fromEntries(response.headers.entries()));
          return res.status(500).json({ 
            error: 'Resposta inválida da API de pagamento. Verifique os logs do servidor.' 
          });
        }
      }
    }

    // Validação da estrutura de resposta
    if (!data || !data.id || !data.status) {
      console.error('Resposta da API inválida - campos obrigatórios ausentes:', data);
      return res.status(500).json({ 
        error: 'Dados de pagamento incompletos recebidos da API' 
      });
    }

    // Extrai dados necessários da resposta
    const paymentResponse = {
      id: data.id,
      status: data.status === "PENDING" ? "waiting_payment" : data.status,
      qrCode: data.pixQrCode || null,
      qrCodeText: data.pixCode || null,
      pixUrl: data.pixQrCode || null
    };

    console.log('Resposta final sendo enviada:', paymentResponse);

    // Integração com Utmify se configurado
    if (process.env.UTMIFY_API_TOKEN && data.id) {
      try {
        const urlParams = new URLSearchParams(req.headers.referer?.split('?')[1] || '');
        
        const utmifyOrderData = {
          orderId: data.id,
          platform: "Megaflix",
          paymentMethod: "pix",
          status: "waiting_payment",
          createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
          approvedDate: null,
          refundedAt: null,
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone || null,
            document: customer.document.replace(/\D/g, ''),
            country: "BR",
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
          },
          products: items.map(item => ({
            id: item.id || "megaflix-subscription",
            name: item.name,
            planId: null,
            planName: null,
            quantity: item.quantity || 1,
            priceInCents: item.priceInCents || Math.round(amount * 100)
          })),
          trackingParameters: {
            src: urlParams.get('src'),
            sck: urlParams.get('sck'),
            utm_source: urlParams.get('utm_source'),
            utm_campaign: urlParams.get('utm_campaign'),
            utm_medium: urlParams.get('utm_medium'),
            utm_content: urlParams.get('utm_content'),
            utm_term: urlParams.get('utm_term')
          },
          commission: {
            totalPriceInCents: Math.round(amount * 100),
            gatewayFeeInCents: Math.round(amount * 100 * 0.05), // 5% taxa
            userCommissionInCents: Math.round(amount * 100 * 0.95)
          }
        };

        await fetch("https://api.utmify.com.br/api-credentials/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": process.env.UTMIFY_API_TOKEN
          },
          body: JSON.stringify(utmifyOrderData)
        });
      } catch (utmifyError) {
        console.error('Erro Utmify:', utmifyError);
        // Não falha o pagamento por erro no tracking
      }
    }

    res.status(200).json(paymentResponse);

  } catch (error) {
    console.error('Erro ao criar PIX:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
}