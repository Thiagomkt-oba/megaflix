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

    // Monta o payload para 4ForPayments
    const pixData = {
      customer: {
        name: customer.name,
        email: customer.email,
        document: customer.document.replace(/\D/g, ''),
        phone: customer.phone?.replace(/\D/g, '') || ''
      },
      billing: {
        name: customer.name,
        address: {
          country: "br",
          state: "SP",
          city: "São Paulo",
          zipcode: "01000000",
          street: "Rua Exemplo",
          number: "123",
          neighborhood: "Centro"
        }
      },
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity || 1,
        value: Math.round((item.priceInCents || amount * 100) / 100 * 100) // Garante centavos
      })),
      payment: {
        method: "pix"
      },
      notification_url: `https://${req.headers.host}/api/webhook-for4payments`
    };

    let data;

    // Verifica se a API key está configurada
    if (!process.env.FOR4PAYMENTS_API_KEY) {
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
      const response = await fetch("https://app.for4payments.com.br/api/v1/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.FOR4PAYMENTS_API_KEY
        },
        body: JSON.stringify(pixData)
      });

      data = await response.json();

      if (!response.ok) {
        console.error('Erro 4ForPayments:', data);
        return res.status(400).json({ 
          error: data.message || 'Erro ao gerar PIX' 
        });
      }
    }

    // Extrai dados necessários da resposta
    const paymentResponse = {
      id: data.id,
      status: data.status,
      qrCode: data.pix?.qr_code,
      qrCodeText: data.pix?.qr_code_text,
      pixUrl: data.pix?.url
    };

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