import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

function getResponseForMessage(message: string): string {
  const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Perguntas específicas sobre quantidade/catálogo
  if (msg.includes("quantos filme") || msg.includes("filme tem") || msg.includes("filme voces") || msg.includes("catalogo filme")) {
    return megaflixFAQ.filmes;
  }
  if (msg.includes("quantas serie") || msg.includes("serie tem") || msg.includes("serie voces") || msg.includes("catalogo serie")) {
    return megaflixFAQ.series;
  }
  if (msg.includes("quantos canal") || msg.includes("canal tem") || msg.includes("tv ao vivo")) {
    return megaflixFAQ.canais;
  }
  
  // Perguntas sobre planos específicos
  if (msg.includes("plano mensal") || msg.includes("valor mensal") || msg.includes("preco mensal") || msg.includes("37")) {
    return megaflixFAQ.mensal;
  }
  if (msg.includes("plano anual") || msg.includes("valor anual") || msg.includes("preco anual") || msg.includes("97")) {
    return megaflixFAQ.anual;
  }
  if (msg.includes("plano vitalicio") || msg.includes("para sempre") || msg.includes("permanente") || msg.includes("197")) {
    return megaflixFAQ.vitalicio;
  }
  
  // Perguntas sobre processo
  if (msg.includes("como assinar") || msg.includes("quero assinar") || msg.includes("contratar") || msg.includes("comprar")) {
    return megaflixFAQ.assinar;
  }
  if (msg.includes("cancelar") || msg.includes("desistir") || msg.includes("parar")) {
    return megaflixFAQ.cancelar;
  }
  
  // Perguntas sobre dispositivos
  if (msg.includes("onde assistir") || msg.includes("quais dispositivo") || msg.includes("compativel")) {
    return megaflixFAQ.dispositivos;
  }
  if (msg.includes("celular") || msg.includes("android") || msg.includes("ios") || msg.includes("app")) {
    return megaflixFAQ.celular;
  }
  if (msg.includes("offline") || msg.includes("download") || msg.includes("sem internet") || msg.includes("baixar")) {
    return megaflixFAQ.offline;
  }
  
  // Perguntas sobre economia
  if (msg.includes("economia") || msg.includes("economizar") || msg.includes("mais barato") || msg.includes("vantagem")) {
    return megaflixFAQ.economia;
  }
  
  // Suporte técnico
  if (msg.includes("erro") || msg.includes("problema") || msg.includes("nao funciona") || msg.includes("ajuda")) {
    return megaflixFAQ.ajuda;
  }
  
  // Perguntas gerais sobre conteúdo
  if (msg.includes("filme")) return megaflixFAQ.filmes;
  if (msg.includes("serie") || msg.includes("novela")) return megaflixFAQ.series;
  if (msg.includes("anime")) return megaflixFAQ.anime;
  if (msg.includes("canal") || msg.includes("tv")) return megaflixFAQ.canais;
  
  // Perguntas gerais sobre planos
  if (msg.includes("plano") || msg.includes("preco") || msg.includes("valor") || msg.includes("custa") || msg.includes("quanto")) {
    return megaflixFAQ.planos;
  }
  
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

      const response = getResponseForMessage(message);
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