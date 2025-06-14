import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// FAQ inteligente do Megaflix
const faqData = {
  // Planos e Preços
  "planos": "Oferecemos 3 planos: 📱 Mensal R$ 37,90 | 📅 Anual R$ 97 (economia de 60%) | 💎 Vitalício R$ 197 (acesso para sempre). Qual te interessa mais?",
  "preço": "Nossos preços são: Mensal R$ 37,90, Anual R$ 97 e Vitalício R$ 197. Compare: outras plataformas juntas custam R$ 267/mês!",
  "mensal": "O plano mensal custa R$ 37,90 e inclui acesso total a +14mil filmes, +12mil séries, +500 canais de TV, animes, desenhos e novelas. Sem anúncios!",
  "anual": "O plano anual por R$ 97 oferece economia de mais de 60%! São apenas R$ 8,08 por mês. Você economiza mais de R$ 2.500 por ano comparado às outras plataformas.",
  "vitalício": "O plano vitalício por R$ 197 é nosso melhor negócio! Pagamento único e acesso para sempre. Em 2 anos você já economiza comparado ao mensal!",
  
  // Conteúdo
  "filmes": "Temos mais de 14.000 filmes incluindo lançamentos, clássicos, ação, drama, comédia, terror e muito mais. Todo o catálogo Netflix, Prime, Disney+ em um só lugar!",
  "séries": "Mais de 12.000 séries disponíveis: Netflix originals, séries coreanas, americanas, brasileiras, animes e muito mais. Tudo sem anúncios!",
  "anime": "Catálogo completo de animes: Naruto, Attack on Titan, Demon Slayer, One Piece e milhares de outros. Dublado e legendado!",
  "tv": "Mais de 500 canais de TV ao vivo: esportes, notícias, entretenimento, infantil. Assista TV tradicional quando quiser!",
  
  // Dispositivos e Compatibilidade
  "dispositivos": "Funciona em TODOS os dispositivos: celular (Android/iOS), Smart TV, computador, TV Box, Chromecast, Apple TV. Até 5 dispositivos simultâneos!",
  "celular": "Sim! Temos app para Android e iOS. Você pode assistir e baixar conteúdo para ver offline. Qualidade HD/4K disponível.",
  "smarttv": "Compatível com Smart TVs Samsung, LG, Sony e outras. Também funciona com TV Box, Chromecast, Apple TV e cabo HDMI.",
  "offline": "Sim! Baixe filmes e séries no app do celular e assista sem internet. Perfeito para viagens!",
  
  // Economia
  "economia": "Você economiza MUITO! Netflix + Prime + Disney+ + HBO + Apple TV custam R$ 267/mês. Com Megaflix você paga apenas R$ 37,90 e tem TUDO!",
  "comparação": "Comparando: Netflix (R$ 45) + Amazon Prime (R$ 15) + Disney+ (R$ 33) + HBO Max (R$ 35) + Apple TV (R$ 21) + outros = R$ 267/mês. Megaflix = R$ 37,90!",
  
  // Suporte Técnico
  "não funciona": "Vamos resolver! Primeiro: verifique sua internet, reinicie o app/dispositivo. Se persistir, me diga qual dispositivo está usando e qual erro aparece.",
  "instalação": "Para instalar: Android (Google Play), iOS (App Store), Smart TV (busque 'Megaflix' na loja de apps), ou acesse pelo navegador em megaflix.com",
  "senha": "Esqueceu a senha? Use 'Esqueci minha senha' na tela de login. Se não receber o email, verifique spam ou me informe seu email cadastrado.",
  
  // Assinatura
  "assinar": "Para assinar: clique em 'Assinar Agora', escolha seu plano, faça o pagamento e pronto! Acesso liberado na hora. Aceitamos cartão, PIX e PayPal.",
  "cancelar": "Para cancelar: acesse 'Minha Conta' > 'Configurações' > 'Cancelar Assinatura'. Você manterá acesso até o fim do período pago.",
  "mudança": "Pode mudar de plano a qualquer momento! Acesse 'Minha Conta' > 'Alterar Plano'. Upgrading é instantâneo, downgrade vale a partir do próximo ciclo."
};

function findBestMatch(userMessage: string): string {
  const message = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Palavras-chave para cada categoria
  const keywords = {
    "planos": ["plano", "preco", "valor", "custa", "quanto", "pagar"],
    "mensal": ["mensal", "mes", "37"],
    "anual": ["anual", "ano", "97"],
    "vitalício": ["vitalicio", "para sempre", "197", "unico"],
    "filmes": ["filme", "movie"],
    "séries": ["serie", "series", "novela"],
    "anime": ["anime", "manga", "naruto", "attack"],
    "tv": ["canal", "tv", "televisao"],
    "dispositivos": ["dispositivo", "onde", "computador"],
    "celular": ["celular", "android", "ios", "app", "aplicativo"],
    "smarttv": ["smart tv", "chromecast"],
    "offline": ["offline", "baixar", "download", "sem internet"],
    "economia": ["economia", "economizar", "comparar"],
    "não funciona": ["nao funciona", "erro", "problema", "bug"],
    "instalação": ["instalar", "baixar", "como usar"],
    "assinar": ["assinar", "como assinar", "pagamento"],
    "cancelar": ["cancelar", "desistir"]
  };

  let bestMatch = "";
  let maxScore = 0;

  for (const [category, words] of Object.entries(keywords)) {
    const score = words.reduce((acc, word) => {
      return acc + (message.includes(word) ? 1 : 0);
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      bestMatch = category;
    }
  }

  return bestMatch || "default";
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat support API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Mensagem é obrigatória" });
      }

      // Usa sistema de FAQ inteligente
      const category = findBestMatch(message);
      let response = faqData[category as keyof typeof faqData];

      // Resposta padrão se não encontrou nada
      if (!response) {
        response = `Olá! Sou o assistente do Megaflix 🎬 

Posso te ajudar com:
• 📋 Informações sobre nossos planos (Mensal R$ 37,90, Anual R$ 97, Vitalício R$ 197)
• 🎥 Nosso catálogo (+14mil filmes, +12mil séries, +500 canais)
• 📱 Compatibilidade com dispositivos
• 💰 Economia comparada a outras plataformas
• ⚙️ Suporte técnico

Como posso te ajudar especificamente?`;
      }
      
      res.json({ response });
    } catch (error) {
      console.error("Erro no chat:", error);
      res.json({ 
        response: "Olá! Sou o assistente do Megaflix. Temos planos a partir de R$ 37,90/mês com acesso a +14mil filmes e +12mil séries. Como posso ajudar?" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
