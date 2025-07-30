
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, RotateCcw } from 'lucide-react';

// Import Quagga dynamically to avoid SSR issues
let Quagga: any = null;
let isQuaggaLoaded = false;

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  isActive: boolean;
  onToggle: () => void;
}

export function BarcodeScanner({ onScan, isActive, onToggle }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuaggaReady, setIsQuaggaReady] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Hydration fix - mark as client-side after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load Quagga dynamically
  useEffect(() => {
    if (isClient && typeof window !== 'undefined' && !isQuaggaLoaded) {
      import('quagga').then((module) => {
        Quagga = module.default || module;
        isQuaggaLoaded = true;
        setIsQuaggaReady(true);
      }).catch((err) => {
        console.error('Failed to load Quagga:', err);
        setError('Kunde inte ladda scanner-biblioteket.');
      });
    } else if (isClient && isQuaggaLoaded) {
      setIsQuaggaReady(true);
    }
  }, [isClient]);

  // Handle scanner activation/deactivation
  useEffect(() => {
    if (isActive && isQuaggaReady && scannerRef?.current) {
      startScanner();
    } else if (!isActive && isQuaggaReady) {
      stopScanner();
    }

    return () => {
      if (isQuaggaReady) {
        stopScanner();
      }
    };
  }, [isActive, isQuaggaReady]);

  const startScanner = useCallback(async () => {
    // Safety checks
    if (!scannerRef?.current || !Quagga || !isQuaggaReady) {
      console.error('Scanner prerequisites not met:', {
        ref: !!scannerRef?.current,
        quagga: !!Quagga,
        ready: isQuaggaReady
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Ensure target element exists and is mounted
      const targetElement = scannerRef.current;
      if (!targetElement) {
        throw new Error('Scanner target element not found');
      }

      // Clean up any existing instance
      try {
        if (Quagga?.stop) {
          Quagga.stop();
        }
        if (Quagga?.offDetected) {
          Quagga.offDetected();
        }
      } catch (cleanupError) {
        console.warn('Error during cleanup:', cleanupError);
      }

      // Configure and initialize Quagga
      const config = {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: targetElement,  // Use the verified element
          constraints: {
            width: { min: 320, ideal: 640, max: 1280 },
            height: { min: 240, ideal: 480, max: 720 },
            facingMode: "environment",
            aspectRatio: { min: 1, max: 2 }
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader", 
            "code_128_reader",
            "code_39_reader",
            "codabar_reader",
            "i2of5_reader"
          ],
          debug: {
            drawBoundingBox: false,
            showFrequency: false,
            drawScanline: false,
            showPattern: false
          }
        },
        locate: true
      };

      // Initialize with promise wrapper for better error handling
      await new Promise<void>((resolve, reject) => {
        if (!Quagga?.init) {
          reject(new Error('Quagga.init is not available'));
          return;
        }

        Quagga.init(config, (err: any) => {
          if (err) {
            console.error('Quagga init error:', err);
            // More specific error messages
            if (err.name === 'NotAllowedError') {
              reject(new Error('Kamera-åtkomst nekad. Kontrollera webbläsarinställningar.'));
            } else if (err.name === 'NotFoundError') {
              reject(new Error('Ingen kamera hittades på enheten.'));
            } else if (err.name === 'NotSupportedError') {
              reject(new Error('Kameran stöds inte av webbläsaren.'));
            } else {
              reject(new Error(`Kamerafel: ${err.message || 'Okänt fel'}`));
            }
            return;
          }
          resolve();
        });
      });

      // Start the scanner
      if (!Quagga?.start) {
        throw new Error('Quagga.start is not available');
      }
      
      Quagga.start();
      
      // Set up detection handler
      if (Quagga?.onDetected) {
        Quagga.onDetected((data: any) => {
          try {
            const code = data?.codeResult?.code;
            if (code && typeof code === 'string' && code.length > 0) {
              console.log('Barcode detected:', code);
              onScan(code);
            }
          } catch (detectionError) {
            console.error('Error processing barcode detection:', detectionError);
          }
        });
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error('Scanner initialization failed:', err);
      setError(err.message || 'Kunde inte aktivera kameran. Kontrollera att du har gett tillstånd.');
      setIsLoading(false);
    }
  }, [onScan, isQuaggaReady]);

  const stopScanner = useCallback(() => {
    try {
      if (Quagga?.stop) {
        Quagga.stop();
      }
      if (Quagga?.offDetected) {
        Quagga.offDetected();
      }
    } catch (err) {
      console.warn('Error stopping scanner:', err);
    }
  }, []);

  const resetScanner = useCallback(() => {
    stopScanner();
    setError(null);
    if (isActive && isQuaggaReady) {
      setTimeout(startScanner, 200);
    }
  }, [isActive, isQuaggaReady, startScanner, stopScanner]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={onToggle}
          variant={isActive ? "destructive" : "default"}
          size="lg"
          className="flex-1 mr-2"
          disabled={!isQuaggaReady && !isActive}
        >
          {isActive ? (
            <>
              <CameraOff className="w-5 h-5 mr-2" />
              Stäng Scanner
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              {/* Hydration fix: Always show same text initially */}
              {!isClient ? 'Laddar scanner...' : isQuaggaReady ? 'Starta Scanner' : 'Laddar scanner...'}
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
            className="w-full aspect-[4/3] min-h-[400px] max-h-[600px] flex items-center justify-center"
          >
            {isLoading && (
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p>Startar kamera...</p>
                {!isQuaggaReady && <p className="text-xs mt-1 opacity-75">Laddar scanner-bibliotek...</p>}
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
          
          {isActive && !error && !isLoading && isQuaggaReady && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-64 h-1 bg-red-500 shadow-lg shadow-red-500/50 animate-pulse"></div>
              </div>
              <div className="absolute top-4 left-4 right-4 text-center text-white text-xs bg-black/50 rounded-lg p-2">
                🔍 Scanner aktiv - Rikta kameran mot streckkoden
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-center text-white text-sm">
                Håll enheten stadigt för bästa resultat
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
