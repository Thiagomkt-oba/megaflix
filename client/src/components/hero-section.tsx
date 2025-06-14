import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 gradient-overlay z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1489599511986-83e52e1f89e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-20 pt-20 animate-fade-in">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Acesse <span className="text-netflix-red">TODOS</span> os conteúdos que você ama
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Sem precisar assinar vários serviços. Um único aplicativo, acesso ilimitado a filmes, séries, animes, desenhos, novelas e muito mais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => scrollToSection('planos')}
              className="bg-netflix-red text-white px-8 py-4 text-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Assine Agora
            </Button>
            <Button 
              onClick={() => scrollToSection('sobre')}
              variant="outline"
              className="border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-dark-primary transition-all"
              size="lg"
            >
              <Info className="mr-2 h-5 w-5" />
              Saiba Mais
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
