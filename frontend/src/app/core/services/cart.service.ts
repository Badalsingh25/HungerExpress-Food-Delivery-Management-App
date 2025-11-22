import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface CartItem {
  id: number;
  name: string;
  price: number; // use deliveryFee or item price when menu items exist
  imageUrl?: string;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items$ = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this._items$.asObservable();

  private useLocal = true; // default to local storage cart (no backend cart API)
  private storageKey = 'he_cart';

  get items(): CartItem[] { return this._items$.value; }
  constructor(private http: HttpClient){
    // Initialize from local storage; switch to server later if needed
    this.setItems(this.loadLocal());
  }

  add(item: Omit<CartItem,'qty'>, qty = 1) {
    if (this.useLocal) {
      const items = this.loadLocal();
      const idx = items.findIndex(i => i.id === item.id);
      if (idx >= 0) items[idx].qty += qty; else items.push({ ...item, qty });
      this.setItems(items);
      return;
    }
    // Use new database cart API
    this.http.post<any>('/api/cart/add', { menuItemId: item.id, quantity: qty })
      .pipe(catchError(() => {
        this.useLocal = true;
        const items = this.loadLocal();
        const idx = items.findIndex(i => i.id === item.id);
        if (idx >= 0) items[idx].qty += qty; else items.push({ ...item, qty });
        this.setItems(items);
        return of(this.items);
      }))
      .subscribe(() => this.refresh());
  }

  inc(id: number) { this.changeQty(id, 1); }
  dec(id: number) { this.changeQty(id, -1); }

  remove(id: number) {
    if (this.useLocal) {
      const items = this.loadLocal().filter(i => i.id !== id);
      this.setItems(items);
      return;
    }
    // Use new database cart API
    this.http.delete(`/api/cart/items/${id}`)
      .pipe(catchError(() => {
        this.useLocal = true;
        const items = this.loadLocal().filter(i => i.id !== id);
        this.setItems(items);
        return of(null);
      }))
      .subscribe(() => this.refresh());
  }

  clear() {
    if (this.useLocal) { this.setItems([]); return; }
    this.http.delete('/api/cart')
      .pipe(catchError(() => { this.useLocal = true; this.setItems([]); return of(null); }))
      .subscribe(() => this.setItems([]));
  }

  totalQty(): number { return this.items.reduce((s, i) => s + i.qty, 0); }
  subtotal(): number { return this.items.reduce((s, i) => s + i.qty * i.price, 0); }

  private changeQty(id: number, delta: number) {
    if (this.useLocal) {
      const items = this.loadLocal();
      const idx = items.findIndex(i => i.id === id);
      if (idx >= 0) {
        items[idx].qty = Math.max(1, items[idx].qty + delta);
      }
      this.setItems(items);
      return;
    }
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.qty + delta);
    this.http.put(`/api/cart/items/${id}`, { quantity: newQty })
      .pipe(catchError(() => {
        this.useLocal = true;
        const items = this.loadLocal();
        const idx = items.findIndex(i => i.id === id);
        if (idx >= 0) items[idx].qty = Math.max(1, items[idx].qty + delta);
        this.setItems(items);
        return of(null);
      }))
      .subscribe(() => this.refresh());
  }

  private refresh(){
    if (this.useLocal) {
      this._items$.next(this.loadLocal());
      return;
    }
    this.http.get<any>('/api/cart')
      .pipe(catchError(() => {
        this.useLocal = true;
        const items = this.loadLocal();
        this._items$.next(items);
        return of({ items: [] });
      }))
      .subscribe(response => {
        const items = (response?.items || []).map((item: any) => ({
          id: item.menuItemId || item.id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          qty: item.quantity || item.qty || 1
        }));
        this._items$.next(items);
      });
  }

  private setItems(items: CartItem[]) {
    this._items$.next(items);
    if (this.useLocal) this.saveLocal(items);
  }
  private loadLocal(): CartItem[] {
    try { return JSON.parse(localStorage.getItem(this.storageKey) || '[]'); } catch { return []; }
  }
  private saveLocal(items: CartItem[]) {
    try { localStorage.setItem(this.storageKey, JSON.stringify(items)); } catch {}
  }
}
