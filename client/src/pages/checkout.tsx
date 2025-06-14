import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, QrCode, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface FormData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  paymentMethod: "pix" | "credit_card";
  // Campos do cartão
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

interface PaymentResponse {
  id: string;
  status: string;
  qrCode?: string;
  qrCodeText?: string;
  pixUrl?: string;
}

export default function Checkout() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    paymentMethod: "pix",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF[i]) * (10 - i);
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cleanCPF[9]) !== digit1) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF[i]) * (11 - i);
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(cleanCPF[10]) === digit2;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.replace(/(\d{2})(\d{2})/, '$1/$2');
    }
    return numbers;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value;
    
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'telefone') {
      formattedValue = formatPhone(value);
    } else if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const validateForm = (): boolean => {
    if (!formData.nome || !formData.email || !formData.telefone) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return false;
    }

    if (!validateCPF(formData.cpf)) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.paymentMethod === "credit_card") {
      const cardNumberClean = formData.cardNumber.replace(/\D/g, '');
      if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
        toast({
          title: "Cartão inválido",
          description: "Número do cartão deve ter entre 13 e 19 dígitos.",
          variant: "destructive",
        });
        return false;
      }

      if (!formData.expiryDate || !formData.cvv || !formData.cardName) {
        toast({
          title: "Dados do cartão incompletos",
          description: "Por favor, preencha todos os dados do cartão.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const endpoint = formData.paymentMethod === "pix" 
        ? "/api/create-pix-payment" 
        : "/api/create-card-payment";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name: formData.nome,
            email: formData.email,
            document: formData.cpf.replace(/\D/g, ''),
            phone: formData.telefone.replace(/\D/g, '')
          },
          paymentMethod: formData.paymentMethod,
          ...(formData.paymentMethod === "credit_card" && {
            card: {
              number: formData.cardNumber.replace(/\D/g, ''),
              expiryDate: formData.expiryDate,
              cvv: formData.cvv,
              holderName: formData.cardName
            }
          }),
          items: [{
            id: "megaflix-subscription",
            name: "Assinatura Megaflix",
            quantity: 1,
            priceInCents: 3790 // R$ 37,90
          }],
          amount: 37.90
        }),
      });

      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Failed to parse:", responseText);
        throw new Error("Resposta inválida do servidor de pagamento");
      }

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      // Armazena dados do pagamento no localStorage
      const paymentData = {
        ...data,
        paymentMethod: formData.paymentMethod
      };
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      
      // Redireciona para página de sucesso
      setLocation('/payment-success');
      
      toast({
        title: "Pagamento iniciado!",
        description: formData.paymentMethod === "pix" 
          ? "Redirecionando para finalizar o pagamento PIX..."
          : "Pagamento aprovado! Redirecionando...",
      });

    } catch (error: any) {
      console.error("Erro no pagamento:", error);
      console.error("Erro detalhado:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      toast({
        title: "Erro no pagamento",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentResponse && formData.paymentMethod === "pix") {
    return (
      <div className="min-h-screen bg-dark-primary py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-dark-secondary border-gray-600">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-white">PIX Gerado com Sucesso!</CardTitle>
              <CardDescription className="text-gray-300">
                Escaneie o QR Code ou copie o código PIX para finalizar o pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {paymentResponse.qrCode && (
                <div className="text-center">
                  <img 
                    src={paymentResponse.qrCode} 
                    alt="QR Code PIX" 
                    className="mx-auto bg-white p-4 rounded-lg"
                  />
                </div>
              )}
              
              {paymentResponse.qrCodeText && (
                <div>
                  <Label className="text-white mb-2 block">Código PIX (Copia e Cola):</Label>
                  <div className="bg-gray-700 p-3 rounded border">
                    <code className="text-sm text-gray-200 break-all">
                      {paymentResponse.qrCodeText}
                    </code>
                  </div>
                  <Button
                    onClick={() => navigator.clipboard.writeText(paymentResponse.qrCodeText!)}
                    className="mt-2 w-full bg-netflix-red hover:bg-red-700"
                  >
                    Copiar Código PIX
                  </Button>
                </div>
              )}

              <div className="text-center pt-4">
                <p className="text-gray-300 mb-4">
                  Após o pagamento, seu acesso será liberado automaticamente!
                </p>
                <Button
                  onClick={() => window.location.href = "/"}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Voltar ao Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="bg-dark-secondary border-gray-600">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">Finalizar Assinatura</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Complete seus dados para ativar sua conta no Megaflix
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Dados Pessoais</h3>
                
                <div>
                  <Label htmlFor="nome" className="text-white">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cpf" className="text-white">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telefone" className="text-white">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Forma de Pagamento</h3>
                
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
                    <RadioGroupItem value="pix" id="pix" className="text-netflix-red" />
                    <Label htmlFor="pix" className="text-white flex items-center cursor-pointer flex-1">
                      <QrCode className="h-5 w-5 mr-2" />
                      PIX - Aprovação instantânea
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
                    <RadioGroupItem value="credit_card" id="credit_card" className="text-netflix-red" />
                    <Label htmlFor="credit_card" className="text-white flex items-center cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Cartão de Crédito/Débito
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Dados do Cartão */}
              {formData.paymentMethod === "credit_card" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Dados do Cartão</h3>
                  
                  <div>
                    <Label htmlFor="cardNumber" className="text-white">Número do Cartão *</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate" className="text-white">Validade *</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        placeholder="MM/AA"
                        maxLength={5}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cvv" className="text-white">CVV *</Label>
                      <Input
                        id="cvv"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName" className="text-white">Nome no Cartão *</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value)}
                      placeholder="Nome como impresso no cartão"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Resumo do Pedido */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Resumo do Pedido</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Assinatura Megaflix (Mensal)</span>
                  <span className="text-white">R$ 37,90</span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-netflix-red text-xl">R$ 37,90</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-netflix-red hover:bg-red-700 text-white py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  `Pagar com ${formData.paymentMethod === "pix" ? "PIX" : "Cartão"}`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}