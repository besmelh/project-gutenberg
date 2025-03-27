

export type Book = {
    id: string;
    text?: string;
    metadata?: Record<string, string>;
    analysis?: Record<string, string>;
    timestamp: number;             
  };
  
