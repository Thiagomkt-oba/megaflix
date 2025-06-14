import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat support API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Mensagem é obrigatória" });
      }

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é um assistente de suporte ao cliente do Megaflix, uma plataforma de streaming que oferece:

- Mais de 14.000 filmes
- Mais de 12.000 séries
- Mais de 500 canais de TV
- Animes, desenhos, novelas e documentários
- Tudo em uma única plataforma

PLANOS DE ASSINATURA:
- Plano Mensal: R$ 37,90/mês
- Plano Anual: R$ 97/ano (economia de mais de 60%)
- Plano Vitalício: R$ 197 (pagamento único, acesso para sempre)

VANTAGENS DO MEGAFLIX:
- Acesso a TODO o conteúdo de Netflix, Amazon Prime, Disney+, HBO Max, Apple TV+, Paramount+, Crunchyroll, Globoplay e YouTube Premium
- Download para assistir offline
- Sem anúncios
- Disponível em todos os dispositivos (celular, TV, computador, TV Box)
- Suporte prioritário

ECONOMIA:
- Assinando todos os serviços separadamente custaria R$ 267,00/mês
- Com o Megaflix você economiza R$ 229,10 por mês
- No plano anual: economia de mais de R$ 2.500 por ano
- No plano vitalício: economia de mais de R$ 30.000 ao longo de 10 anos

Seja sempre prestativo, educado e focado em ajudar o cliente. Destaque as vantagens e economia do Megaflix. Se não souber algo específico, seja honesto mas sempre direcione para os benefícios da plataforma.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      
      res.json({ response });
    } catch (error) {
      console.error("Erro na API do ChatGPT:", error);
      res.status(500).json({ 
        error: "Desculpe, houve um erro interno. Tente novamente em alguns instantes." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
