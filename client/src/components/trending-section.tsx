import { useState } from "react";
import ContentModal from "./content-modal";
import { trendingContent } from "@/lib/content-data";

export default function TrendingSection() {
  const [selectedContent, setSelectedContent] = useState<any>(null);

  return (
    <>
      <section id="catalogo" className="py-16 bg-dark-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center animate-fade-in">
            <span className="text-netflix-red">Em Alta</span> no StreamMax
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {trendingContent.map((content, index) => (
              <div 
                key={content.id}
                className="relative group cursor-pointer transform transition-all hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedContent(content)}
              >
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-6xl font-bold text-white drop-shadow-lg">
                    {index + 1}
                  </span>
                </div>
                <img 
                  src={content.image} 
                  alt={content.title} 
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-sm md:text-base truncate">
                    {content.title}
                  </h3>
                </div>
              </div>
            ))}
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
