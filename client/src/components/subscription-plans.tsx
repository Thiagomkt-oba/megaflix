import { Button } from "@/components/ui/button";
import { Check, Crown, Infinity } from "lucide-react";
import { Link } from "wouter";

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto relative">
          {/* Monthly Plan */}
          <div className="bg-dark-secondary rounded-xl p-6 md:p-8 border border-gray-600 hover:border-gray-500 transition-all animate-slide-in-left">
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
              <Link href="/checkout?plan=mensal">
                <Button className="w-full bg-gray-600 text-white hover:bg-gray-500">
                  Escolher Plano
                </Button>
              </Link>
            </div>
          </div>

          {/* Annual Plan - Highlighted */}
          <div className="bg-gradient-to-b from-netflix-red to-red-700 rounded-xl p-6 md:p-8 transform md:scale-110 relative animate-fade-in border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 ring-4 ring-yellow-400/30">
            <div className="absolute -top-4 md:-top-5 left-1/2 transform -translate-x-1/2 z-20">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-black px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-extrabold shadow-2xl animate-pulse border-2 border-yellow-500">MAIS POPULAR </span>
            </div>
            <div className="text-center pt-4">
              <h3 className="text-3xl font-bold mb-4 text-yellow-100">Plano Anual</h3>
              <div className="mb-2">
                <span className="text-5xl font-extrabold text-white drop-shadow-lg">R$ 97</span>
                <span className="text-yellow-200 text-xl">/ano</span>
              </div>
              <p className="text-base text-yellow-200 mb-6 font-semibold bg-black/20 rounded-full px-4 py-2">💰 Economize R$ 357,80 por ano!</p>
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
              <Link href="/checkout?plan=anual">
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-black hover:from-yellow-300 hover:to-yellow-200 font-extrabold text-lg py-4 shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-yellow-500">
                  ⚡ ESCOLHER PLANO ⚡
                </Button>
              </Link>
            </div>
          </div>

          {/* Lifetime Plan - Highlighted */}
          <div className="bg-gradient-to-b from-green-600 to-green-700 rounded-xl p-6 md:p-8 border-2 border-green-400 animate-slide-in-right">
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
              <Link href="/checkout?plan=vitalicio">
                <Button className="w-full bg-white text-green-700 hover:bg-gray-100 font-bold">
                  Escolher Plano
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
