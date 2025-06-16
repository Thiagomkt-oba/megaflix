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
    const webhookData = req.body;
    
    // Log para debug
    console.log('Webhook 4ForPayments recebido:', JSON.stringify(webhookData, null, 2));

    const {
      id,
      status,
      payment_method,
      customer,
      items,
      created_at,
      approved_at
    } = webhookData;

    // Processa diferentes status de pagamento
    let utmifyStatus = 'waiting_payment';
    let approvedDate = null;

    if (status === 'approved' || status === 'paid') {
      utmifyStatus = 'paid';
      approvedDate = approved_at || new Date().toISOString().replace('T', ' ').split('.')[0];
    } else if (status === 'refused' || status === 'declined') {
      utmifyStatus = 'refused';
    } else if (status === 'refunded') {
      utmifyStatus = 'refunded';
    }

    // Atualiza no Utmify se configurado
    if (process.env.UTMIFY_API_TOKEN && id) {
      try {
        // Calcula valores
        const totalAmount = items?.reduce((sum, item) => sum + (item.value * item.quantity), 0) || 0;
        
        const utmifyOrderData = {
          orderId: id,
          platform: "Megaflix",
          paymentMethod: payment_method === 'pix' ? 'pix' : 'credit_card',
          status: utmifyStatus,
          createdAt: created_at || new Date().toISOString().replace('T', ' ').split('.')[0],
          approvedDate,
          refundedAt: status === 'refunded' ? new Date().toISOString().replace('T', ' ').split('.')[0] : null,
          customer: {
            name: customer?.name || 'Cliente',
            email: customer?.email || 'cliente@megaflix.com',
            phone: customer?.phone || null,
            document: customer?.document || null,
            country: "BR",
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
          },
          products: items?.map(item => ({
            id: "megaflix-subscription",
            name: item.name || "Assinatura Megaflix",
            planId: null,
            planName: null,
            quantity: item.quantity || 1,
            priceInCents: Math.round((item.value || 3790) * 100)
          })) || [{
            id: "megaflix-subscription",
            name: "Assinatura Megaflix",
            planId: null,
            planName: null,
            quantity: 1,
            priceInCents: 3790
          }],
          trackingParameters: {
            src: null,
            sck: null,
            utm_source: null,
            utm_campaign: null,
            utm_medium: null,
            utm_content: null,
            utm_term: null
          },
          commission: {
            totalPriceInCents: Math.round(totalAmount * 100),
            gatewayFeeInCents: Math.round(totalAmount * 100 * 0.05),
            userCommissionInCents: Math.round(totalAmount * 100 * 0.95)
          }
        };

        const utmifyResponse = await fetch("https://api.utmify.com.br/api-credentials/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": process.env.UTMIFY_API_TOKEN
          },
          body: JSON.stringify(utmifyOrderData)
        });

        if (!utmifyResponse.ok) {
          console.error('Erro ao atualizar Utmify:', await utmifyResponse.text());
        } else {
          console.log('Utmify atualizado com sucesso para pedido:', id);
        }

      } catch (utmifyError) {
        console.error('Erro na integração Utmify:', utmifyError);
      }
    }

    // Aqui você pode adicionar lógica adicional como:
    // - Enviar email de confirmação
    // - Ativar conta do usuário
    // - Notificar sistemas internos
    
    if (utmifyStatus === 'paid') {
      console.log(`Pagamento aprovado para pedido ${id} - Cliente: ${customer?.email}`);
      
      // TODO: Implementar ativação da conta Megaflix
      // - Criar conta de usuário
      // - Enviar email de boas-vindas
      // - Ativar assinatura
    }

    // Responde com sucesso para o webhook
    res.status(200).json({ 
      received: true,
      orderId: id,
      status: utmifyStatus
    });

  } catch (error) {
    console.error('Erro no webhook 4ForPayments:', error);
    res.status(500).json({ 
      error: 'Erro ao processar webhook' 
    });
  }
}
