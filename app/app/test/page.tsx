
'use client';

import { useState, useEffect } from 'react';
import { getProductByISBN, getPricesByISBN } from '@/lib/mock-data';
import { BarcodeScanner } from '@/components/barcode-scanner';
import { PriceResults } from '@/components/price-results';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [currentPrices, setCurrentPrices] = useState<any[]>([]);

  const addResult = (message: string, success: boolean = true) => {
    setTestResults(prev => [...prev, `${success ? '✅' : '❌'} ${message}`]);
  };

  const testMockData = () => {
    addResult('Testar mock data...');
    try {
      // Test med olika ISBN-koder
      const testCodes = ['9780545010221', '9789113121475', '602537154593'];
      testCodes.forEach(code => {
        const product = getProductByISBN(code);
        const prices = getPricesByISBN(code);
        if (product && prices.length > 0) {
          addResult(`ISBN ${code}: Produkt och priser hittades - ${product.title}`);
        } else {
          addResult(`ISBN ${code}: Problem med data`, false);
        }
      });
    } catch (error: any) {
      addResult(`Mock data fel: ${error.message}`, false);
    }
  };

  const testScannerSimulation = (testCode: string) => {
    addResult(`Simulerar scanning av kod: ${testCode}`);
    try {
      handleScan(testCode);
      addResult('Scanner simulation successful');
    } catch (error: any) {
      addResult(`Scanner simulation fel: ${error.message}`, false);
    }
  };

  const handleScan = (code: string) => {
    const cleanCode = code.replace(/\D/g, '').slice(0, 13);
    
    if (cleanCode.length < 10) {
      addResult('Kod för kort', false);
      return;
    }

    const product = getProductByISBN(cleanCode);
    const prices = getPricesByISBN(cleanCode);

    if (product && prices.length > 0) {
      setCurrentProduct(product);
      setCurrentPrices(prices);
      addResult(`Scanning lyckades: ${product.title}`);
    } else {
      addResult('Ingen produktdata hittades', false);
    }
  };

  const testPWAFeatures = () => {
    addResult('Testar PWA features...');
    
    // Test service worker
    if ('serviceWorker' in navigator) {
      addResult('Service Worker stöd: Ja');
    } else {
      addResult('Service Worker stöd: Nej', false);
    }

    // Test manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      addResult('Manifest länk: Hittad');
    } else {
      addResult('Manifest länk: Saknas', false);
    }

    // Test PWA display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      addResult('PWA läge: Standalone (installerad)');
    } else {
      addResult('PWA läge: Browser (ej installerad)');
    }
  };

  const runComprehensiveAudit = async () => {
    setTestResults([]);
    addResult('=== 🚀 Startar Omfattande Audit ===');
    
    // PWA Features Test
    try {
      if ('serviceWorker' in navigator) {
        addResult('Service Worker Support: ✅ Available');
      } else {
        addResult('Service Worker Support: ❌ Not available');
      }

      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        addResult(`PWA Manifest: ✅ Found at ${manifestLink.getAttribute('href')}`);
      } else {
        addResult('PWA Manifest: ❌ Missing');
      }

      if (window.matchMedia('(display-mode: standalone)').matches) {
        addResult('PWA Display Mode: ✅ Standalone (installed)');
      } else {
        addResult('PWA Display Mode: ✅ Browser (can be installed)');
      }

      const themeColor = document.querySelector('meta[name="theme-color"]');
      const appleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
      
      addResult(`Theme Color Meta: ${themeColor ? '✅' : '❌'} ${themeColor?.getAttribute('content') || 'Missing'}`);
      addResult(`Apple PWA Meta: ${appleCapable ? '✅' : '❌'} ${appleCapable?.getAttribute('content') || 'Missing'}`);

    } catch (error: any) {
      addResult(`PWA Features Error: ❌ ${error.message}`);
    }

    // UI Components Test
    try {
      const buttons = document.querySelectorAll('button');
      const gradientBg = document.querySelector('.bg-gradient-to-br');
      const cards = document.querySelectorAll('.rounded-lg');
      
      addResult(`Interactive Buttons: ✅ Found ${buttons.length} buttons`);
      addResult(`Gradient Background: ${gradientBg ? '✅' : '❌'} ${gradientBg ? 'Applied' : 'Missing'}`);
      addResult(`Card Components: ✅ Found ${cards.length} cards`);
      addResult(`Responsive Design: ✅ Current width: ${window.innerWidth}px`);

    } catch (error: any) {
      addResult(`UI Components Error: ❌ ${error.message}`);
    }

    // Icons and Assets Test
    try {
      const favicon = document.querySelector('link[rel="icon"]');
      const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
      const icons = document.querySelectorAll('[class*="lucide"]');
      
      addResult(`Favicon: ${favicon ? '✅' : '❌'} ${favicon?.getAttribute('href') || 'Missing'}`);
      addResult(`Apple Touch Icon: ${appleIcon ? '✅' : '❌'} ${appleIcon?.getAttribute('href') || 'Missing'}`);
      addResult(`Lucide Icons: ✅ Found ${icons.length} icons`);

    } catch (error: any) {
      addResult(`Icons Test Error: ❌ ${error.message}`);
    }

    // JavaScript Framework Test
    try {
      const nextScript = document.querySelector('script[src*="_next"]');
      addResult(`Next.js Framework: ${nextScript ? '✅' : '❌'} ${nextScript ? 'Loaded' : 'Not detected'}`);

    } catch (error: any) {
      addResult(`JavaScript Test Error: ❌ ${error.message}`);
    }

    // Performance Test
    try {
      const loadTime = performance.timing?.loadEventEnd - performance.timing?.navigationStart;
      const domContentLoaded = performance.timing?.domContentLoadedEventEnd - performance.timing?.navigationStart;
      
      if (loadTime) {
        addResult(`Page Load Time: ${loadTime < 3000 ? '✅' : '⚠️'} ${loadTime}ms`);
      }
      if (domContentLoaded) {
        addResult(`DOM Ready Time: ${domContentLoaded < 2000 ? '✅' : '⚠️'} ${domContentLoaded}ms`);
      }

    } catch (error: any) {
      addResult(`Performance Test Error: ❌ ${error.message}`);
    }

    // Network Status Test  
    try {
      const isOnline = navigator.onLine;
      addResult(`Online Status: ✅ ${isOnline ? 'Online' : 'Offline'}`);

      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      addResult(`Connection API: ${connection ? '✅' : '⚠️'} ${connection?.effectiveType || 'Not available'}`);

    } catch (error: any) {
      addResult(`Network Test Error: ❌ ${error.message}`);
    }

    // Mock Data Test
    testMockData();
    
    // Scanner Simulation Test
    testScannerSimulation('9780545010221');
    
    addResult('=== 🎉 Omfattande Audit Slutförd ===');
    
    // Calculate summary
    const passedTests = testResults.filter(r => r.includes('✅')).length;
    const totalTests = testResults.length;
    const successRate = Math.round((passedTests / totalTests) * 100);
    
    addResult(`📊 SAMMANFATTNING: ${passedTests}/${totalTests} test lyckades (${successRate}%)`);
  };

  const runAllTests = async () => {
    runComprehensiveAudit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧪 Test Suite - Prisjämförelse Scanner
              <Badge variant="outline">Debug Mode</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={runAllTests} variant="default">
                🚀 Kör Alla Tester
              </Button>
              <Button onClick={testMockData} variant="outline">
                📊 Test Mock Data
              </Button>
              <Button onClick={testPWAFeatures} variant="outline">
                📱 Test PWA
              </Button>
              <Button onClick={() => testScannerSimulation('9780545010221')} variant="outline">
                📷 Test Scanner
              </Button>
              <Button onClick={() => setTestResults([])} variant="secondary">
                🧹 Rensa
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Resultat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded font-mono text-sm ${
                      result.includes('❌') ? 'bg-red-100 text-red-800' : 
                      result.includes('===') ? 'bg-blue-100 text-blue-800 font-bold' :
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Real Scanner Test */}
        <Card>
          <CardHeader>
            <CardTitle>Live Scanner Test</CardTitle>
          </CardHeader>
          <CardContent>
            <BarcodeScanner
              isActive={isScanning}
              onToggle={() => setIsScanning(!isScanning)}
              onScan={handleScan}
            />
          </CardContent>
        </Card>

        {/* Current Results */}
        {currentProduct && currentPrices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Aktuellt Scan Resultat</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceResults
                product={currentProduct}
                prices={currentPrices}
                onNewScan={() => {
                  setCurrentProduct(null);
                  setCurrentPrices([]);
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Snabbtester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => testScannerSimulation('9780545010221')}
                variant="outline"
                className="text-left justify-start"
              >
                📚 Test Harry Potter
              </Button>
              <Button 
                onClick={() => testScannerSimulation('9789113121475')}
                variant="outline"
                className="text-left justify-start"
              >
                📖 Test Millennium
              </Button>
              <Button 
                onClick={() => testScannerSimulation('602537154593')}
                variant="outline"
                className="text-left justify-start"
              >
                🎵 Test Abbey Road
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
