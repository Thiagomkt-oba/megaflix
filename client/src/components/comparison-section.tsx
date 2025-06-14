import { Calculator, TrendingUp, Tv, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

const streamingServices = [
  { name: "Netflix", price: 45.90 },
  { name: "Amazon Prime Video", price: 14.90 },
  { name: "Disney+", price: 27.90 },
  { name: "HBO Max", price: 34.90 },
  { name: "Apple TV+", price: 19.90 },
  { name: "Paramount+", price: 19.90 },
  { name: "Crunchyroll", price: 29.90 },
  { name: "Globoplay", price: 22.90 },
  { name: "YouTube Premium", price: 20.90 }
];

const totalOtherServices = streamingServices.reduce((sum, service) => sum + service.price, 0);
const megaflixPrice = 37.90;
const monthlySavings = totalOtherServices - megaflixPrice;
const annualSavings = (totalOtherServices * 12) - 97;
const lifetimeSavings = (totalOtherServices * 120) - 197; // 10 anos

export default function ComparisonSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-dark-primary">
      <div className="container mx-auto px-4">
        {/* Estatísticas do Megaflix */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 animate-fade-in">
            O Maior Catálogo do <span className="text-netflix-red">Brasil</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-dark-secondary rounded-xl p-6 animate-fade-in">
              <Film className="h-8 w-8 text-netflix-red mx-auto mb-3" />
              <div className="text-3xl font-bold text-netflix-red">14mil+</div>
              <div className="text-gray-300">Filmes</div>
            </div>
            <div className="bg-dark-secondary rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Tv className="h-8 w-8 text-netflix-red mx-auto mb-3" />
              <div className="text-3xl font-bold text-netflix-red">12mil+</div>
              <div className="text-gray-300">Séries</div>
            </div>
            <div className="bg-dark-secondary rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <TrendingUp className="h-8 w-8 text-netflix-red mx-auto mb-3" />
              <div className="text-3xl font-bold text-netflix-red">500+</div>
              <div className="text-gray-300">Canais de TV</div>
            </div>
            <div className="bg-dark-secondary rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Calculator className="h-8 w-8 text-netflix-red mx-auto mb-3" />
              <div className="text-3xl font-bold text-netflix-red">Tudo</div>
              <div className="text-gray-300">Em um só lugar</div>
            </div>
          </div>
        </div>

        {/* Comparação de Preços */}
        <div className="bg-dark-secondary rounded-2xl p-8 mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Comparação com Outros <span className="text-netflix-red">Serviços</span>
          </h3>
          
          {/* Lista dos serviços */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 text-center">
            {streamingServices.map((service, index) => (
              <div key={service.name} className="bg-dark-primary rounded-lg p-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="font-semibold text-sm text-gray-300">{service.name}</div>
                <div className="text-netflix-red font-bold">R$ {service.price.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Cálculo de custos */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center">
              <h4 className="text-xl font-bold mb-4 text-gray-300">Assinando Separadamente</h4>
              <div className="text-4xl font-bold text-red-500 mb-2">R$ {totalOtherServices.toFixed(2)}</div>
              <div className="text-gray-400">por mês</div>
              <div className="text-sm text-gray-500 mt-2">
                {streamingServices.length} serviços diferentes
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-xl font-bold mb-4 text-gray-300">Com o Megaflix</h4>
              <div className="text-4xl font-bold text-green-500 mb-2">R$ {megaflixPrice.toFixed(2)}</div>
              <div className="text-gray-400">por mês</div>
              <div className="text-sm text-green-400 mt-2 font-semibold">
                Economia de R$ {monthlySavings.toFixed(2)}/mês
              </div>
            </div>
          </div>

          {/* Economia anual e vitalícia */}
          <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-600">
            <div className="bg-dark-primary rounded-xl p-6 text-center">
              <h5 className="font-bold text-yellow-400 mb-2">Plano Anual - R$ 97</h5>
              <div className="text-2xl font-bold text-green-400">Economize R$ {annualSavings.toFixed(2)}</div>
              <div className="text-sm text-gray-400">por ano</div>
            </div>
            <div className="bg-dark-primary rounded-xl p-6 text-center">
              <h5 className="font-bold text-yellow-400 mb-2">Plano Vitalício - R$ 197</h5>
              <div className="text-2xl font-bold text-green-400">Economize R$ {(lifetimeSavings/1000).toFixed(1)}mil+</div>
              <div className="text-sm text-gray-400">em 10 anos</div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => scrollToSection('planos')}
              className="bg-netflix-red text-white px-8 py-4 text-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105"
              size="lg"
            >Assine Agora!</Button>
          </div>
        </div>
      </div>
    </section>
  );
}