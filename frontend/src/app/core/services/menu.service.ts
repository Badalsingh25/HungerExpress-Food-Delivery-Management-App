import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface MenuItem { id: number; name: string; description?: string; price: number; imageUrl?: string; available: boolean; }
export interface MenuCategory { id: number; name: string; position: number; items: MenuItem[]; }

@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);
  getMenu(restaurantId: number): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`/api/restaurants/${restaurantId}/menu`).pipe(
      map(categories => categories.map(c => ({
        ...c,
        items: c.items.map(i => ({
          ...i,
          imageUrl: i.imageUrl && i.imageUrl.trim() ? i.imageUrl : `https://placehold.co/300x200/ff6b6b/ffffff?text=${encodeURIComponent(i.name)}`
        }))
      })))
    );
  }
}
