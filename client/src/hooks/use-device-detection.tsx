import { useEffect } from 'react';

export function useDeviceDetection() {
  useEffect(() => {
    // Device detection logic - currently disabled based on replit.md changelog
    // Previously used for automatic desktop redirection, but removed on June 16, 2025
    // "Removed automatic desktop redirection - all devices now access home page directly"
    
    // This hook is kept for potential future device-specific functionality
    // but currently performs no redirections
  }, []);
}
