import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  id: number;
  userId: number;
  menuItemId?: number;
  restaurantId?: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private http: HttpClient) {}

  listForItem(menuItemId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`/api/reviews/menu/${menuItemId}`);
    }

  createForItem(menuItemId: number, rating: number, comment?: string): Observable<Review> {
    return this.http.post<Review>(`/api/reviews/menu/${menuItemId}`, { rating, comment });
  }
}
