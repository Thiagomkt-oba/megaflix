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
      <DialogContent className="max-w-4xl bg-gradient-to-br from-netflix-dark via-purple-900 to-netflix-dark text-white border-netflix-red/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white flex items-center justify-center gap-2">
            <QrCode className="h-6 w-6 text-green-500" />
            PIX Gerado com Sucesso!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status do Pagamento */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="text-yellow-400 font-semibold">Aguardando Pagamento</span>
            </div>
            <p className="text-gray-300">
              Escaneie o QR Code ou copie o código PIX para finalizar seu pagamento
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* QR Code */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code PIX
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {paymentData.qrCode && (
                  <div className="bg-white p-4 rounded-lg inline-block mb-4">
                    <img 
                      src={paymentData.qrCode} 
                      alt="QR Code PIX" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <Button 
                    onClick={downloadQRCode}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Código PIX Copia e Cola */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                  <Copy className="h-5 w-5" />
                  Código PIX
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">Código para copiar e colar:</p>
                    <div className="bg-black/30 p-3 rounded border">
                      <p className="text-xs font-mono break-all text-white">
                        {paymentData.qrCodeText}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={copyPixCode}
                    className={`w-full ${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-netflix-red hover:bg-red-700'}`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Código PIX
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instruções de Pagamento */}
          <Card className="bg-blue-600/10 border-blue-600/30">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Como pagar com PIX:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Abra o app do seu banco ou carteira digital</li>
                <li>Escolha a opção <strong className="text-white">PIX</strong></li>
                <li>Escaneie o QR Code <strong className="text-white">OU</strong> copie e cole o código PIX</li>
                <li>Confirme os dados e o valor <strong className="text-green-400">R$ 37,90</strong></li>
                <li>Finalize o pagamento</li>
                <li>Aguarde a confirmação (geralmente instantânea)</li>
              </ol>
            </CardContent>
          </Card>

          {/* Informações do Pedido */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm">ID do Pedido</p>
                  <p className="font-mono text-xs text-white">{paymentData.id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Valor</p>
                  <p className="font-bold text-green-400">R$ 37,90</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Método</p>
                  <p className="font-semibold text-blue-400">PIX</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="font-semibold text-yellow-400">Aguardando</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <X className="h-4 w-4 mr-2" />
              Fechar
            </Button>
            
            <Button 
              onClick={() => {
                const element = document.getElementById('chat-widget');
                if (element) element.click();
              }}
              className="bg-netflix-red hover:bg-red-700"
            >
              Precisa de Ajuda?
            </Button>
          </div>

          {/* Aviso de Segurança */}
          <div className="text-center">
            <p className="text-xs text-gray-400">
              🔒 Pagamento 100% seguro • Seus dados estão protegidos
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}