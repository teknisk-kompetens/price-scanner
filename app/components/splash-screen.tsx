
'use client';

import { useState, useEffect } from 'react';
import { Scan } from 'lucide-react';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Visa splash screen i 2 sekunder
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="splash-screen">
      <div className="flex flex-col items-center justify-center text-white">
        <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
          <Scan className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">PriceScanner</h1>
        <p className="text-lg text-white/80">Prisjämförelse Scanner</p>
        <div className="mt-8">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
