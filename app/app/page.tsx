
'use client';

import { useState, useCallback } from 'react';
import { BarcodeScanner } from '@/components/barcode-scanner';
import { PriceResults } from '@/components/price-results';
import { ScanHistory } from '@/components/scan-history';
import { PWAInstallPrompt } from '@/components/pwa-install-prompt';
import { PWAUpdatePrompt } from '@/components/pwa-update-prompt';
import { getProductByISBN, getPricesByISBN, Product, PriceData } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scan, Zap, TrendingDown, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePWA } from '@/hooks/use-pwa';

interface ScanHistoryItem {
  id: string;
  product: Product;
  prices: PriceData[];
  timestamp: Date;
  lowestPrice: number;
  lowestSite: string;
}

export default function HomePage() {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentPrices, setCurrentPrices] = useState<PriceData[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const { toast } = useToast();
  const { isOnline, isInstalled } = usePWA();

  const handleScan = useCallback((code: string) => {
    // Clean the scanned code
    const cleanCode = code.replace(/\D/g, '').slice(0, 13);
    
    if (cleanCode.length < 10) {
      toast({
        title: "Ogiltig kod",
        description: "Streckkoden är för kort. Försök igen.",
        variant: "destructive",
      });
      return;
    }

    const product = getProductByISBN(cleanCode);
    const prices = getPricesByISBN(cleanCode);

    if (product && prices.length > 0) {
      setCurrentProduct(product);
      setCurrentPrices(prices);
      
      // Add to history
      const lowestPrice = Math.min(...prices.map(p => p.price + (p.shipping || 0)));
      const lowestSite = prices.find(p => (p.price + (p.shipping || 0)) === lowestPrice)?.site || '';
      
      const historyItem: ScanHistoryItem = {
        id: `${cleanCode}-${Date.now()}`,
        product,
        prices,
        timestamp: new Date(),
        lowestPrice,
        lowestSite
      };

      setScanHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10

      toast({
        title: "Produkt hittad!",
        description: `${product.title} - Lägst pris: ${lowestPrice} SEK`,
        className: "bg-green-50 border-green-200",
      });
    } else {
      toast({
        title: "Produkt ej hittad",
        description: `Kod: ${cleanCode}. Produkten finns inte i databasen.`,
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleNewScan = () => {
    setCurrentProduct(null);
    setCurrentPrices([]);
    setIsScannerActive(true);
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    toast({
      title: "Historik rensad",
      description: "All scanningshistorik har tagits bort.",
    });
  };

  const handleRescanProduct = (product: Product) => {
    const prices = getPricesByISBN(product.isbn);
    if (prices.length > 0) {
      setCurrentProduct(product);
      setCurrentPrices(prices);
      setIsScannerActive(false);
    }
  };

  return (
    <>
      {/* PWA Update Prompt */}
      <PWAUpdatePrompt />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b shadow-sm safe-area-top">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Scan className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Prisjämförelse Scanner</h1>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Scanna & jämför priser snabbt</p>
                    {isInstalled && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Installerad
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Online/Offline Status */}
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  isOnline 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {isOnline ? (
                    <Wifi className="w-3 h-3" />
                  ) : (
                    <WifiOff className="w-3 h-3" />
                  )}
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
                
                {scanHistory.length > 0 && (
                  <Badge variant="outline" className="bg-purple-50">
                    {scanHistory.length} scannade
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome/Info Card */}
        {!currentProduct && !isScannerActive && (
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Scan className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Välkommen till Prisjämförelse Scanner</h2>
                  <p className="text-blue-100 mb-4">
                    Scanna ISBN-koder på böcker eller UPC-koder på LP-skivor för att snabbt jämföra priser från flera sajter.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <Zap className="w-6 h-6 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Snabb Scanning</h3>
                    <p className="text-sm text-blue-100">Scanna flera produkter i rad</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <TrendingDown className="w-6 h-6 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Bästa Priset</h3>
                    <p className="text-sm text-blue-100">Hitta lägsta pris automatiskt</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Scan className="w-6 h-6 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Flera Sajter</h3>
                    <p className="text-sm text-blue-100">Bokus, Adlibris, Discogs m.fl.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scanner Component */}
        <BarcodeScanner 
          onScan={handleScan}
          isActive={isScannerActive}
          onToggle={() => setIsScannerActive(!isScannerActive)}
        />

        {/* Price Results */}
        <PriceResults 
          product={currentProduct}
          prices={currentPrices}
          onNewScan={handleNewScan}
        />

        {/* Scan History */}
        <ScanHistory 
          history={scanHistory}
          onClearHistory={handleClearHistory}
          onRescanProduct={handleRescanProduct}
        />
      </main>
      </div>
    </>
  );
}
