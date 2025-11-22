import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { CartItem } from './cart.service';

export type OrderStatus = 'PLACED'|'ACCEPTED'|'PREPARING'|'OUT_FOR_DELIVERY'|'DELIVERED'|'CANCELLED';
export interface OrderItem { id:number; name:string; qty:number; price:number; }
export interface Order {
  id:number;
  items: OrderItem[];
  total:number;
  createdAt:number; // epoch ms
  status: OrderStatus;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/orders';
  private storageKey = 'he_orders';

  list(): Observable<Order[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(orders => {
        console.log('✅ API returned', orders.length, 'orders');
        const mapped = orders.map(o => this.mapFromApi(o));
        // Sort by createdAt DESC (newest first) before saving
        mapped.sort((a, b) => b.createdAt - a.createdAt);
        // Replace localStorage with fresh API data
        this.save(mapped);
        console.log('📦 Saved to localStorage:', mapped.length, 'orders');
        return mapped;
      }),
      catchError((err) => {
        console.warn('⚠️ API failed, using localStorage fallback:', err.status || err.message);
        // Fallback to localStorage if API fails
        const local = this.load().sort((a,b)=>b.createdAt-a.createdAt).map(o=>this.withComputed(o));
        console.log('📦 Loaded from localStorage:', local.length, 'orders');
        return of(local);
      })
    );
  }

  get(id: number): Observable<Order | null> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(o => {
        const mapped = this.mapFromApi(o);
        // Update in localStorage
        const orders = this.load();
        const idx = orders.findIndex(ord => ord.id === id);
        if (idx >= 0) {
          orders[idx] = mapped;
        } else {
          orders.push(mapped);
        }
        this.save(orders);
        return mapped;
      }),
      catchError((err) => {
        console.warn('⚠️ API failed for order #' + id + ', using localStorage');
        const o = this.load().find(o=>o.id===id);
        if (o) {
          return of(this.withComputed(o));
        }
        console.error('❌ Order #' + id + ' not found');
        return of(null);
      })
    );
  }

  createFromCart(items: CartItem[], total: number, address?: any, couponCode?: string, providerOrderId?: string): Observable<Order> {
    const payload = {
      address: address || null,
      couponCode: couponCode || null,
      providerOrderId: providerOrderId || null,
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty
      }))
    };
    
    console.log('🛒 Creating order - Payload:', payload);
    
    return this.http.post<any>(this.baseUrl, payload).pipe(
      map(o => {
        console.log('✅ Order created via API:', o);
        const mapped = this.mapFromApi(o);
        // Don't append to localStorage - let list() refresh the full order list
        // This prevents stale data accumulation
        return mapped;
      }),
      catchError((err) => {
        console.error('❌ Failed to create order via API:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error,
          url: err.url
        });
        console.warn('📦 Creating order in localStorage as fallback');
        // Fallback: create order in localStorage
        const orders = this.load();
        const id = (orders.at(-1)?.id || 1000) + 1;
        const order: Order = {
          id,
          total,
          status: 'PLACED',
          createdAt: Date.now(),
          items: items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price }))
        };
        orders.push(order);
        this.save(orders);
        console.log('✅ Order saved to localStorage:', order);
        return of(order);
      })
    );
  }

  cancel(id: number): Observable<Order | null> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/cancel`, {}).pipe(
      map(o => this.mapFromApi(o)),
      tap(order => {
        // Update localStorage
        const orders = this.load();
        const idx = orders.findIndex(o => o.id === id);
        if (idx >= 0) {
          orders[idx] = order;
          this.save(orders);
        }
      }),
      catchError(() => {
        // Fallback: update in localStorage
        const orders = this.load();
        const o = orders.find(o=>o.id===id);
        if (o && (o.status==='PLACED' || o.status==='PREPARING')){
          o.status='CANCELLED';
          this.save(orders);
          return of(o);
        }
        return of(null);
      })
    );
  }

  updateStatus(id: number, status: OrderStatus): Observable<Order | null> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/status?status=${status}`, {}).pipe(
      map(o => this.mapFromApi(o)),
      catchError(() => of(null))
    );
  }

  // Compute status progression based on time since creation
  private withComputed(o: Order): Order {
    if (o.status==='CANCELLED' || o.status==='DELIVERED') return o;
    const mins = (Date.now() - o.createdAt) / 60000;
    let s: OrderStatus = 'PLACED';
    if (mins >= 1) s = 'PREPARING';
    if (mins >= 3) s = 'OUT_FOR_DELIVERY';
    if (mins >= 6) s = 'DELIVERED';
    if (o.status !== s){ o = { ...o, status: s }; this.update(o); }
    return o;
  }

  private update(o: Order){
    const orders = this.load();
    const idx = orders.findIndex(x=>x.id===o.id);
    if (idx>=0){ orders[idx] = o; this.save(orders); }
  }

  private mapFromApi(apiOrder: any): Order {
    if (!apiOrder) {
      throw new Error('API returned null or undefined order');
    }
    
    // Handle both 'items' and 'orderItems' from API
    const itemsArray = apiOrder.items || apiOrder.orderItems || [];
    
    // Handle different createdAt formats: epoch ms (number) or ISO string
    let createdAtMs: number;
    if (typeof apiOrder.createdAt === 'number') {
      createdAtMs = apiOrder.createdAt;
    } else if (typeof apiOrder.createdAt === 'string') {
      createdAtMs = new Date(apiOrder.createdAt).getTime();
    } else {
      createdAtMs = Date.now();
    }
    
    return {
      id: apiOrder.id,
      total: apiOrder.total || apiOrder.totalAmount || 0,
      status: this.mapStatus(apiOrder.status),
      createdAt: createdAtMs,
      items: itemsArray.map((i: any) => ({
        id: i.id || i.menuItemId,
        name: i.name || i.itemName || i.menuItemName || 'Unknown Item',
        qty: i.qty || i.quantity || 1,
        price: i.price || i.unitPrice || 0
      }))
    };
  }

  private mapStatus(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'PLACED': 'PLACED',
      'ACCEPTED': 'ACCEPTED',
      'PREPARING': 'PREPARING',
      'OUT_FOR_DELIVERY': 'OUT_FOR_DELIVERY',
      'DELIVERED': 'DELIVERED',
      'CANCELLED': 'CANCELLED'
    };
    return statusMap[status] || 'PLACED';
  }

  // Check if error is due to backend being unreachable
  private isBackendDown(err: any): boolean {
    return err.status === 0 || err.status === 504 || err.status === 502;
  }

  private load(): Order[] { try { return JSON.parse(localStorage.getItem(this.storageKey) || '[]'); } catch { return []; } }
  private save(v: Order[]){ try { localStorage.setItem(this.storageKey, JSON.stringify(v)); } catch {} }
}
