import { Smartphone, Tv, Laptop, Monitor, CheckCircle, Download, Globe, Settings } from "lucide-react";

export default function BenefitsSection() {
  return (
    <section id="sobre" className="py-16 bg-dark-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
          Por que escolher o <span className="text-netflix-red">Megaflix</span>?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Mobile Device */}
          <div className="text-center group animate-fade-in">
            <div className="bg-dark-primary rounded-xl p-8 mb-4 group-hover:bg-netflix-red transition-colors">
              <Smartphone className="h-12 w-12 text-netflix-red group-hover:text-white mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Celular Android</h3>
            <p className="text-gray-400">Assista onde estiver, quando quiser</p>
          </div>

          {/* Smart TV */}
          <div className="text-center group animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-dark-primary rounded-xl p-8 mb-4 group-hover:bg-netflix-red transition-colors">
              <Tv className="h-12 w-12 text-netflix-red group-hover:text-white mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart TV</h3>
            <p className="text-gray-400">Experiência completa na sua TV</p>
          </div>

          {/* Computer */}
          <div className="text-center group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-dark-primary rounded-xl p-8 mb-4 group-hover:bg-netflix-red transition-colors">
              <Laptop className="h-12 w-12 text-netflix-red group-hover:text-white mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Computador</h3>
            <p className="text-gray-400">Assista no seu desktop ou notebook</p>
          </div>

          {/* TV Box */}
          <div className="text-center group animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-dark-primary rounded-xl p-8 mb-4 group-hover:bg-netflix-red transition-colors">
              <Monitor className="h-12 w-12 text-netflix-red group-hover:text-white mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold mb-2">TV Box</h3>
            <p className="text-gray-400">Transforme sua TV em Smart TV</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <h3 className="text-3xl font-bold mb-6">
              Tudo em <span className="text-netflix-red">um só lugar</span>
            </h3>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center">
                <CheckCircle className="h-6 w-6 text-netflix-red mr-4 flex-shrink-0" />
                Acesse TODOS os conteúdos de todos os streamings
              </li>
              <li className="flex items-center">
                <Download className="h-6 w-6 text-netflix-red mr-4 flex-shrink-0" />
                Baixe filmes e séries para assistir offline
              </li>
              <li className="flex items-center">
                <Globe className="h-6 w-6 text-netflix-red mr-4 flex-shrink-0" />
                Sem limites, assista de onde quiser
              </li>
              <li className="flex items-center">
                <Settings className="h-6 w-6 text-netflix-red mr-4 flex-shrink-0" />
                Disponível em todos os dispositivos
              </li>
            </ul>
          </div>
          
          {/* Streaming content collage visualization */}
          <div className="grid grid-cols-2 gap-4 animate-slide-in-right">
            <img 
              src="https://i.imgur.com/olEmJbR.png" 
              alt="Filmes de Ação" 
              className="rounded-lg shadow-lg object-cover h-32"
            />
            <img 
              src="https://i.imgur.com/l01GwbY.png" 
              alt="Séries de Drama" 
              className="rounded-lg shadow-lg object-cover h-32"
            />
            <img 
              src="https://i.imgur.com/NGC0LNa.png" 
              alt="Animes" 
              className="rounded-lg shadow-lg object-cover h-32"
            />
            <img 
              src="https://i.imgur.com/oEDXBOo.png" 
              alt="Novelas e TV" 
              className="rounded-lg shadow-lg object-cover h-32"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
