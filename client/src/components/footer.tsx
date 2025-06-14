import { Play } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-netflix-red to-red-700">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já descobriram a liberdade de ter todos os conteúdos em um só lugar.
          </p>
          <Button 
            onClick={() => scrollToSection('planos')}
            className="bg-white text-netflix-red px-12 py-4 text-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105"
            size="lg"
          >
            <Play className="mr-3 h-6 w-6" />
            Começar Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-tertiary py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-netflix-red text-2xl font-bold mb-4 flex items-center">
                <Play className="mr-2 h-6 w-6" />
                StreamMax
              </div>
              <p className="text-gray-400">Todos os conteúdos que você ama, em um só lugar.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => scrollToSection('sobre')} 
                    className="hover:text-white transition-colors"
                  >
                    Sobre
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Suporte ao Cliente
                  </a>
                </li>
                <li>
                  <a href="mailto:contato@streammax.com" className="hover:text-white transition-colors">
                    contato@streammax.com
                  </a>
                </li>
                <li>
                  <a href="tel:+5511999999999" className="hover:text-white transition-colors">
                    +55 11 99999-9999
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-netflix-red transition-colors text-xl">
                  <FaFacebook />
                </a>
                <a href="#" className="text-gray-400 hover:text-netflix-red transition-colors text-xl">
                  <FaInstagram />
                </a>
                <a href="#" className="text-gray-400 hover:text-netflix-red transition-colors text-xl">
                  <FaTwitter />
                </a>
                <a href="#" className="text-gray-400 hover:text-netflix-red transition-colors text-xl">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StreamMax. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
