import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type Cuisine = 'PIZZA' | 'SUSHI' | 'INDIAN' | 'CHINESE' | 'BURGERS' | 'VEGAN' | 'DESSERT' | 'ITALIAN' | 'MEXICAN';

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  cuisine: Cuisine;
  rating: number;
  deliveryFee: number;
  city: string;
}

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private readonly base = '/api/restaurants';

  constructor(private http: HttpClient) {}

  list(opts?: { cuisine?: Cuisine; search?: string; minRating?: number }): Observable<Restaurant[]> {
    let params = new HttpParams();
    if (opts?.cuisine) params = params.set('cuisine', opts.cuisine);
    if (opts?.search) params = params.set('search', opts.search);
    if (opts?.minRating != null) params = params.set('minRating', String(opts.minRating));

    return this.http.get<Restaurant[]>(this.base, { params }).pipe(
      catchError(() => of([])),
      map(restaurants => restaurants.map(r => ({
        ...r,
        imageUrl: r.imageUrl || `https://placehold.co/400x300/ff6b6b/ffffff?text=${encodeURIComponent(r.name)}`
      })))
    );
  }
}
