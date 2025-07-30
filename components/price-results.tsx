
'use client';

import { PriceData, Product } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Package, ShoppingCart, Truck } from 'lucide-react';
import Image from 'next/image';

interface PriceResultsProps {
  product: Product | null;
  prices: PriceData[];
  onNewScan: () => void;
}

export function PriceResults({ product, prices, onNewScan }: PriceResultsProps) {
  if (!product || prices.length === 0) {
    return null;
  }

  // Sort prices by total cost (price + shipping)
  const sortedPrices = [...prices].sort((a, b) => {
    const totalA = a.price + (a.shipping || 0);
    const totalB = b.price + (b.shipping || 0);
    return totalA - totalB;
  });

  const lowestPrice = sortedPrices[0];
  const lowestTotal = lowestPrice.price + (lowestPrice.shipping || 0);

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return <Badge className="bg-green-500">I lager</Badge>;
      case 'limited':
        return <Badge className="bg-yellow-500">Begränsat</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive">Slutsåld</Badge>;
      default:
        return <Badge variant="secondary">Okänd</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Package className="w-5 h-5 text-blue-500" />
            Produktinformation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {product.image && (
              <div className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                <Image 
                  src={product.image} 
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{product.title}</h3>
              {product.author && (
                <p className="text-gray-600">Av: {product.author}</p>
              )}
              {product.artist && (
                <p className="text-gray-600">Artist: {product.artist}</p>
              )}
              <p className="text-sm text-gray-500">ISBN: {product.isbn}</p>
              <Badge variant="outline" className="mt-2">
                {product.type === 'book' ? 'Bok' : product.type === 'music' ? 'Musik' : 'Okänd'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-green-500" />
            Prisjämförelse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedPrices.map((price, index) => {
              const totalCost = price.price + (price.shipping || 0);
              const isLowest = index === 0;
              
              return (
                <div 
                  key={`${price.site}-${index}`}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isLowest 
                      ? 'border-green-500 bg-green-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{price.site}</h4>
                        {isLowest && (
                          <Badge className="bg-green-500">Lägst pris!</Badge>
                        )}
                        {getAvailabilityBadge(price.availability)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Pris: {price.price} {price.currency}</span>
                        {(price.shipping ?? 0) > 0 && (
                          <span className="flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            Frakt: {price.shipping} {price.currency}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${isLowest ? 'text-green-700' : 'text-gray-900'}`}>
                        {totalCost} {price.currency}
                      </div>
                      <div className="text-sm text-gray-500">
                        Totalt inkl. frakt
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-3" 
                    size="sm"
                    variant={isLowest ? "default" : "outline"}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Gå till {price.site}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-lg">
              <span className="font-semibold text-blue-700">{lowestPrice.site}</span> har lägst pris:
            </p>
            <p className="text-3xl font-bold text-blue-900 mt-1">
              {lowestTotal} SEK
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Spara upp till {Math.max(...sortedPrices.map(p => p.price + (p.shipping || 0))) - lowestTotal} SEK
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Scan Next Button */}
      <Button 
        onClick={onNewScan} 
        size="lg" 
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        Scanna nästa produkt
      </Button>
    </div>
  );
}
