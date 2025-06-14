import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContentModal from "./content-modal";
import CustomVideoPlayer from "./custom-video-player";
import { trendingContent } from "@/lib/content-data";

export default function TrendingSection() {
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 2 >= trendingContent.length ? 0 : prev + 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 2 < 0 ? Math.max(0, trendingContent.length - 2) : prev - 2));
  };

  const visibleContent = trendingContent.slice(currentIndex, currentIndex + 2);

  return (
    <>
      <section id="catalogo" className="py-16 bg-dark-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center animate-fade-in">
            <span className="text-netflix-red">Em Alta</span> no Megaflix
          </h2>

          {/* Espaço para vídeo do YouTube */}
          <div className="mb-12 text-center">
            <div className="bg-dark-primary rounded-xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Veja como funciona o Megaflix
              </h3>
              <CustomVideoPlayer 
                videoId="hK9GKp_8i6w"
                title="Megaflix - Como funciona"
                className="w-full"
              />
            </div>
          </div>
          
          {/* Carrossel de conteúdo */}
          <div className="relative max-w-4xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
              {visibleContent.map((content, index) => (
                <div 
                  key={content.id}
                  className="relative group cursor-pointer transform transition-all hover:scale-105 animate-fade-in"
                  onClick={() => setSelectedContent(content)}
                >
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-6xl font-bold text-white drop-shadow-lg">
                      {currentIndex + index + 1}
                    </span>
                  </div>
                  <img 
                    src={content.image} 
                    alt={content.title} 
                    className="w-full h-80 md:h-96 object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg md:text-xl">
                      {content.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Setas de navegação */}
            <Button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-20"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-20"
              disabled={currentIndex + 2 >= trendingContent.length}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Indicadores */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(trendingContent.length / 2) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * 2)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    Math.floor(currentIndex / 2) === index ? 'bg-netflix-red' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContentModal 
        content={selectedContent} 
        onClose={() => setSelectedContent(null)} 
      />
    </>
  );
}
