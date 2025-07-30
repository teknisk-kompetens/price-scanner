
export interface PriceData {
  site: string;
  price: number;
  currency: string;
  availability: 'in_stock' | 'limited' | 'out_of_stock';
  url: string;
  shipping?: number;
}

export interface Product {
  isbn: string;
  title: string;
  author?: string;
  artist?: string;
  type: 'book' | 'music' | 'unknown';
  image?: string;
}

export const mockProducts: Record<string, Product> = {
  '9780545010221': {
    isbn: '9780545010221',
    title: 'Harry Potter and the Deathly Hallows',
    author: 'J.K. Rowling',
    type: 'book',
    image: 'https://i.pinimg.com/originals/e7/08/69/e708697043f1a3b4d2d242c9f554f24e.jpg'
  },
  '9789113121475': {
    isbn: '9789113121475',
    title: 'Millennium Trilogin',
    author: 'Stieg Larsson',
    type: 'book',
    image: 'https://img.freepik.com/premium-photo/book-representing-literature-reading_87543-56629.jpg'
  },
  '602537154593': {
    isbn: '602537154593',
    title: 'Abbey Road',
    artist: 'The Beatles',
    type: 'music',
    image: 'https://i.pinimg.com/originals/e9/ce/fc/e9cefc3049a7362308a53e36b921d7cf.jpg'
  },
  '886979578524': {
    isbn: '886979578524',
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    type: 'music',
    image: 'https://i.pinimg.com/originals/c6/13/af/c613afac9a4a1ed8279cebda40708fbb.png'
  }
};

export const mockPriceData: Record<string, PriceData[]> = {
  '9780545010221': [
    { site: 'Bokus', price: 149, currency: 'SEK', availability: 'in_stock', url: '#', shipping: 0 },
    { site: 'Adlibris', price: 142, currency: 'SEK', availability: 'in_stock', url: '#', shipping: 29 },
    { site: 'Bokborsen', price: 89, currency: 'SEK', availability: 'limited', url: '#', shipping: 39 },
  ],
  '9789113121475': [
    { site: 'Bokus', price: 299, currency: 'SEK', availability: 'in_stock', url: '#', shipping: 0 },
    { site: 'Adlibris', price: 279, currency: 'SEK', availability: 'in_stock', url: '#', shipping: 29 },
    { site: 'Bokborsen', price: 199, currency: 'SEK', availability: 'in_stock', url: '#', shipping: 39 },
  ],
  '602537154593': [
    { site: 'Discogs', price: 245, currency: 'SEK', availability: 'limited', url: '#', shipping: 49 },
    { site: 'Tradera', price: 189, currency: 'SEK', availability: 'in_stock', url: '#', shipping: 59 },
  ],
  '886979578524': [
    { site: 'Discogs', price: 320, currency: 'SEK', availability: 'in_stock', url: '#', shipping: 49 },
    { site: 'Tradera', price: 275, currency: 'SEK', availability: 'limited', url: '#', shipping: 59 },
  ]
};

export function getProductByISBN(isbn: string): Product | null {
  return mockProducts[isbn] || null;
}

export function getPricesByISBN(isbn: string): PriceData[] {
  return mockPriceData[isbn] || [];
}

export function identifyProductType(isbn: string): 'book' | 'music' | 'unknown' {
  // ISBN-13 för böcker börjar vanligtvis med 978 eller 979
  if (isbn.startsWith('978') || isbn.startsWith('979')) {
    return 'book';
  }
  // UPC koder för musik är vanligtvis 12 siffror
  if (isbn.length === 12 && /^\d+$/.test(isbn)) {
    return 'music';
  }
  return 'unknown';
}
