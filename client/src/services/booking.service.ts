import { request } from './api';
import { Booking } from '../types';

export interface BookingAvailability {
  occupiedDates: string[];
  ratePerSqFt: number;
}

export const bookingService = {
  async getAvailability(): Promise<BookingAvailability> {
    return request<BookingAvailability>('/bookings/availability');
  },

  async getAll(): Promise<Booking[]> {
    return request<Booking[]>('/bookings');
  },

  async getById(id: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}`);
  },

  async create(data: { date: string; wallSize: number; address: string }): Promise<Booking> {
    return request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async confirm(id: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/confirm`, {
      method: 'POST',
    });
  },

  async decline(id: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/decline`, {
      method: 'POST',
    });
  },

  async cancel(id: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
  },
};
