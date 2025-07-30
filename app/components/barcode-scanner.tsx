
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, RotateCcw } from 'lucide-react';

// Import Quagga dynamically to avoid SSR issues
let Quagga: any = null;

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  isActive: boolean;
  onToggle: () => void;
}

export function BarcodeScanner({ onScan, isActive, onToggle }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically import Quagga only on client side
    if (typeof window !== 'undefined' && !Quagga) {
      import('quagga').then((module) => {
        Quagga = module.default;
      });
    }
  }, []);

  useEffect(() => {
    if (isActive && Quagga && scannerRef.current) {
      startScanner();
    } else if (!isActive && Quagga) {
      stopScanner();
    }

    return () => {
      if (Quagga) {
        stopScanner();
      }
    };
  }, [isActive]);

  const startScanner = async () => {
    if (!scannerRef.current || !Quagga) return;

    setIsLoading(true);
    setError(null);

    try {
      await new Promise<void>((resolve, reject) => {
        Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              width: { min: 320, ideal: 640, max: 1280 },
              height: { min: 240, ideal: 480, max: 720 },
              facingMode: "environment"
            }
          },
          decoder: {
            readers: [
              "ean_reader",
              "ean_8_reader", 
              "code_128_reader",
              "code_39_reader",
              "codabar_reader",
              "i2of5_reader"
            ]
          }
        }, (err: any) => {
          if (err) {
            console.error('Quagga init error:', err);
            reject(err);
            return;
          }
          resolve();
        });
      });

      Quagga.start();
      
      Quagga.onDetected((data: any) => {
        const code = data?.codeResult?.code;
        if (code) {
          onScan(code);
          // Don't stop scanner to allow continuous scanning
        }
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Scanner initialization failed:', err);
      setError('Kunde inte aktivera kameran. Kontrollera att du har gett tillstånd.');
      setIsLoading(false);
    }
  };

  const stopScanner = () => {
    if (Quagga) {
      Quagga.stop();
      Quagga.offDetected();
    }
  };

  const resetScanner = () => {
    stopScanner();
    setError(null);
    if (isActive) {
      setTimeout(startScanner, 100);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={onToggle}
          variant={isActive ? "destructive" : "default"}
          size="lg"
          className="flex-1 mr-2"
        >
          {isActive ? (
            <>
              <CameraOff className="w-5 h-5 mr-2" />
              Stäng Scanner
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              Starta Scanner
            </>
          )}
        </Button>
        
        {isActive && (
          <Button onClick={resetScanner} variant="outline" size="lg">
            <RotateCcw className="w-5 h-5" />
          </Button>
        )}
      </div>

      {isActive && (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <div 
            ref={scannerRef} 
            className="w-full h-64 flex items-center justify-center"
          >
            {isLoading && (
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                Startar kamera...
              </div>
            )}
          </div>
          
          {error && (
            <div className="absolute inset-0 bg-red-900/90 flex items-center justify-center text-white text-center p-4">
              <div>
                <p className="text-sm font-medium">{error}</p>
                <Button onClick={resetScanner} variant="outline" size="sm" className="mt-2">
                  Försök igen
                </Button>
              </div>
            </div>
          )}
          
          {isActive && !error && !isLoading && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-64 h-1 bg-red-500 shadow-lg shadow-red-500/50"></div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-center text-white text-sm">
                Rikta kameran mot streckkoden
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
