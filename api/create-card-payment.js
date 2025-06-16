export default async function handler(req, res) {
  // Configuração de CORS e headers
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
    const { customer, card, items, amount } = req.body;

    // Log dos dados recebidos para debug
    console.log('=== CHECKOUT CARD PAYMENT DEBUG ===');
    console.log('Customer:', customer);
    console.log('Card:', { ...card, number: card?.number ? `****${card.number.slice(-4)}` : 'undefined', cvv: '***' });
    console.log('Items:', items);
    console.log('Amount:', amount);
    console.log('=====================================');

    // Validação dos dados
    if (!customer?.name || !customer?.email || !customer?.document) {
      return res.status(400).json({ error: 'Dados do cliente obrigatórios' });
    }

    if (!card?.number || !card?.expiryDate || !card?.cvv || !card?.holderName) {
      return res.status(400).json({ error: 'Dados do cartão obrigatórios' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Itens do pedido obrigatórios' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    // Processa dados do cartão
    const [month, year] = card.expiryDate.split('/');
    const fullYear = year.length === 2 ? `20${year}` : year;

    // Calcula o total em centavos dos itens
    const totalAmountInCents = items.reduce((total, item) => total + item.priceInCents, 0);

    // Monta o payload correto para 4ForPayments API conforme documentação
    const cardData = {
      name: customer.name,
      email: customer.email,
      cpf: customer.document.replace(/\D/g, ''),
      phone: customer.phone?.replace(/\D/g, '') || '11999999999',
      paymentMethod: "CREDIT_CARD",
      creditCard: {
        number: card.number.replace(/\D/g, ''),
        holder_name: card.holderName,
        cvv: card.cvv,
        expiration_month: month,
        expiration_year: fullYear,
        installments: 1
      },
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

    // Verifica se a API key está configurada
    if (!process.env.FOR4PAYMENTS_API_KEY) {
      // Versão de demonstração - simula resposta da API
      data = {
        id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: "approved"
      };
    } else {
      // Log dos dados enviados para 4ForPayments
      console.log('=== ENVIANDO PARA 4FORPAYMENTS ===');
      console.log('URL:', "https://app.for4payments.com.br/api/v1/transaction.purchase");
      console.log('Headers:', {
        "Content-Type": "application/json",
        "Authorization": process.env.FOR4PAYMENTS_API_KEY ? "****" + process.env.FOR4PAYMENTS_API_KEY.slice(-4) : "undefined"
      });
      console.log('Payload:', { 
        ...cardData, 
        creditCard: { 
          ...cardData.creditCard, 
          number: `****${cardData.creditCard.number.slice(-4)}`, 
          cvv: '***' 
        } 
      });

      // Chama a API da 4ForPayments
      const response = await fetch("https://app.for4payments.com.br/api/v1/transaction.purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.FOR4PAYMENTS_API_KEY
        },
        body: JSON.stringify(cardData)
      });

      const responseText = await response.text();
      console.log('=== RESPOSTA 4FORPAYMENTS ===');
      console.log('Status:', response.status);
      console.log('Raw Response:', responseText);
      console.log('=============================');

      if (!response.ok) {
        console.error('Erro 4ForPayments Status:', response.status);
        console.error('Erro 4ForPayments Body:', responseText);
        return res.status(400).json({ 
          error: `Erro ${response.status}: ${responseText}` 
        });
      }

      try {
        data = JSON.parse(responseText);
        console.log('Dados parseados com sucesso:', data);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.error('Response body que causou erro:', responseText);
        return res.status(500).json({ 
          error: 'Resposta inválida da API de pagamento. Verifique os logs do servidor.' 
        });
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
      status: data.status,
      authorizationCode: data.authorization_code || null,
      transactionId: data.transaction_id || null
    };

    console.log('Resposta final sendo enviada:', paymentResponse);

    // Integração com Utmify se configurado
    if (process.env.UTMIFY_API_TOKEN && data.id) {
      try {
        const urlParams = new URLSearchParams(req.headers.referer?.split('?')[1] || '');
        
        const utmifyOrderData = {
          orderId: data.id,
          platform: "Megaflix",
          paymentMethod: "credit_card",
          status: data.status === "approved" ? "paid" : "waiting_payment",
          createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
          approvedDate: data.status === "approved" ? new Date().toISOString().replace('T', ' ').split('.')[0] : null,
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
            gatewayFeeInCents: Math.round(amount * 100 * 0.05),
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
      }
    }

    res.status(200).json(paymentResponse);

  } catch (error) {
    console.error('Erro ao processar cartão:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    
    // Garantir resposta JSON válida sempre
    try {
      return res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message || 'Falha no processamento do cartão'
      });
    } catch (responseError) {
      console.error('Erro ao enviar resposta:', responseError);
      return res.status(500).end('{"error":"Erro interno do servidor"}');
    }
  }
}