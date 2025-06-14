import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";

interface ContentModalProps {
  content: any;
  onClose: () => void;
}

export default function ContentModal({ content, onClose }: ContentModalProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  };

  if (!content) return null;

  return (
    <Dialog open={!!content} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-dark-secondary border-gray-600">
        <DialogHeader>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="h-6 w-6" />
          </button>
        </DialogHeader>
        
        <div className="relative">
          <img 
            src={content.image} 
            alt={content.title} 
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <DialogTitle className="text-2xl font-bold mb-4 text-white">
            {content.title}
          </DialogTitle>
          <p className="text-gray-300 mb-6 leading-relaxed">
            {content.description}
          </p>
          <Button 
            onClick={() => scrollToSection('planos')}
            className="bg-netflix-red text-white hover:bg-red-700 w-full font-semibold"
            size="lg"
          >
            <Play className="mr-2 h-5 w-5" />
            Assine Agora
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
