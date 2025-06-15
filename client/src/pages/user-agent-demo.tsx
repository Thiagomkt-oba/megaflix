import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserAgentInfo {
  userAgent: string;
  platform: string;
  browser: string;
  isMobile: boolean;
  isBot: boolean;
  socialPlatform?: string;
}

export default function UserAgentDemo() {
  const [userAgentInfo, setUserAgentInfo] = useState<UserAgentInfo | null>(null);

  useEffect(() => {
    const detectUserAgent = () => {
      const ua = navigator.userAgent;
      
      // Detect platform
      let platform = "Desktop";
      if (/Mobile|Android|iPhone|iPad/.test(ua)) {
        platform = "Mobile";
      }

      // Detect browser
      let browser = "Unknown";
      if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Safari")) browser = "Safari";
      else if (ua.includes("Edge")) browser = "Edge";

      // Detect if mobile
      const isMobile = /Mobile|Android|iPhone|iPad/.test(ua);

      // Detect bots (simplified)
      const isBot = /bot|crawler|spider|scraper/i.test(ua);

      // Detect social media platforms (educational purposes only)
      let socialPlatform;
      if (ua.includes("facebookexternalhit")) socialPlatform = "Facebook";
      else if (ua.includes("Twitterbot")) socialPlatform = "Twitter";
      else if (ua.includes("LinkedInBot")) socialPlatform = "LinkedIn";
      else if (ua.includes("WhatsApp")) socialPlatform = "WhatsApp";
      else if (ua.includes("TelegramBot")) socialPlatform = "Telegram";

      setUserAgentInfo({
        userAgent: ua,
        platform,
        browser,
        isMobile,
        isBot,
        socialPlatform
      });
    };

    detectUserAgent();
  }, []);

  if (!userAgentInfo) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-dark-primary text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          User Agent Detection Demo
        </h1>
        
        <Card className="bg-dark-secondary border-gray-600 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Current User Agent Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Platform</h3>
              <Badge variant={userAgentInfo.platform === "Mobile" ? "default" : "secondary"}>
                {userAgentInfo.platform}
              </Badge>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Browser</h3>
              <Badge variant="outline">{userAgentInfo.browser}</Badge>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Device Type</h3>
              <Badge variant={userAgentInfo.isMobile ? "default" : "secondary"}>
                {userAgentInfo.isMobile ? "Mobile Device" : "Desktop"}
              </Badge>
            </div>

            {userAgentInfo.isBot && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Bot Detection</h3>
                <Badge variant="destructive">Bot Detected</Badge>
              </div>
            )}

            {userAgentInfo.socialPlatform && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Social Platform</h3>
                <Badge variant="default">{userAgentInfo.socialPlatform}</Badge>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Full User Agent String</h3>
              <div className="bg-gray-800 p-3 rounded text-sm break-all">
                {userAgentInfo.userAgent}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-secondary border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Educational Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-300">
              <p>
                This demo shows how websites can detect different user agents and platforms.
              </p>
              <p>
                <strong>Legitimate uses include:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Responsive design optimization</li>
                <li>Feature compatibility checks</li>
                <li>Analytics and usage tracking</li>
                <li>Mobile vs desktop experiences</li>
              </ul>
              <p className="text-yellow-400">
                <strong>Note:</strong> This is for educational purposes only. Always comply with platform terms of service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}