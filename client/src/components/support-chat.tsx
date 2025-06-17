import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! 👋 Sou o assistente do Megaflix. Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "Desculpe, não consegui processar sua mensagem.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Desculpe, houve um erro. Tente novamente em alguns instantes.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-netflix-red hover:bg-red-700 text-white rounded-full p-4 shadow-2xl z-50 animate-bounce"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-dark-secondary border border-gray-600 rounded-2xl shadow-2xl w-80 h-96 flex flex-col">
        {/* Header */}
        <div className="bg-netflix-red text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            <span className="font-semibold">Suporte Megaflix</span>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-red-600 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                  message.isUser
                    ? "bg-netflix-red text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {message.text}
                {/* Botões de ação para mensagens do bot */}
                {!message.isUser && (
                  <div className="mt-2 space-y-1">
                    {/* Botão Assinar para mensagens sobre planos */}
                    {(message.text.toLowerCase().includes("assinar") || 
                      message.text.toLowerCase().includes("plano") ||
                      message.text.toLowerCase().includes("r$ ")) && (
                      <Button
                        onClick={() => {
                          const element = document.getElementById('planos');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                            setIsOpen(false);
                          }
                        }}
                        className="bg-netflix-red hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full w-full mb-1"
                        size="sm"
                      >
                        Assinar Agora 🚀
                      </Button>
                    )}
                    
                    {/* Botão Ver Catálogo para mensagens sobre conteúdo */}
                    {(message.text.toLowerCase().includes("filme") || 
                      message.text.toLowerCase().includes("série") ||
                      message.text.toLowerCase().includes("anime") ||
                      message.text.toLowerCase().includes("canal")) && (
                      <Button
                        onClick={() => {
                          const element = document.getElementById('catalogo');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                            setIsOpen(false);
                          }
                        }}
                        className="bg-gray-600 hover:bg-gray-500 text-white text-xs px-3 py-1 rounded-full w-full"
                        size="sm"
                      >
                        Ver Catálogo 📺
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-white px-3 py-2 rounded-2xl text-sm flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Digitando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-600 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-netflix-red"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-netflix-red hover:bg-red-700 text-white rounded-full p-2"
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
