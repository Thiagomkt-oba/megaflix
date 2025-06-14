import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, Copy, Download, QrCode, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: {
    id: string;
    status: string;
    qrCode?: string;
    qrCodeText?: string;
    pixUrl?: string;
  };
}

export default function PixPaymentModal({ isOpen, onClose, paymentData }: PixPaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyPixCode = async () => {
    if (paymentData?.qrCodeText) {
      try {
        await navigator.clipboard.writeText(paymentData.qrCodeText);
        setCopied(true);
        toast({
          title: "Código PIX copiado!",
          description: "Cole no seu app do banco para efetuar o pagamento.",
        });
        setTimeout(() => setCopied(false), 3000);
      } catch (error) {
        toast({
          title: "Erro ao copiar",
          description: "Tente selecionar e copiar manualmente.",
          variant: "destructive",
        });
      }
    }
  };

  const downloadQRCode = () => {
    if (paymentData?.qrCode) {
      const link = document.createElement('a');
      link.href = paymentData.qrCode;
      link.download = `qr-code-pix-${paymentData.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "QR Code baixado!",
        description: "Arquivo salvo na pasta de downloads.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Backdrop com desfoque forte */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-lg z-40"
          onClick={onClose}
        />
      )}
      
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-netflix-dark border border-gray-600 rounded-2xl shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center p-6 pb-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-blue-400" />
              <span className="text-white font-semibold">Pagamento com PIX</span>
            </div>
            <div className="text-right">
              <span className="text-green-400 font-bold text-lg">R$ 37,90</span>
            </div>
          </div>
          
          <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-2">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-200 text-sm font-medium">Aguardando pagamento...</span>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Instrução Principal */}
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              Realize o pagamento pelo seu banco preferido, escaneando a imagem ou copiando o código do QR Code
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            {paymentData.qrCode && (
              <div className="bg-white p-4 rounded-lg">
                <img 
                  src={paymentData.qrCode} 
                  alt="QR Code PIX" 
                  className="w-48 h-48"
                />
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <Button 
              onClick={downloadQRCode}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 py-3 rounded-lg font-medium"
            >
              Simular pagamento 🔗
            </Button>
            
            <Button 
              onClick={copyPixCode}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                copied 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Código copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar código PIX 📋
                </>
              )}
            </Button>
          </div>

          {/* Aviso */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-400">Fique atento!</p>
            <p className="text-xs text-gray-400">
              • Você receberá um e-mail informando se o pagamento foi aprovado
            </p>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Powered by Megaflix
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}