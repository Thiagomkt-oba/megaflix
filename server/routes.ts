import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// FAQ completo do Megaflix com respostas inteligentes
const megaflixFAQ = {
  // Informações sobre conteúdo
  filmes: "Temos mais de 14.000 filmes incluindo lançamentos, clássicos, ação, drama, comédia, terror e muito mais. Todo o catálogo Netflix, Prime, Disney+ em um só lugar!",
  series: "Mais de 12.000 séries disponíveis: Netflix originals, séries coreanas, americanas, brasileiras, animes e muito mais. Tudo sem anúncios!",
  anime: "Catálogo completo de animes: Naruto, Attack on Titan, Demon Slayer, One Piece e milhares de outros. Dublado e legendado!",
  canais: "Mais de 500 canais de TV ao vivo: esportes, notícias, entretenimento, infantil. Assista TV tradicional quando quiser!",
  
  // Planos e preços
  planos: "Oferecemos 3 planos: 📱 Mensal R$ 37,90 | 📅 Anual R$ 97 (economia de 60%) | 💎 Vitalício R$ 197 (acesso para sempre). Qual te interessa mais?",
  mensal: "O plano mensal custa R$ 37,90 e inclui acesso total a +14mil filmes, +12mil séries, +500 canais de TV, animes, desenhos e novelas. Sem anúncios!",
  anual: "O plano anual por R$ 97 oferece economia de mais de 60%! São apenas R$ 8,08 por mês. Você economiza mais de R$ 2.500 por ano comparado às outras plataformas.",
  vitalicio: "O plano vitalício por R$ 197 é nosso melhor negócio! Pagamento único e acesso para sempre. Em 2 anos você já economiza comparado ao mensal!",
  
  // Dispositivos e funcionalidades
  dispositivos: "Funciona em TODOS os dispositivos: celular (Android/iOS), Smart TV, computador, TV Box, Chromecast, Apple TV. Até 5 dispositivos simultâneos!",
  celular: "Sim! Temos app para Android e iOS. Você pode assistir e baixar conteúdo para ver offline. Qualidade HD/4K disponível.",
  offline: "Sim! Baixe filmes e séries no app do celular e assista sem internet. Perfeito para viagens!",
  
  // Economia e vantagens
  economia: "Você economiza MUITO! Netflix + Prime + Disney+ + HBO + Apple TV custam R$ 267/mês. Com Megaflix você paga apenas R$ 37,90 e tem TUDO!",
  
  // Processo de assinatura
  assinar: "Para assinar: clique em 'Assinar Agora', escolha seu plano, faça o pagamento e pronto! Acesso liberado na hora. Aceitamos cartão, PIX e PayPal.",
  cancelar: "Para cancelar: acesse 'Minha Conta' > 'Configurações' > 'Cancelar Assinatura'. Você manterá acesso até o fim do período pago.",
  
  // Suporte técnico
  ajuda: "Vamos resolver! Primeiro: verifique sua internet, reinicie o app/dispositivo. Se persistir, me diga qual dispositivo está usando e qual erro aparece.",
  
  // Resposta padrão
  default: `Olá! Sou o assistente do Megaflix 🎬 

Posso te ajudar com:
• 📋 Informações sobre nossos planos (Mensal R$ 37,90, Anual R$ 97, Vitalício R$ 197)
• 🎥 Nosso catálogo (+14mil filmes, +12mil séries, +500 canais)
• 📱 Compatibilidade com dispositivos
• 💰 Economia comparada a outras plataformas
• ⚙️ Suporte técnico

Como posso te ajudar especificamente?`
};

async function getResponseForMessage(message: string): Promise<string> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é um assistente virtual especializado no Megaflix, um serviço de streaming de filmes, séries, doramas, animes, desenhos e novelas. Seu trabalho é fornecer respostas claras e úteis sobre todos os aspectos do serviço.

