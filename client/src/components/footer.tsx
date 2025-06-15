import { Play } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-dark-tertiary py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-netflix-red text-2xl font-bold mb-4 flex items-center">
                <Play className="mr-2 h-6 w-6" />
                Megaflix
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
                  <a href="mailto:contato@megaflix.com" className="hover:text-white transition-colors">
                    contato@megaflix.com
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
            <p>&copy; 2024 Megaflix. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
  );
}
