import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Star } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Noticia() {
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
                <Badge variant="outline">
                  Cinema
                </Badge>
              </div>
              
              <CardTitle className="text-3xl md:text-4xl font-bold text-white mb-4">
                25 Filmes Imperdíveis Para Assistir em 2025
              </CardTitle>
              
              <p className="text-xl text-gray-300 mb-6">
                Dos grandes blockbusters aos futuros clássicos cults, saiba o que você precisa ver no cinema e em streaming este ano
              </p>
              
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>14 de junho de 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Omelete</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>5 min de leitura</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <img 
                src="https://images.unsplash.com/photo-1489599558818-2c4ac94e3098?w=800&h=400&fit=crop"
                alt="Cinema 2025"
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div className="prose prose-invert max-w-none">
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
                  <p className="text-yellow-100 font-medium">
                    ✨ Lista e calendário atualizados em 14 de junho!
                  </p>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Se 2023 pareceu o primeiro ano em que o cinema estava realmente de volta depois de sofrer com a pandemia, 2024 foi um ano impactado diretamente pelas greves de roteiristas e atores de Hollywood. 2025, então, promete ser um retorno à forma. Se você quer uma prova disso, basta olhar essa lista. Há claros focos no ano, seja em termos de blockbusters, favoritos a indicações ao Oscar, grandes diretores e novos nomes do cinema moderno.
                </p>

                <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">🎬 Confira também nossas outras listas:</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• 25 Séries Imperdíveis Para Ver em 2025</li>
                    <li>• 25 Games Imperdíveis Para Jogar em 2025</li>
                    <li>• 25 Animes Imperdíveis Para Ver em 2025</li>
                  </ul>
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Sabemos que filmes de heróis estão em baixa, mas não dá para negar a curiosidade e importância do novo Quarteto Fantástico, e especialmente do novo Superman, que reúne um dos melhores diretores de adaptações de quadrinhos com o maior personagem do meio num projeto que traz pressões comerciais poucas vezes vistas. Não parece ser um exagero dizer que o destino da Warner Bros. Discovery está nas mãos de Clark Kent.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-6">
                  🏆 Principais Destaques de 2025
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-red-600/20 border border-red-500/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-red-400" />
                      Blockbusters
                    </h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Superman (2025)</li>
                      <li>• Quarteto Fantástico</li>
                      <li>• Jurassic World: Recomeço</li>
                      <li>• Missão: Impossível - O Acerto Final</li>
                      <li>• Avatar 3</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-blue-400" />
                      Grandes Diretores
                    </h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Paul Thomas Anderson</li>
                      <li>• Spike Lee</li>
                      <li>• Bong Joon-ho</li>
                      <li>• Guillermo Del Toro</li>
                      <li>• Ryan Coogler</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-600/20 border border-green-500/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-green-400" />
                      Novos Talentos
                    </h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Celine Song</li>
                      <li>• Chloé Zhao</li>
                      <li>• Gareth Edwards</li>
                      <li>• Dan Trachtenberg</li>
                      <li>• Benny Safdie</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8 mb-6">
                  🎯 Top 10 Filmes Mais Aguardados
                </h2>

                <div className="space-y-6">
                  <div className="bg-gray-800/30 rounded-lg p-6 border-l-4 border-netflix-red">
                    <div className="flex items-start gap-4">
                      <div className="bg-netflix-red text-white text-xl font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Superman (2025)</h3>
                        <p className="text-gray-300 mb-2">O retorno do Homem de Aço com James Gunn na direção, prometendo redefinir o herói para uma nova era.</p>
                        <span className="text-sm text-blue-400">📅 Em cartaz nos cinemas</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-6 border-l-4 border-yellow-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-500 text-black text-xl font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Jurassic World: Recomeço</h3>
                        <p className="text-gray-300 mb-2">Com Scarlett Johansson e direção de Gareth Edwards, a franquia ganha novo fôlego.</p>
                        <span className="text-sm text-blue-400">📅 3 de julho nos cinemas</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-500 text-white text-xl font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Missão: Impossível - O Acerto Final</h3>
                        <p className="text-gray-300 mb-2">Tom Cruise se despede de Ethan Hunt na conclusão épica da saga.</p>
                        <span className="text-sm text-blue-400">📅 Final do ano nos cinemas</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-500 text-white text-xl font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Vivo ou Morto: Um Mistério Knives Out</h3>
                        <p className="text-gray-300 mb-2">Daniel Craig retorna como Benoit Blanc em nova investigação de Rian Johnson.</p>
                        <span className="text-sm text-blue-400">📅 12 de dezembro na Netflix</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-6 border-l-4 border-orange-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-500 text-white text-xl font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        5
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">F1: O Filme</h3>
                        <p className="text-gray-300 mb-2">Brad Pitt estrela épico sobre Fórmula 1 dirigido por Joseph Kosinski.</p>
                        <span className="text-sm text-blue-400">📅 26 de junho nos cinemas</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-netflix-red/20 border border-netflix-red/50 rounded-lg p-6 mt-8">
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">
                    🎬 Todos os Filmes de 2025 no Megaflix
                  </h3>
                  <p className="text-gray-300 mb-6 text-center">
                    Não perca nenhum dos 25 filmes imperdíveis de 2025! Com o Megaflix, você tem acesso completo ao melhor do cinema em uma única plataforma.
                  </p>
                  <div className="text-center">
                    <a 
                      href="/"
                      className="inline-block bg-netflix-red text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors mr-4"
                    >
                      Assinar Agora
                    </a>
                    <a 
                      href="https://www.omelete.com.br/filmes/25-melhores-filmes-imperdiveis-para-ver-2025"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gray-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-500 transition-colors"
                    >
                      Ver Lista Completa
                    </a>
                  </div>
                </div>

                <div className="bg-dark-primary rounded-lg p-6 mt-8">
                  <h4 className="text-lg font-bold text-white mb-3">💫 Por que escolher o Megaflix?</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-gray-300 space-y-2">
                      <li>✅ Qualidade 4K Ultra HD</li>
                      <li>✅ Sem anúncios ou interrupções</li>
                      <li>✅ Download para assistir offline</li>
                    </ul>
                    <ul className="text-gray-300 space-y-2">
                      <li>✅ Compatível com todos os dispositivos</li>
                      <li>✅ Catálogo sempre atualizado</li>
                      <li>✅ Suporte 24/7</li>
                    </ul>
                  </div>
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