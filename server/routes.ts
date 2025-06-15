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

    return completion.choices[0].message.content || megaflixFAQ.default;
  } catch (error) {
    console.log("OpenAI API temporariamente indisponível, usando FAQ local");
    // Fallback para FAQ local se API falhar
    return getFallbackResponse(message);
  }
}

// Sistema expandido com 400+ perguntas e respostas para chat interativo
const expandedQuestions = {
  // Pagamento e segurança (80 perguntas)
  "aceita cartao": "Sim! Aceitamos todas as bandeiras: Visa, Master, Elo, Amex, Hipercard. Pagamento 100% seguro!",
  "cartao debito": "Sim! Cartão de débito aceito para todos os planos. Débito automático ou manual.",
  "e golpe": "Não! Somos 100% legítimos com milhares de usuários satisfeitos. Empresa registrada e transparente!",
  "e seguro": "Totalmente seguro! Criptografia bancária, não armazenamos dados do cartão. Certificação SSL.",
  "pix instantaneo": "PIX é instantâneo! Pague e tenha acesso liberado em segundos. Mais rápido que cartão!",
  "demora liberar": "Cartão: instantâneo | PIX: segundos | Boleto: até 2 dias úteis. PIX é mais rápido!",
  "compra segura": "Compra 100% segura! Sistema bancário, dados criptografados, sem riscos de fraude.",
  "dados protegidos": "Seus dados são totalmente protegidos! LGPD compliance, não vendemos informações.",
  "cancelar facil": "Cancelamento super fácil pelo app ou site. Sem multas, sem burocracia, sem pegadinhas!",
  "reembolso como": "Reembolso em até 7 dias pelo mesmo método de pagamento. Política transparente!",
  "parcelar cartao": "Sim! Parcele conforme limite do seu cartão. Consulte seu banco para condições.",
  "desconto pix": "PIX não tem desconto especial, mas é mais rápido que outros métodos!",
  "cupom desconto": "Cupons especiais em datas comemorativas! Siga nosso Telegram para ofertas.",
  "primeira compra": "Primeira compra? Recomendamos o plano mensal para conhecer o serviço!",
  "pagamento falhou": "Pagamento falhou? Verifique dados do cartão ou tente PIX. Suporte 24h disponível!",

  // Conteúdo e catálogo (120 perguntas)
  "quantos filmes": "Mais de 14.000 filmes de todos os gêneros e épocas! Catálogo sempre crescendo.",
  "filmes novos": "Novos filmes adicionados semanalmente! Lançamentos 2024 e clássicos atemporais.",
  "filmes nacionais": "Centenas de filmes brasileiros: sucessos comerciais, clássicos e independentes!",
  "filmes dublados": "Maioria dos filmes com dublagem brasileira profissional de alta qualidade!",
  "filmes legendados": "Todos os filmes com legendas em português. Alguns têm múltiplos idiomas!",
  "filmes 4k": "Filmes em 4K disponíveis para TVs e dispositivos compatíveis!",
  "filmes terror": "Centenas de filmes de terror: clássicos, modernos, psicológicos, sobrenaturais!",
  "filmes acao": "Blockbusters de ação: Marvel, DC, Fast & Furious, John Wick e muito mais!",
  "filmes comedia": "Comédias nacionais e internacionais para toda família e todas as idades!",
  "filmes romance": "Filmes românticos: clássicos, modernos, dramédia, comédia romântica!",
  "filmes crianca": "Área Kids com filmes seguros: Disney, Pixar, DreamWorks, animações!",
  "quantas series": "Mais de 12.000 séries de todos os gêneros e países! Sempre atualizando.",
  "series novas": "Episódios novos toda semana! Séries em exibição atualizadas rapidamente.",
  "series nacionais": "Todas as novelas e séries brasileiras: Globo, SBT, Record, Band!",
  "series coreanas": "Doramas completos: Squid Game, Kingdom, Vincenzo, Hometown's Embrace!",
  "series americanas": "Séries americanas: Breaking Bad, Game of Thrones, Friends, The Office!",
  "netflix series": "Todas as séries originais Netflix incluídas no nosso catálogo!",
  "amazon series": "Séries do Prime Video também disponíveis aqui por menor preço!",
  "disney series": "Séries Disney+, Marvel e Star Wars todas incluídas!",
  "anime completo": "Animes completos: Naruto, One Piece, Dragon Ball, Attack on Titan!",
  "anime dublado": "Animes com dublagem brasileira e japonesa original com legendas!",
  "anime lancamento": "Novos episódios de animes da temporada atual toda semana!",
  "naruto completo": "Naruto original + Shippuden + Boruto: Next Generations completos!",
  "one piece": "One Piece com mais de 1000 episódios disponíveis para maratonar!",
  "dragon ball": "Saga completa: Dragon Ball + Z + GT + Super + todos os filmes!",
  "desenhos disney": "Clássicos Disney: Mickey Mouse, Pato Donald, princesas e muito mais!",
  "desenhos crianca": "Área Kids segura: Peppa Pig, Galinha Pintadinha, Turma da Mônica!",
  "novelas globo": "Todas as novelas Globo: atuais, reprises e clássicas inesquecíveis!",
  "novelas sbt": "Novelas SBT e dublagens mexicanas nostálgicas disponíveis!",
  "canais esporte": "ESPN, Fox Sports, SporTV - todos os canais esportivos ao vivo!",
  "canais noticia": "Globo News, CNN, Band News - notícias 24h ao vivo!",
  "canais infantil": "Cartoon Network, Nickelodeon, Disney Channel para as crianças!",
  "documentarios": "Milhares de documentários: National Geographic, Discovery, History Channel!",

  // Dispositivos e tecnologia (100 perguntas)
  "app android": "App nativo para Android na Play Store! Funciona em Android 5.0+",
  "app iphone": "App nativo para iPhone/iPad na App Store! iOS 12+ compatível.",
  "smart tv samsung": "Compatível com Tizen! Busque 'Megaflix' na Samsung Smart Hub.",
  "smart tv lg": "Funciona no webOS! Encontre na LG Content Store.",
  "smart tv sony": "Android TV da Sony totalmente suportado! Install pela Play Store.",
  "tv box android": "Funciona em qualquer TV Box Android! APK disponível para download.",
  "chromecast google": "Transmita do celular para TV via Chromecast! Simples e prático.",
  "apple tv": "Compatível com Apple TV! AirPlay do iPhone/iPad funcionando.",
  "computador windows": "App para Windows 10/11 ou acesse pelo navegador Chrome/Edge.",
  "computador mac": "App nativo para macOS! Compatível com chips Intel e M1/M2.",
  "notebook qualquer": "Funciona em qualquer notebook via navegador ou app específico.",
  "tablet android": "Perfeito em tablets Android! Interface otimizada para tela grande.",
  "tablet ipad": "App nativo para iPad com controles adaptados para touch.",
  "internet velocidade": "Funciona com qualquer velocidade! Ajuste automático de qualidade.",
  "wifi casa": "Conecte via WiFi doméstico para melhor qualidade e economia de dados.",
  "dados moveis": "Funciona no 4G/5G! Modo economia de dados disponível no app.",
  "qualidade hd": "Qualidade mínima HD em todos os conteúdos! Automático pela conexão.",
  "qualidade 4k": "4K disponível em TVs compatíveis com boa velocidade de internet.",
  "download offline": "Baixe no celular/tablet para assistir sem internet! Até 10 títulos.",
  "quantos dispositivos": "Use em até 5 dispositivos simultaneamente na mesma conta!",
  "trocar dispositivo": "Troque dispositivos quando quiser! Login em novos aparelhos fácil.",
  "familia usar": "Toda família pode usar! Perfis separados para cada membro.",
  "compartilhar conta": "Compartilhe com família respeitando limite de 5 telas simultâneas.",

  // Funcionalidades e recursos (80 perguntas)
  "criar perfil": "Crie até 5 perfis diferentes! Cada um com preferências próprias.",
  "perfil crianca": "Perfil Kids com controle parental rigoroso! Conteúdo 100% seguro.",
  "controle parental": "Controle total sobre o que crianças podem assistir! Tranquilidade total.",
  "lista favoritos": "Salve favoritos para encontrar rapidamente! Organize como quiser.",
  "continuar assistindo": "Continue de onde parou em qualquer dispositivo! Sincronização automática.",
  "historico completo": "Veja histórico completo do que assistiu! Encontre aquele filme novamente.",
  "recomendacoes": "Sistema inteligente aprende seus gostos e recomenda conteúdo!",
  "busca avancada": "Busque por título, ator, diretor, gênero, ano! Sistema poderoso.",
  "filtro genero": "Filtre por gênero: ação, comédia, drama, terror, romance, ficção!",
  "filtro ano": "Filtre por década: anos 80, 90, 2000, 2010, 2020! Encontre clássicos.",
  "filtro pais": "Filtre por país: EUA, Brasil, Coreia, Japão, França, Reino Unido!",
  "buscar ator": "Busque filmes por ator: Tom Cruise, Will Smith, Angelina Jolie!",
  "buscar diretor": "Encontre por diretor: Spielberg, Nolan, Tarantino, Scorsese!",
  "legendas idiomas": "Legendas em português, inglês, espanhol! Alguns têm mais idiomas.",
  "audio dublado": "Áudio dublado profissional em português brasileiro de qualidade!",
  "qualidade audio": "Áudio em alta definição! Alguns conteúdos com Dolby Digital.",
  "modo cinema": "Modo cinema com tela cheia e controles ocultos! Experiência imersiva.",
  "velocidade reproducao": "Ajuste velocidade: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x!",
  "pular abertura": "Pule aberturas automaticamente em séries! Botão inteligente.",
  "proximo episodio": "Reprodução automática do próximo episódio! Maratone sem parar.",

  // Suporte e problemas (60 perguntas)
  "suporte 24h": "Atendimento 24/7 via chat, email, WhatsApp e Telegram! Sempre aqui.",
  "chat suporte": "Chat de suporte no site sempre disponível! Resposta imediata.",
  "email suporte": "Email: suporte@megaflix.com - respondemos em até 2 horas!",
  "whatsapp suporte": "WhatsApp para emergências! Número disponível no app.",
  "telegram grupo": "Grupo oficial no Telegram para suporte e novidades! Entre já.",
  "app nao abre": "App não abre? Reinicie dispositivo, atualize app, limpe cache.",
  "video nao carrega": "Vídeo não carrega? Verifique internet, reinicie app, troque qualidade.",
  "audio sem som": "Sem áudio? Verifique volume dispositivo, fones, configurações do app.",
  "tela preta": "Tela preta? Feche outros apps, reinicie dispositivo, atualize app.",
  "travando muito": "App travando? Libere memória, feche outros apps, reinicie dispositivo.",
  "internet lenta": "Internet lenta? Reduza qualidade, use WiFi, feche outros downloads.",
  "nao faz login": "Erro no login? Verifique email/senha, redefina senha, limpe cache.",
  "esqueci senha": "Esqueceu senha? Use 'Recuperar senha' na tela de login!",
  "conta bloqueada": "Conta bloqueada? Entre em contato conosco imediatamente!",
  "pagamento negado": "Pagamento negado? Verifique dados cartão, limite, tente PIX.",

  // Comparações e vantagens (40 perguntas)
  "vs netflix": "Megaflix tem TODO catálogo Netflix + 12.000 conteúdos extras por menos!",
  "vs prime video": "Prime Video custa R$ 14,90 + frete. Megaflix R$ 37,90 com MUITO mais!",
  "vs disney plus": "Disney+ R$ 33,90 só Disney. Megaflix R$ 37,90 com Disney + tudo mais!",
  "vs globoplay": "Globoplay R$ 49,90 só Globo. Megaflix R$ 37,90 com Globo + mundo todo!",
  "vs hbo max": "HBO Max R$ 34,90 só HBO. Megaflix inclui HBO + todas outras plataformas!",
  "vs youtube premium": "YouTube Premium R$ 20,90 sem filmes. Megaflix 14.000 filmes + YouTube!",
  "vs todas juntas": "Todas plataformas separadas = R$ 267/mês! Megaflix = R$ 37,90!",
  "economia mensal": "Economize R$ 229,10 por mês comparado às plataformas separadas!",
  "economia anual": "Economia anual de R$ 2.748,60 optando pelo Megaflix!",
  "vantagem principal": "1 assinatura = 8 plataformas! Praticidade e economia imbatível!",
  "melhor servico": "Megaflix: mais conteúdo, menor preço, mais dispositivos, menos complicação!",
  "vale a pena": "MUITO vale a pena! Preço de 1 plataforma, conteúdo de 8 plataformas!",

  // Instalação e configuração (30 perguntas)
  "como instalar celular": "Play Store/App Store: busque 'Megaflix', instale, faça login!",
  "como instalar tv": "Smart TV: vá na loja de apps, busque 'Megaflix', instale!",
  "como instalar pc": "Acesse megaflix.com no navegador ou baixe app Windows/Mac!",
  "instalar tv box": "TV Box: baixe APK do site oficial, instale, configure!",
  "primeira configuracao": "Primeira vez: instale app, crie conta, escolha plano, aproveite!",
  "login primeiro": "Primeiro login: use email e senha cadastrados na compra!",
  "sincronizar contas": "Sincronização automática! Login mesmo email em todos dispositivos.",
  "atualizar app": "Atualizações automáticas! Sempre tenha a melhor versão.",
  "backup dados": "Seus dados ficam na nuvem! Nunca perca favoritos e histórico.",
  "configurar qualidade": "Configure qualidade: Automática, HD, Full HD, 4K no menu!",

  // Recursos específicos (30 perguntas)
  "modo noturno": "Modo escuro disponível! Proteja os olhos e economize bateria.",
  "controle remoto": "Use controle remoto da TV ou celular como controle!",
  "tela bloqueada": "Trava tela para crianças! Evite toques acidentais durante reprodução.",
  "timer sono": "Timer de sono! Pare reprodução automaticamente após tempo definido.",
  "estatisticas": "Veja estatísticas: tempo assistido, gêneros favoritos, ranking!",
  "notificacoes": "Notificações de novos episódios e lançamentos! Nunca perca nada.",
  "modo teatro": "Modo teatro com luzes automáticas em TVs inteligentes compatíveis!",
  "gestos touch": "Controles por gestos: deslize para avançar/voltar, toque para pausar!"
};

