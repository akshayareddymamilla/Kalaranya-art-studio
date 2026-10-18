export type UserRole = 'customer' | 'admin' | 'studio';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
}

export interface Painting {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  imageUrl: string;
  status: 'available' | 'sold';
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  paintingId: string;
  price: number;
  status: 'placed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  painting: Painting;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Booking {
  id: string;
  userId: string;
  date: string;
  wallSize: number;
  ratePerSqFt: number;
  totalPrice: number;
  address: string;
  status: 'requested' | 'confirmed' | 'declined' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PotteryItem {
  id: string;
  name: string;
}

export interface Glaze {
  id: string;
  name: string;
}

export interface PotteryRequest {
  id: string;
  userId: string;
  itemId: string;
  glazeId: string;
  quantity: number;
  neededByDate: string;
  status: 'requested' | 'accepted' | 'declined' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  item: PotteryItem;
  glaze: Glaze;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
