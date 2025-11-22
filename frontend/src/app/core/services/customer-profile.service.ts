import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerProfile {
  id: number;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  profilePictureUrl?: string;
  profileCompleted: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  profilePictureUrl?: string;
}

export interface OrderHistory {
  orderId: number;
  restaurantId: number;
  status: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  itemCount: number;
  createdAt: string;
  formattedDate: string;
  placedAt?: string;
  preparingAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface OrderTracking {
  orderId: number;
  status: string;
  total: number;
  createdAt: string;
  placedAt?: string;
  preparingAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  shipName?: string;
  shipPhone?: string;
  shipLine1?: string;
  shipCity?: string;
  shipState?: string;
  shipPostal?: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CustomerProfileService {
  private readonly BASE_URL = '/api/customer/profile';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>(this.BASE_URL);
  }

  updateProfile(request: UpdateProfileRequest): Observable<CustomerProfile> {
    return this.http.put<CustomerProfile>(this.BASE_URL, request);
  }

  getOrderHistory(): Observable<OrderHistory[]> {
    return this.http.get<OrderHistory[]>(`${this.BASE_URL}/orders`);
  }

  getOrderTracking(orderId: number): Observable<OrderTracking> {
    return this.http.get<OrderTracking>(`${this.BASE_URL}/orders/${orderId}`);
  }
}
