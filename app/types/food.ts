export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

export interface RequestCreateFood {
  name: string;
  description: string;
  price: number;
}