INFORMAÇÕES DO SERVIÇO:
- Mais de 14.000 filmes (lançamentos, clássicos, ação, drama, comédia, terror)
- Mais de 12.000 séries (Netflix originals, séries coreanas, americanas, brasileiras, animes)
- Mais de 500 canais de TV ao vivo (esportes, notícias, entretenimento, infantil)
- Todo o catálogo Netflix, Prime Video, Disney+, HBO Max, Apple TV+, Paramount+, Crunchyroll, Globoplay e YouTube Premium em um só lugar

PLANOS DE ASSINATURA:
- Plano Mensal: R$ 37,90/mês
- Plano Anual: R$ 97/ano (economia de mais de 60%)
- Plano Vitalício: R$ 197 (pagamento único, acesso para sempre)

COMPATIBILIDADE:
- Celulares (Android/iOS) com app para download
- Smart TVs (Samsung, LG, Sony e outras)
- Computadores (via navegador)
- TV Box, Chromecast, Apple TV
- Até 5 dispositivos simultâneos
- Download para assistir offline no celular

ECONOMIA:
- Assinando todos os serviços separadamente custaria R$ 267/mês
- Com Megaflix você economiza R$ 229,10 por mês
- No plano anual: economia de mais de R$ 2.500 por ano
- No plano vitalício: economia de mais de R$ 30.000 ao longo de 10 anos

FORMAS DE PAGAMENTO: Cartão de crédito, débito, PIX e PayPal

