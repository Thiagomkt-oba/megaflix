import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Copy, Download, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentData {
  id: string;
  status: string;
  qrCode?: string;
  qrCodeText?: string;
  paymentMethod: string;
}

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Recupera dados do pagamento do localStorage
    const storedData = localStorage.getItem('paymentData');
    if (storedData) {
      setPaymentData(JSON.parse(storedData));
      // Limpa dados após uso por segurança
      localStorage.removeItem('paymentData');
    } else {
      // Redireciona se não há dados de pagamento
      setLocation('/');
    }
  }, [setLocation]);

  const copyPixCode = () => {
    if (paymentData?.qrCodeText) {
      navigator.clipboard.writeText(paymentData.qrCodeText);
      toast({
        title: "Código PIX copiado!",
        description: "Cole no seu app do banco para efetuar o pagamento.",
      });
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
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-netflix-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-netflix-dark via-purple-900 to-netflix-dark text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header de Sucesso */}
          <div className="text-center mb-8">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">
              {paymentData.paymentMethod === 'pix' ? 'PIX Gerado com Sucesso!' : 'Pagamento Aprovado!'}
            </h1>
            <p className="text-xl text-gray-300">
              {paymentData.paymentMethod === 'pix' 
                ? 'Escaneie o QR Code ou copie o código PIX para finalizar seu pagamento'
                : 'Seu pagamento foi processado com sucesso!'
              }
            </p>
          </div>

          {/* Conteúdo do Pagamento */}
          {paymentData.paymentMethod === 'pix' && paymentData.status === 'waiting_payment' ? (
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              
              {/* QR Code */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-center">QR Code PIX</CardTitle>
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

              {/* Código PIX */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-center">Código PIX</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-300 mb-2">Código para copiar e colar:</p>
                      <p className="text-xs font-mono break-all text-white bg-black/30 p-2 rounded">
                        {paymentData.qrCodeText}
                      </p>
                    </div>
                    <Button 
                      onClick={copyPixCode}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Código PIX
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Pagamento por Cartão Aprovado */
            <Card className="bg-white/10 border-white/20 mb-8">
              <CardHeader>
                <CardTitle className="text-white text-center">Pagamento Processado</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-6">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-green-400">
                      Seu pagamento foi aprovado com sucesso!
                    </p>
                    <p className="text-gray-300 mt-2">
                      Você já pode começar a assistir todo o catálogo do Megaflix
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações do Pedido */}
          <Card className="bg-white/10 border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Detalhes do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>ID do Pedido:</span>
                  <span className="font-mono text-sm">{paymentData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    paymentData.status === 'approved' 
                      ? 'bg-green-600/20 text-green-400' 
                      : 'bg-yellow-600/20 text-yellow-400'
                  }`}>
                    {paymentData.status === 'approved' ? 'Aprovado' : 'Aguardando Pagamento'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Método de Pagamento:</span>
                  <span className="capitalize">{paymentData.paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instruções e Botões de Ação */}
          {paymentData.paymentMethod === 'pix' && paymentData.status === 'waiting_payment' && (
            <Card className="bg-blue-600/10 border-blue-600/30 mb-8">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Como pagar com PIX:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Abra o app do seu banco</li>
                  <li>Escolha a opção PIX</li>
                  <li>Escaneie o QR Code ou cole o código PIX</li>
                  <li>Confirme o pagamento</li>
                  <li>Aguarde a confirmação (geralmente instantânea)</li>
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Botões de Navegação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
                <Home className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
            
            {paymentData.status === 'approved' && (
              <Button className="w-full sm:w-auto bg-netflix-red hover:bg-red-700">
                Começar a Assistir
              </Button>
            )}
          </div>

          {/* Suporte */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Problemas com o pagamento? 
              <button 
                onClick={() => {
                  const element = document.getElementById('chat-widget');
                  if (element) element.click();
                }}
                className="text-netflix-red hover:underline ml-1"
              >
                Fale conosco
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}