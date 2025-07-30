
declare module 'quagga' {
  interface QuaggaConfig {
    inputStream?: {
      name?: string;
      type?: string;
      target?: HTMLElement | null;
      constraints?: {
        width?: { min?: number; ideal?: number; max?: number };
        height?: { min?: number; ideal?: number; max?: number };
        facingMode?: string;
      };
    };
    decoder?: {
      readers?: string[];
    };
  }

  interface DetectionResult {
    codeResult?: {
      code?: string;
    };
  }

  interface Quagga {
    init(config: QuaggaConfig, callback: (err: any) => void): void;
    start(): void;
    stop(): void;
    onDetected(callback: (data: DetectionResult) => void): void;
    offDetected(): void;
  }

  const quagga: Quagga;
  export default quagga;
}
