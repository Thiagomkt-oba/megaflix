import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    // Ensure JSON response in all cases
    res.setHeader('Content-Type', 'application/json');
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).json({ message: 'OK' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Mensagem é obrigatória" });
      }

      // Get response from OpenAI
      const response = await getResponseForMessage(message);
      return res.status(200).json({ response });
      
    } catch (error) {
      console.error("Erro no chat:", error);
      return res.status(500).json({ 
        response: "Olá! Sou o assistente do Megaflix. Temos planos a partir de R$ 37,90/mês com acesso a +14mil filmes e +12mil séries. Como posso ajudar?"
      });
    }

  } catch (globalError) {
    // Global error handler to ensure JSON response in all cases
    console.error("Global chat function error:", globalError);
    try {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        response: "Olá! Sou o assistente do Megaflix. Como posso ajudar você hoje?"
      });
    } catch (responseError) {
      console.error("Failed to send chat error response:", responseError);
    }
  }
}

async function getResponseForMessage(message) {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é um atendente virtual humano do Megaflix, uma plataforma de streaming premium. Responda como se fosse um atendente real de uma empresa de streaming, sendo prestativo, amigável e conversacional.

SOBRE O MEGAFLIX:
- Plataforma de streaming com +14.000 filmes, +12.000 séries, +500 canais de TV ao vivo
- Inclui conteúdo de Netflix, Prime Video, Disney+, HBO Max, Apple TV+, Paramount+, Crunchyroll, Globoplay e YouTube Premium
- Funciona em todos os dispositivos: celular, Smart TV, computador, TV Box, até 5 dispositivos simultâneos
- Download offline disponível no app móvel

PLANOS E PREÇOS:
- Mensal: R$ 37,90/mês
- Anual: R$ 97/ano (economia de 60% - apenas R$ 8,08/mês)
- Vitalício: R$ 197 (pagamento único, acesso para sempre)
- Formas de pagamento: cartão, PIX, PayPal

ECONOMIA REAL:
- Outras plataformas separadas custam R$ 267/mês
- Megaflix custa apenas R$ 37,90/mês
- Economia anual de mais de R$ 2.500

INSTRUÇÕES DE ATENDIMENTO:
1. Responda a QUALQUER pergunta como um atendente humano faria
2. Para perguntas sobre o Megaflix, seja detalhado e prestativo
3. Para perguntas gerais (clima, notícias, dicas, etc.), responda naturalmente como um atendente amigável
4. Use linguagem coloquial brasileira, seja caloroso e acolhedor
5. Sempre tente conectar a conversa de volta ao Megaflix quando apropriado
6. Para assinar: "Clique em 'Assinar Agora' na página"
7. Para cancelar: "Acesse 'Minha Conta' > 'Configurações' > 'Cancelar'"
8. Seja empático, paciente e sempre disposto a ajudar

Exemplo de tom: "Oi! Que legal sua pergunta! Deixa eu te ajudar com isso..." / "Nossa, que situação! Vou te explicar certinho..." / "Perfeito! Fico feliz em esclarecer isso para você..."

Responda como se você fosse uma pessoa real trabalhando no atendimento ao cliente, não como um robô.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 400,
      temperature: 0.8,
    });

    return completion.choices[0].message.content || getFallbackResponse(message);
  } catch (error) {
    console.log("OpenAI API temporariamente indisponível, usando FAQ local");
    // Fallback para FAQ local se API falhar
    return getFallbackResponse(message);
  }
}

function getFallbackResponse(message) {
  const msg = message.toLowerCase();
  
  // FAQ básico para fallback
  const megaflixFAQ = {
    filmes: "Temos mais de 14.000 filmes incluindo lançamentos, clássicos, ação, drama, comédia, terror e muito mais. Todo o catálogo Netflix, Prime, Disney+ em um só lugar!",
    series: "Mais de 12.000 séries disponíveis: Netflix originals, séries coreanas, americanas, brasileiras, animes e muito mais. Tudo sem anúncios!",
    anime: "Catálogo completo de animes: Naruto, Attack on Titan, Demon Slayer, One Piece e milhares de outros. Dublado e legendado!",
    canais: "Mais de 500 canais de TV ao vivo: esportes, notícias, entretenimento, infantil. Assista TV tradicional quando quiser!",
    planos: "Oferecemos 3 planos: 📱 Mensal R$ 37,90 | 📅 Anual R$ 97 (economia de 60%) | 💎 Vitalício R$ 197 (acesso para sempre). Qual te interessa mais?",
    default: `Olá! Sou o assistente do Megaflix 🎬 

Posso te ajudar com:
• 📋 Informações sobre nossos planos (Mensal R$ 37,90, Anual R$ 97, Vitalício R$ 197)
• 🎥 Nosso catálogo (+14mil filmes, +12mil séries, +500 canais)
• 📱 Compatibilidade com dispositivos
• 💰 Economia comparada a outras plataformas
• ⚙️ Suporte técnico

Como posso te ajudar especificamente?`
  };

  // Respostas básicas
  if (msg.includes("preco") || msg.includes("plano") || msg.includes("valor")) {
    return "Que bom que tem interesse! " + megaflixFAQ.planos;
  }
  
  if (msg.includes("filme")) return "Que bom que gosta de filmes! " + megaflixFAQ.filmes;
  if (msg.includes("serie") || msg.includes("novela")) return "Séries são vida! " + megaflixFAQ.series;
  if (msg.includes("anime")) return "Otaku detected! " + megaflixFAQ.anime;
  if (msg.includes("canal") || msg.includes("tv")) return "TV ao vivo é demais! " + megaflixFAQ.canais;
  
  // Resposta padrão mais humanizada para qualquer pergunta
  return `Oi! Obrigado por entrar em contato!

Sua pergunta é interessante! Embora eu seja especialista em entretenimento, posso não ter todas as respostas do mundo, mas tenho TODAS as respostas sobre diversão!

No Megaflix você encontra:
• +14.000 filmes (de lançamentos a clássicos)
• +12.000 séries (incluindo Netflix, Prime, Disney+)  
• +500 canais de TV ao vivo
• Planos a partir de R$ 37,90/mês

Como posso te ajudar especificamente com nossa plataforma? Ou quer saber mais sobre nossos planos incríveis?`;
}
