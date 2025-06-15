import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ExternalLink } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Noticia() {
  useEffect(() => {
    // Desktop redirect logic
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    if (!isMobile) {
      // Redirect desktop users to external article
      window.location.href = "https://www.omelete.com.br/filmes/25-melhores-filmes-imperdiveis-para-ver-2025";
    }
  }, []);

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <article className="max-w-4xl mx-auto">
          <Card className="bg-dark-secondary border-gray-600">
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="default" className="bg-netflix-red">
                  Filmes
                </Badge>
                <Badge variant="outline">
                  2025
                </Badge>
              </div>
              
              <CardTitle className="text-3xl md:text-4xl font-bold text-white mb-4">
                25 Melhores Filmes Imperdíveis para Ver em 2025
              </CardTitle>
              
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Janeiro 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Omelete</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <img 
                src="https://images.unsplash.com/photo-1489599558818-2c4ac94e3098?w=800&h=400&fit=crop"
                alt="Cinema 2025"
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-gray-300 leading-relaxed">
                  O ano de 2025 promete ser repleto de grandes lançamentos cinematográficos. 
                  Desde sequências muito aguardadas até filmes originais inovadores, 
                  preparamos uma lista com os 25 melhores filmes que você não pode perder este ano.
                </p>
                
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                  Destaques do Ano
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-2">Blockbusters</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Avatar 3: Fire and Ash</li>
                      <li>• Fantastic Four: First Steps</li>
                      <li>• Jurassic World Rebirth</li>
                      <li>• Mission: Impossible 8</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-2">Filmes Autorais</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• The Battle of Baktan Cross</li>
                      <li>• Deliver Me from Nowhere</li>
                      <li>• Elio (Pixar)</li>
                      <li>• Lilo & Stitch (Live-action)</li>
                    </ul>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                  Por Que Assistir no Megaflix?
                </h2>
                
                <p className="text-gray-300 leading-relaxed">
                  Com o Megaflix, você terá acesso a todos esses lançamentos em uma única plataforma. 
                  Nossa biblioteca atualizada garante que você não perca nenhum dos grandes filmes de 2025, 
                  com qualidade 4K e sem anúncios.
                </p>
                
                <div className="bg-netflix-red/20 border border-netflix-red/50 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Leia o Artigo Completo
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Para ver a lista completa com todos os 25 filmes e suas datas de lançamento, 
                    acesse o artigo original no Omelete.
                  </p>
                  <a 
                    href="https://www.omelete.com.br/filmes/25-melhores-filmes-imperdiveis-para-ver-2025"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-netflix-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver Lista Completa
                  </a>
                </div>
                
                <div className="bg-dark-primary rounded-lg p-6 mt-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Assista Todos Esses Filmes no Megaflix
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Não perca nenhum lançamento! Assine agora e tenha acesso ilimitado 
                    a todos os filmes de 2025.
                  </p>
                  <a 
                    href="#planos"
                    className="inline-block bg-netflix-red text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                    onClick={() => {
                      const element = document.getElementById('planos');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Assinar Agora
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
      
      <Footer />
    </div>
  );
}