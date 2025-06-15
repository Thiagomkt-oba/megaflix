import { Download, Smartphone, Tv, Monitor, HardDrive, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadOption {
  device: string;
  icon: React.ReactNode;
  downloadUrl: string;
  imageUrl: string;
  description: string;
}

export default function DownloadPage() {
  const downloadOptions: DownloadOption[] = [
    {
      device: "Celular",
      icon: <Smartphone className="h-8 w-8" />,
      downloadUrl: "https://megaflixapp.top/MegaFlix.4.5.2.apk",
      imageUrl: "https://i.imgur.com/olEmJbR.png",
      description: "Android APK"
    },
    {
      device: "Smart TV",
      icon: <Tv className="h-8 w-8" />,
      downloadUrl: "https://megaflixapp.top/downloader.php",
      imageUrl: "https://i.imgur.com/l01GwbY.png",
      description: "Smart TV App"
    },
    {
      device: "Computador",
      icon: <Monitor className="h-8 w-8" />,
      downloadUrl: "https://fazoeli.co.za/updates/MegaFlix%20Setup%201.0.3.exe",
      imageUrl: "https://i.imgur.com/NGC0LNa.png",
      description: "Windows Installer"
    },
    {
      device: "TV Box",
      icon: <HardDrive className="h-8 w-8" />,
      downloadUrl: "https://megaflixapp.top/downloader.php",
      imageUrl: "https://i.imgur.com/oEDXBOo.png",
      description: "TV Box App"
    }
  ];

  const handleDownload = (url: string, device: string) => {
    window.open(url, '_blank');
  };

  const openTelegramSupport = () => {
    window.open('https://t.me/+5uy972X7HPQ2YjYx', '_blank');
  };

  return (
    <div className="min-h-screen bg-netflix-dark text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-netflix-red">Megaflix</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Escolha o dispositivo para baixar
            </h1>
            <p className="text-xl text-gray-300">
              Só baixar e fazer a instalação do aplicativo!
            </p>
          </div>

          {/* Download Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {downloadOptions.map((option, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-netflix-red transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Device Image */}
                <div className="mb-6">
                  <img
                    src={option.imageUrl}
                    alt={option.device}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Device Info */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-3 text-netflix-red">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{option.device}</h3>
                  <p className="text-gray-400 text-sm">{option.description}</p>
                </div>

                {/* Download Button */}
                <Button
                  onClick={() => handleDownload(option.downloadUrl, option.device)}
                  className="w-full bg-netflix-red hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>
            ))}
          </div>

          {/* Support Section */}
          <div className="text-center">
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 max-w-md mx-auto">
              <div className="mb-4">
                <MessageCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Precisa de ajuda?</h3>
                <p className="text-gray-300 mb-6">
                  Entre em contato com nosso suporte no Telegram
                </p>
              </div>
              
              <Button
                onClick={openTelegramSupport}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Suporte e pedidos
              </Button>
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="mt-12 bg-gray-900 rounded-xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6 text-center">Instruções de Instalação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-netflix-red">📱 Android/Celular</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>1. Baixe o arquivo APK</li>
                  <li>2. Permita instalação de fontes desconhecidas</li>
                  <li>3. Execute o arquivo baixado</li>
                  <li>4. Siga as instruções na tela</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3 text-netflix-red">💻 Windows</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>1. Baixe o arquivo Setup.exe</li>
                  <li>2. Execute como administrador</li>
                  <li>3. Siga o assistente de instalação</li>
                  <li>4. Reinicie se necessário</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}