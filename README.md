# Price Scanner PWA

En progressiv webbapplikation (PWA) för att scanna ISBN/streckkoder och jämföra priser från olika svenska sajter.

## Funktioner

- 📱 **PWA-stöd**: Installera som app på mobil och desktop
- 📷 **Streckkodsscanning**: Scanna ISBN och andra streckkoder med kameran
- 💰 **Prisjämförelse**: Jämför priser från flera svenska webbsajter
- 📊 **Scanhistorik**: Spara och visa tidigare scanningar
- 🌙 **Mörkt/ljust tema**: Växla mellan olika teman
- 📱 **Responsiv design**: Fungerar på alla enheter

## Teknisk stack

- **Frontend**: Next.js 14 med App Router
- **Styling**: Tailwind CSS + shadcn/ui komponenter
- **Streckkodsscanning**: QuaggaJS
- **PWA**: next-pwa
- **Databas**: Prisma (konfigurerad för SQLite/PostgreSQL)
- **TypeScript**: Fullt typad kodbase

## Installation

1. Klona repositoryt:
```bash
git clone https://github.com/teknisk-kompetens/price-scanner.git
cd price-scanner/app
```

2. Installera dependencies:
```bash
npm install
# eller
yarn install
```

3. Starta utvecklingsservern:
```bash
npm run dev
# eller
yarn dev
```

4. Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Byggning för produktion

```bash
npm run build
npm start
```

## PWA Installation

Appen kan installeras som en PWA på:
- **Mobil**: Använd "Lägg till på hemskärm" i webbläsaren
- **Desktop**: Klicka på installationsikonen i adressfältet

## Utveckling

### Projektstruktur

```
app/
├── app/                 # Next.js App Router
│   ├── globals.css     # Globala stilar
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Huvudsida
│   └── offline/        # Offline-sida
├── components/         # React komponenter
│   ├── ui/            # shadcn/ui komponenter
│   ├── barcode-scanner.tsx
│   ├── price-results.tsx
│   └── ...
├── hooks/             # Custom React hooks
├── lib/               # Utilities och konfiguration
└── public/            # Statiska filer och PWA assets
```

### Viktiga komponenter

- `barcode-scanner.tsx`: Hanterar kamerascanning
- `price-results.tsx`: Visar prisjämförelse
- `scan-history.tsx`: Historik över scanningar
- `pwa-install-prompt.tsx`: PWA installationsprompt

## Bidrag

1. Forka projektet
2. Skapa en feature branch (`git checkout -b feature/amazing-feature`)
3. Committa dina ändringar (`git commit -m 'Add amazing feature'`)
4. Pusha till branchen (`git push origin feature/amazing-feature`)
5. Öppna en Pull Request

## Licens

Detta projekt är licensierat under MIT License.
