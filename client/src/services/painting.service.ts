import { request } from './api';
import { Painting, Order } from '../types';

export const paintingService = {
  async getAll(): Promise<Painting[]> {
    return request<Painting[]>('/paintings');
  },

  async getById(id: string): Promise<Painting> {
    return request<Painting>(`/paintings/${id}`);
  },

  async create(data: {
    title: string;
    artist: string;
    description: string;
    price: number;
    imageUrl: string;
  }): Promise<Painting> {
    return request<Painting>('/paintings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Painting>): Promise<Painting> {
    return request<Painting>(`/paintings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async purchase(paintingId: string): Promise<Order> {
    return request<Order>(`/paintings/${paintingId}/orders`, {
      method: 'POST',
    });
  },

  async getOrders(): Promise<Order[]> {
    return request<Order[]>('/orders');
  },

  async cancelOrder(orderId: string): Promise<Order> {
    return request<Order>(`/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  },
};
