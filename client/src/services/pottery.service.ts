import { request } from './api';
import { PotteryItem, Glaze, PotteryRequest } from '../types';

export interface PotteryOptions {
  items: PotteryItem[];
  glazes: Glaze[];
}

export const potteryService = {
  async getOptions(): Promise<PotteryOptions> {
    return request<PotteryOptions>('/pottery/options');
  },

  async getAll(): Promise<PotteryRequest[]> {
    return request<PotteryRequest[]>('/pottery/requests');
  },

  async getById(id: string): Promise<PotteryRequest> {
    return request<PotteryRequest>(`/pottery/requests/${id}`);
  },

  async create(data: {
    itemId: string;
    glazeId: string;
    quantity: number;
    neededByDate: string;
    notes?: string;
  }): Promise<PotteryRequest> {
    return request<PotteryRequest>('/pottery/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: Partial<{
      itemId: string;
      glazeId: string;
      quantity: number;
      neededByDate: string;
      notes?: string;
    }>
  ): Promise<PotteryRequest> {
    return request<PotteryRequest>(`/pottery/requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async accept(id: string): Promise<PotteryRequest> {
    return request<PotteryRequest>(`/pottery/requests/${id}/accept`, {
      method: 'POST',
    });
  },

  async decline(id: string): Promise<PotteryRequest> {
    return request<PotteryRequest>(`/pottery/requests/${id}/decline`, {
      method: 'POST',
    });
  },

  async cancel(id: string): Promise<PotteryRequest> {
    return request<PotteryRequest>(`/pottery/requests/${id}/cancel`, {
      method: 'POST',
    });
  },
};