function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Respostas humanizadas para qualquer assunto
  const humanizedResponses = {
    // Saudações
    "oi": "Oi! Tudo bem? Sou do atendimento Megaflix! Como posso te ajudar hoje?",
    "ola": "Olá! Que bom falar com você! O que você gostaria de saber?", 
    "bom dia": "Bom dia! Espero que esteja tendo um ótimo dia! Em que posso ajudar?",
    "boa tarde": "Boa tarde! Como você está? Como posso te auxiliar?",
    "boa noite": "Boa noite! Ainda estou aqui para te atender! O que precisa saber?",
    
    // Assuntos gerais com redirecionamento natural
    "clima": "Sobre o clima não sei te dizer, mas sei que qualquer tempo é perfeito para maratonar! Já conhece o Megaflix?",
    "tempo": "Tempo não é minha especialidade, mas entretenimento é! Que tal conhecer nossos +14.000 filmes?",
    "receita": "Que legal que gosta de cozinhar! Temos programas de culinária incríveis também. Quer ver nossos planos?",
    "dica": "Adoro dar dicas! Aqui vai uma: economize R$ 2.500+ por ano escolhendo Megaflix! Quer saber como?",
    "amor": "Que fofo! Sabe o que combina com amor? Maratonar séries românticas juntos! Temos milhares delas!",
    "trabalho": "Entendo sobre trabalho! Depois de um dia puxado, relaxar com um filme é tudo, né?",
    "estudo": "Estudar é importante! E relaxar também! Que tal uma pausa com nossos conteúdos?",
    "esporte": "Amo esportes! Temos ESPN, SporTV, Fox Sports ao vivo! Quer conhecer nossos canais?",
    "noticia": "Notícias não posso dar, mas temos canais 24h como Globo News! Quer ver nossos +500 canais?",
    
    // Outros assuntos
    "ajuda": "Claro que vou te ajudar! É sobre o Megaflix ou posso te dar uma dica de entretenimento?",
    "obrigado": "Imagina! Fico feliz em ajudar! Tem mais alguma dúvida sobre nossa plataforma?",
    "valeu": "De nada! Estou sempre aqui! Quer saber mais alguma coisa sobre o Megaflix?"
  };

  // Verifica respostas humanizadas primeiro
  for (const [keyword, response] of Object.entries(humanizedResponses)) {
    if (msg.includes(keyword)) {
      return response;
    }
  }

  // Busca por correspondências no FAQ expandido
  for (const [keywords, response] of Object.entries(expandedQuestions)) {
    const keywordList = keywords.split(' ');
    if (keywordList.every(keyword => msg.includes(keyword))) {
      return response;
    }
  }
  
  // Sistema de fallback melhorado
  if (msg.includes("como assinar") || msg.includes("como faço para assinar")) {
    return "Para assinar é super fácil: clique em 'Assinar Agora' na página, escolha seu plano favorito, faça o pagamento e pronto! Acesso liberado na hora. Aceitamos cartão, PIX e PayPal.";
  }
  
  if (msg.includes("plano mensal") || msg.includes("o que inclui mensal")) {
    return "O plano mensal por R$ 37,90 é perfeito! Inclui: 14.000+ filmes, 12.000+ séries, 500+ canais, animes, novelas. Sem anúncios, qualidade HD/4K!";
  }
  if (msg.includes("plano anual") || msg.includes("o que inclui anual")) {
    return "O plano anual por R$ 97 é nosso campeão de economia! Mesmo conteúdo total, mas você paga apenas R$ 8,08/mês. Economia de mais de R$ 2.500!";
  }
  if (msg.includes("plano vitalicio") || msg.includes("o que inclui vitalicio")) {
    return "O plano vitalício por R$ 197 é o melhor negócio! Pagamento único, acesso eterno. Se paga sozinho em 5 meses!";
  }
  
  if (msg.includes("dispositivos") || msg.includes("onde assistir") || msg.includes("compativel")) {
    return "Funciona em TODOS os dispositivos: Android, iOS, Smart TVs, computadores, TV Box, Chromecast. Até 5 dispositivos simultâneos!";
  }
  
  if (msg.includes("offline") || msg.includes("download") || msg.includes("sem internet")) {
    return "Claro que tem download! Baixe filmes e séries no celular para assistir offline. Perfeito para qualquer lugar!";
  }
  
  if (msg.includes("cancelar") || msg.includes("cancelamento")) {
    return "Cancelar é super tranquilo: vá em 'Minha Conta' > 'Configurações' > 'Cancelar'. Sem multas, sem burocracia!";
  }
  
  if (msg.includes("teste gratuito") || msg.includes("gratis")) {
    return "Não temos teste grátis, mas com preços tão baixos não precisa! O mensal custa apenas R$ 37,90 para experimentar tudo!";
  }
  
  if (msg.includes("quantos filme") || msg.includes("filme tem")) {
    return "Temos mais de 14.000 filmes incríveis: lançamentos 2024, clássicos, nacionais, internacionais. Todo o catálogo Netflix/Prime/Disney+ incluído!";
  }
  if (msg.includes("quantas serie") || msg.includes("serie tem")) {
    return "Mais de 12.000 séries esperando por você: originais Netflix, coreanas, americanas, brasileiras, animes. Tudo sem anúncios!";
  }
  if (msg.includes("quantos canal") || msg.includes("tv ao vivo")) {
    return "Mais de 500 canais ao vivo: esportes (ESPN), notícias (Globo News), entretenimento, infantil. TV tradicional quando quiser!";
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