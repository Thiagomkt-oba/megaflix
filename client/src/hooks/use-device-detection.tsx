import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export function useDeviceDetection() {
  const [, setLocation] = useLocation();
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android.*Tablet/i.test(userAgent);
    
    if (isMobile && !isTablet) {
      setDeviceType('mobile');
    } else if (isTablet) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }

    // Redirecionamento removido - permitir acesso desktop na home
  }, [setLocation]);

  return { deviceType };
}