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
      <DialogContent className="max-w-4xl bg-gradient-to-br from-netflix-dark via-purple-900 to-netflix-dark text-white border-netflix-red/20 rounded-3xl shadow-2xl backdrop-blur-lg">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-bold text-center text-white flex items-center justify-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-full">
              <QrCode className="h-8 w-8 text-green-400" />
            </div>
            PIX Gerado com Sucesso!
          </DialogTitle>
          <p className="text-gray-300 text-center text-lg">
            Seu pagamento está quase pronto
          </p>
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

          <div className="grid md:grid-cols-2 gap-8">
            {/* QR Code */}
            <Card className="bg-white/10 border-white/20 rounded-2xl shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-center flex items-center justify-center gap-3 text-xl">
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <QrCode className="h-6 w-6 text-blue-400" />
                  </div>
                  QR Code PIX
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                {paymentData.qrCode && (
                  <div className="bg-white p-6 rounded-2xl inline-block shadow-xl">
                    <img 
                      src={paymentData.qrCode} 
                      alt="QR Code PIX" 
                      className="w-52 h-52 mx-auto"
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm">
                    Abra seu app do banco e escaneie o código
                  </p>
                  <Button 
                    onClick={downloadQRCode}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Baixar QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Código PIX Copia e Cola */}
            <Card className="bg-white/10 border-white/20 rounded-2xl shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-center flex items-center justify-center gap-3 text-xl">
                  <div className="p-2 bg-orange-500/20 rounded-full">
                    <Copy className="h-6 w-6 text-orange-400" />
                  </div>
                  Código PIX
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                  <p className="text-sm text-gray-300 mb-3 font-medium">Código para copiar e colar:</p>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-600/30">
                    <p className="text-xs font-mono break-all text-white leading-relaxed">
                      {paymentData.qrCodeText}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={copyPixCode}
                  className={`w-full py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                    copied 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                      : 'bg-gradient-to-r from-netflix-red to-red-700 hover:from-red-700 hover:to-red-800'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Código Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      Copiar Código PIX
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Instruções de Pagamento */}
          <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-600/30 rounded-2xl shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center justify-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-full">
                  <QrCode className="h-6 w-6" />
                </div>
                Como pagar com PIX
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">1.</span>
                    <span>Abra o app do seu banco ou carteira digital</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">2.</span>
                    <span>Escolha a opção <strong className="text-white bg-blue-600/20 px-2 py-1 rounded">PIX</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">3.</span>
                    <span>Escaneie o QR Code <strong className="text-white">OU</strong> copie e cole o código PIX</span>
                  </li>
                </ol>
                <ol className="list-decimal list-inside space-y-3 text-gray-300" start={4}>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">4.</span>
                    <span>Confirme os dados e o valor <strong className="text-green-400 bg-green-500/20 px-2 py-1 rounded">R$ 37,90</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">5.</span>
                    <span>Finalize o pagamento</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">6.</span>
                    <span>Aguarde a confirmação (geralmente instantânea)</span>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Pedido */}
          <Card className="bg-gradient-to-r from-white/5 to-white/10 border-white/20 rounded-2xl shadow-lg">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-2">ID do Pedido</p>
                  <p className="font-mono text-xs text-white bg-black/20 px-2 py-1 rounded">
                    {paymentData.id.substring(0, 8)}...
                  </p>
                </div>
                <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                  <p className="text-gray-400 text-sm mb-2">Valor</p>
                  <p className="font-bold text-green-400 text-lg">R$ 37,90</p>
                </div>
                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                  <p className="text-gray-400 text-sm mb-2">Método</p>
                  <p className="font-semibold text-blue-400">PIX</p>
                </div>
                <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                  <p className="text-gray-400 text-sm mb-2">Status</p>
                  <p className="font-semibold text-yellow-400">Aguardando</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              onClick={() => {
                const element = document.getElementById('chat-widget');
                if (element) element.click();
              }}
              className="bg-gradient-to-r from-netflix-red to-red-700 hover:from-red-700 hover:to-red-800 py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              💬 Precisa de Ajuda?
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 py-3 px-8 rounded-xl font-semibold transition-all duration-200"
            >
              <X className="h-5 w-5 mr-2" />
              Fechar
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