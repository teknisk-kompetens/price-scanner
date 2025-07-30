
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <WifiOff className="w-10 h-10 text-blue-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Du är offline</h1>
            <p className="text-gray-600">
              Ingen internetanslutning hittades. Kontrollera din anslutning och försök igen.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Försök igen
            </Button>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Tillbaka till startsidan
              </Button>
            </Link>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Vissa funktioner kan vara begränsade offline.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


