
'use client';

import { Product, PriceData } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, Trash2, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface ScanHistoryItem {
  id: string;
  product: Product;
  prices: PriceData[];
  timestamp: Date;
  lowestPrice: number;
  lowestSite: string;
}

interface ScanHistoryProps {
  history: ScanHistoryItem[];
  onClearHistory: () => void;
  onRescanProduct: (product: Product) => void;
}

export function ScanHistory({ history, onClearHistory, onRescanProduct }: ScanHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (history.length === 0) return null;

  const displayedHistory = isExpanded ? history : history.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <History className="w-5 h-5 text-purple-500" />
            Scanningshistorik ({history.length})
          </CardTitle>
          <Button 
            onClick={onClearHistory} 
            variant="outline" 
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Rensa
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayedHistory.map((item) => (
            <div 
              key={item.id}
              className="p-3 bg-gray-50 rounded-lg border hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.title}</h4>
                  {item.product.author && (
                    <p className="text-sm text-gray-600">{item.product.author}</p>
                  )}
                  {item.product.artist && (
                    <p className="text-sm text-gray-600">{item.product.artist}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.product.type === 'book' ? 'Bok' : 'Musik'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {item.timestamp.toLocaleTimeString('sv-SE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-green-600 mt-1">
                    Lägst: {item.lowestPrice} SEK ({item.lowestSite})
                  </p>
                </div>
                
                <Button 
                  onClick={() => onRescanProduct(item.product)}
                  variant="outline" 
                  size="sm"
                  className="ml-2"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {history.length > 3 && (
            <Button 
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost" 
              size="sm" 
              className="w-full"
            >
              {isExpanded ? 'Visa färre' : `Visa ${history.length - 3} till`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
