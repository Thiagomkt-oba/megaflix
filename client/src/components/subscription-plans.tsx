import { Button } from "@/components/ui/button";
import { Check, Crown, Infinity } from "lucide-react";

export default function SubscriptionPlans() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="planos" className="py-16 bg-dark-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-fade-in">
          Escolha Seu <span className="text-netflix-red">Plano Ideal</span>
        </h2>
        <p className="text-xl text-gray-300 text-center mb-12 animate-fade-in">
          Acesso completo a todo nosso catálogo
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Monthly Plan */}
          <div className="bg-dark-secondary rounded-xl p-8 border border-gray-600 hover:border-gray-500 transition-all animate-slide-in-left">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Plano Mensal</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-netflix-red">R$ 37,90</span>
                <span className="text-gray-400">/mês</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Acesso completo ao catálogo
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Download para assistir offline
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Sem anúncios
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Todos os dispositivos
                </li>
              </ul>
              <Button className="w-full bg-gray-600 text-white hover:bg-gray-500">
                Escolher Plano
              </Button>
            </div>
          </div>

          {/* Annual Plan - Highlighted */}
          <div className="bg-gradient-to-b from-netflix-red to-red-700 rounded-xl p-8 transform scale-105 relative animate-fade-in">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                MAIS POPULAR
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Plano Anual</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold">R$ 97</span>
                <span className="text-gray-200">/ano</span>
              </div>
              <p className="text-sm text-gray-200 mb-6">Economize R$ 357,80 por ano!</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-yellow-400 mr-3" />
                  Acesso completo ao catálogo
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-yellow-400 mr-3" />
                  Download para assistir offline
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-yellow-400 mr-3" />
                  Sem anúncios
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-yellow-400 mr-3" />
                  Todos os dispositivos
                </li>
                <li className="flex items-center">
                  <Crown className="h-5 w-5 text-yellow-400 mr-3" />
                  Suporte prioritário
                </li>
              </ul>
              <Button className="w-full bg-white text-netflix-red hover:bg-gray-100 font-bold">
                Escolher Plano
              </Button>
            </div>
          </div>

          {/* Lifetime Plan - Highlighted */}
          <div className="bg-gradient-to-b from-green-600 to-green-700 rounded-xl p-8 border-2 border-green-400 animate-slide-in-right">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Plano Vitalício</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold">R$ 197</span>
                <span className="text-gray-200">/único pagamento</span>
              </div>
              <p className="text-sm text-gray-200 mb-6">Acesso para sempre!</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-yellow-400 mr-3" />
                  Acesso completo ao catálogo
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-yellow-400 mr-3" />
                  Download para assistir offline
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-yellow-400 mr-3" />
                  Sem anúncios
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-yellow-400 mr-3" />
                  Todos os dispositivos
                </li>
                <li className="flex items-center">
                  <Crown className="h-5 w-5 text-yellow-400 mr-3" />
                  Suporte prioritário
                </li>
                <li className="flex items-center">
                  <Infinity className="h-5 w-5 text-yellow-400 mr-3" />
                  Acesso vitalício
                </li>
              </ul>
              <Button className="w-full bg-white text-green-700 hover:bg-gray-100 font-bold">
                Escolher Plano
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