INSTRUÇÕES IMPORTANTES:
- Sempre que perguntarem "como assinar", responda: "Para assinar o serviço, basta clicar no botão 'Assinar Agora' que está destacado na página."
- Para cancelamento: "Acesse 'Minha Conta' > 'Configurações' > 'Cancelar Assinatura'"
- Seja sempre educado, claro e informativo
- Se a pergunta não for sobre o serviço, responda educadamente que só pode fornecer informações sobre o Megaflix
- Destaque sempre as vantagens e economia do serviço`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0].message.content || megaflixFAQ.default;
  } catch (error) {
    console.log("OpenAI API temporariamente indisponível, usando FAQ local");
    // Fallback para FAQ local se API falhar
    return getFallbackResponse(message);
  }
}

function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Perguntas sobre assinatura
  if (msg.includes("como assinar") || msg.includes("como faço para assinar")) {
    return "Para assinar o serviço, basta clicar no botão 'Assinar Agora' que está destacado na página. O processo é rápido e simples: escolha seu plano, faça o pagamento e tenha acesso imediato a todo nosso catálogo!";
  }
  
  // Perguntas sobre planos específicos
  if (msg.includes("plano mensal") || msg.includes("o que inclui mensal")) {
    return "O plano mensal por R$ 37,90 inclui acesso completo a mais de 14.000 filmes, 12.000 séries, 500 canais de TV, animes, doramas e novelas. Sem anúncios e com qualidade HD/4K!";
  }
  if (msg.includes("plano anual") || msg.includes("o que inclui anual")) {
    return "O plano anual por R$ 97 oferece o mesmo conteúdo completo do mensal, mas com economia de mais de 60%! São apenas R$ 8,08 por mês. Uma economia de mais de R$ 2.500 por ano comparado às outras plataformas.";
  }
  if (msg.includes("plano vitalicio") || msg.includes("o que inclui vitalicio")) {
    return "O plano vitalício por R$ 197 é nosso melhor negócio! Pagamento único e acesso para sempre a todo nosso catálogo. Em apenas 2 anos você já economiza comparado ao plano mensal!";
  }
  
  // Perguntas sobre dispositivos
  if (msg.includes("quais dispositivos") || msg.includes("onde posso assistir") || msg.includes("compativel")) {
    return "O Megaflix é compatível com TODOS os dispositivos: celulares (Android/iOS), Smart TVs, computadores, TV Box, Chromecast e Apple TV. Você pode usar até 5 dispositivos simultaneamente!";
  }
  if (msg.includes("assistir offline") || msg.includes("download") || msg.includes("sem internet")) {
    return "Sim! No app do celular você pode baixar filmes e séries para assistir offline. Perfeito para viagens ou quando estiver sem internet!";
  }
  
  // Perguntas sobre cancelamento
  if (msg.includes("como cancelar") || msg.includes("cancelar assinatura")) {
    return "Para cancelar sua assinatura, acesse 'Minha Conta' > 'Configurações' > 'Cancelar Assinatura'. Você manterá acesso até o fim do período já pago.";
  }
  
  // Perguntas sobre teste gratuito
  if (msg.includes("teste gratuito") || msg.includes("periodo de teste")) {
    return "Atualmente não oferecemos período de teste gratuito, mas você pode optar pelo plano mensal para conhecer nosso serviço. Com nossos preços baixos, vale muito a pena experimentar!";
  }
  
  // Perguntas sobre conteúdo específico
  if (msg.includes("quantos filme") || msg.includes("filme tem")) {
    return "Temos mais de 14.000 filmes incluindo lançamentos, clássicos, ação, drama, comédia, terror e muito mais. Todo o catálogo Netflix, Prime Video, Disney+ em um só lugar!";
  }
  if (msg.includes("quantas serie") || msg.includes("serie tem")) {
    return "Mais de 12.000 séries disponíveis: Netflix originals, séries coreanas, americanas, brasileiras, animes e muito mais. Tudo sem anúncios e em HD/4K!";
  }
  if (msg.includes("quantos canal") || msg.includes("tv ao vivo")) {
    return "Oferecemos mais de 500 canais de TV ao vivo: esportes, notícias, entretenimento, infantil. Assista TV tradicional quando quiser!";
  }
  
  // Perguntas gerais sobre planos
  if (msg.includes("plano") || msg.includes("preco") || msg.includes("valor") || msg.includes("quanto custa")) {
    return "Oferecemos 3 planos: Mensal R$ 37,90, Anual R$ 97 (economia de 60%) e Vitalício R$ 197 (acesso para sempre). Compare: outras plataformas juntas custam R$ 267/mês!";
  }
  
  // Perguntas sobre formas de pagamento
  if (msg.includes("como pagar") || msg.includes("formas de pagamento") || msg.includes("pix")) {
    return "Aceitamos cartão de crédito, débito, PIX e PayPal. O pagamento é seguro e o acesso é liberado na hora!";
  }
  
  // Perguntas sobre economia
  if (msg.includes("economia") || msg.includes("mais barato") || msg.includes("vantagem")) {
    return "Você economiza MUITO! Netflix + Prime + Disney+ + HBO + Apple TV custam R$ 267/mês. Com Megaflix você paga apenas R$ 37,90 e tem TUDO! Uma economia de R$ 229,10 por mês!";
  }
  
  // Perguntas gerais sobre conteúdo
  if (msg.includes("filme")) return megaflixFAQ.filmes;
  if (msg.includes("serie") || msg.includes("novela")) return megaflixFAQ.series;
  if (msg.includes("anime")) return megaflixFAQ.anime;
  if (msg.includes("canal") || msg.includes("tv")) return megaflixFAQ.canais;
  
  return megaflixFAQ.default;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat de suporte inteligente
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Mensagem é obrigatória" });
      }

      const response = await getResponseForMessage(message);
      res.json({ response });
      
    } catch (error) {
      console.error("Erro no chat:", error);
      res.json({ 
        response: "Olá! Sou o assistente do Megaflix. Temos planos a partir de R$ 37,90/mês com acesso a +14mil filmes e +12mil séries. Como posso ajudar?" 
      });
    }
  });

  // API de pagamento PIX
  app.post("/api/create-pix-payment", async (req, res) => {
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

      // Monta o payload correto para 4ForPayments API
      const pixData = {
        name: customer.name,
        email: customer.email,
        cpf: customer.document.replace(/\D/g, ''),
        phone: customer.phone?.replace(/\D/g, '') || '',
        paymentMethod: "PIX",
        amount: Math.round(amount * 100), // Converte para centavos
        traceable: true,
        items: items.map((item: any) => ({
          unitPrice: Math.round((item.priceInCents || amount * 100) / (item.quantity || 1)),
          title: item.name,
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
        referrerUrl: req.headers.referer || `https://${req.headers.host}`
      };

      let data;

      // Verifica se a API key está configurada
      if (!process.env.FOR4PAYMENTS_API_KEY) {
        // Versão de demonstração - simula resposta da API
        data = {
          id: `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: "waiting_payment",
          pixQrCode: "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5925MEGAFLIX%20STREAMING%20LTDA6009SAO%20PAULO62070503***630469F0",
          pixCode: "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5925MEGAFLIX STREAMING LTDA6009SAO PAULO62070503***630469F0"
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
          return res.status(400).json({ 
            error: `Erro ${response.status}: ${responseText}` 
          });
        }

        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Erro ao parsear JSON:', parseError);
          console.error('Response body que causou erro:', responseText);
          return res.status(500).json({ 
            error: 'Resposta inválida da API de pagamento' 
          });
        }
      }

      // Extrai dados necessários da resposta
      const paymentResponse = {
        id: data.id,
        status: data.status,
        qrCode: data.pixQrCode,
        qrCodeText: data.pixCode,
        pixUrl: data.pixQrCode
      };

      res.status(200).json(paymentResponse);

    } catch (error) {
      console.error('Erro ao criar PIX:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  });

  // API de pagamento cartão
  app.post("/api/create-card-payment", async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { customer, card, items, amount } = req.body;

      // Validação dos dados
      if (!customer?.name || !customer?.email || !customer?.document) {
        return res.status(400).json({ error: 'Dados do cliente obrigatórios' });
      }

      if (!card?.number || !card?.expiryDate || !card?.cvv || !card?.holderName) {
        return res.status(400).json({ error: 'Dados do cartão obrigatórios' });
      }

      // Processa dados do cartão
      const [month, year] = card.expiryDate.split('/');
      const fullYear = year.length === 2 ? `20${year}` : year;

      // Monta o payload correto para 4ForPayments API
      const cardData = {
        name: customer.name,
        email: customer.email,
        cpf: customer.document.replace(/\D/g, ''),
        phone: customer.phone?.replace(/\D/g, '') || '',
        paymentMethod: "CREDIT_CARD",
        amount: Math.round(amount * 100), // Converte para centavos
        traceable: true,
        items: items.map((item: any) => ({
          unitPrice: Math.round((item.priceInCents || amount * 100) / (item.quantity || 1)),
          title: item.name,
          quantity: item.quantity || 1,
          tangible: false
        })),
        creditCard: {
          number: card.number.replace(/\D/g, ''),
          holder_name: card.holderName,
          cvv: card.cvv,
          expiration_month: month,
          expiration_year: fullYear,
          installments: 1
        },
        cep: "01000000",
        street: "Rua Exemplo",
        number: "123",
        district: "Centro",
        city: "São Paulo",
        state: "SP",
        checkoutUrl: `https://${req.headers.host}/checkout`,
        referrerUrl: req.headers.referer || `https://${req.headers.host}`
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
        // Chama a API da 4ForPayments
        const response = await fetch("https://app.for4payments.com.br/api/v1/transaction.purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": process.env.FOR4PAYMENTS_API_KEY
          },
          body: JSON.stringify(cardData)
        });

        data = await response.json();

        if (!response.ok) {
          console.error('Erro 4ForPayments:', data);
          return res.status(400).json({ 
            error: data.message || 'Erro ao processar cartão' 
          });
        }
      }

      // Extrai dados necessários da resposta
      const paymentResponse = {
        id: data.id,
        status: data.status,
        authorizationCode: data.authorization_code,
        transactionId: data.transaction_id
      };

      res.status(200).json(paymentResponse);

    } catch (error) {
      console.error('Erro ao processar cartão:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}