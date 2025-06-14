import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Play } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-gradient-to-b from-dark-primary via-dark-primary/80 to-transparent backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-netflix-red text-3xl font-bold flex items-center">
            <Play className="mr-2 h-8 w-8" />
            Megaflix
          </div>
        </div>
        
        <ul className="hidden md:flex space-x-8 text-sm font-medium">
          <li>
            <button 
              onClick={() => scrollToSection('inicio')} 
              className="hover:text-netflix-red transition-colors"
            >
              Início
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('sobre')} 
              className="hover:text-netflix-red transition-colors"
            >
              Sobre
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('catalogo')} 
              className="hover:text-netflix-red transition-colors"
            >
              Catálogo
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('planos')} 
              className="hover:text-netflix-red transition-colors"
            >
              Planos
            </button>
          </li>
          <li>
            <Button 
              onClick={() => scrollToSection('planos')}
              className="bg-netflix-red hover:bg-red-700 text-white font-semibold"
            >
              Assine Agora
            </Button>
          </li>
        </ul>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-secondary border-t border-gray-700">
          <ul className="px-4 py-4 space-y-3">
            <li>
              <button 
                onClick={() => scrollToSection('inicio')} 
                className="block w-full text-left hover:text-netflix-red transition-colors"
              >
                Início
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('sobre')} 
                className="block w-full text-left hover:text-netflix-red transition-colors"
              >
                Sobre
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('catalogo')} 
                className="block w-full text-left hover:text-netflix-red transition-colors"
              >
                Catálogo
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('planos')} 
                className="block w-full text-left hover:text-netflix-red transition-colors"
              >
                Planos
              </button>
            </li>
            <li>
              <Button 
                onClick={() => scrollToSection('planos')}
                className="w-full bg-netflix-red hover:bg-red-700 text-white font-semibold"
              >
                Assine Agora
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
