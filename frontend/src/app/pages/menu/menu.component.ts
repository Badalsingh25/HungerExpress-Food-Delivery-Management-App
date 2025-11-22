import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule, NgFor, CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CartService } from '../../core/services/cart.service';
import { MenuCategory, MenuItem, MenuService } from '../../core/services/menu.service';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, MatCardModule, MatButtonModule, MatIconModule, MatListModule, RoleNavbarComponent],
  template: `
  <app-role-navbar></app-role-navbar>
  <div class="theme-blush" style="max-width:1200px;margin:24px auto;padding:0 16px;display:grid;grid-template-columns:260px 1fr;gap:16px;align-items:start">
    <!-- Left: Categories -->
    <div>
      <mat-card>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3 style="margin:8px 0 12px;color:var(--c-primary)">Menu</h3>
        </div>
        <mat-nav-list>
          <a mat-list-item (click)="showOffers()" [style.fontWeight]="mode==='offers' ? 700 : 500" [class.active]="mode==='offers'">
            <mat-icon matListItemIcon>local_offer</mat-icon>
            <span matListItemTitle>Special Offers</span>
          </a>
          <a mat-list-item *ngFor="let c of cats" (click)="setActive(c.id)" [style.fontWeight]="mode==='category' && active===c.id ? 700 : 500" [class.active]="mode==='category' && active===c.id">
            <mat-icon matListItemIcon>restaurant</mat-icon>
            <span matListItemTitle>{{ c.name }}</span>
          </a>
        </mat-nav-list>
      </mat-card>
      <mat-card style="margin-top:12px;text-align:center;position:relative;overflow:hidden">
        <img src="/Burger.jpg" alt="Offer" style="width:100%;opacity:.25;filter:blur(1px)">
        <div style="position:absolute;inset:0;display:grid;place-items:center">
          <div style="background:#fff;padding:12px 16px;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.15);text-align:center">
            <div style="font-weight:800;font-size:16px">Earn 10% Reward Points</div>
            <div style="font-size:12px;color:#555">Use points on future orders</div>
            <button mat-flat-button color="accent" style="margin-top:8px" (click)="showOffers()">View Offer</button>
          </div>
        </div>
      </mat-card>
    </div>

    <!-- Center: Products -->
    <div>
      <h3 class="he-section-title" style="margin:8px 0">{{ title }}</h3>
      
      <!-- Loading State -->
      <div *ngIf="loading" style="text-align:center;padding:48px;color:#666">
        <mat-icon style="font-size:48px;width:48px;height:48px;animation:spin 1s linear infinite">refresh</mat-icon>
        <p style="margin-top:16px">Loading menu...</p>
      </div>
      
      <!-- Error State -->
      <div *ngIf="error && !loading" style="text-align:center;padding:48px;background:#fff3cd;border:1px solid #ffc107;border-radius:8px;color:#856404">
        <mat-icon style="font-size:48px;width:48px;height:48px;color:#ffc107">info</mat-icon>
        <p style="margin-top:16px;font-weight:600">{{ error }}</p>
        <p style="margin-top:8px;font-size:14px">Please select a restaurant and the owner should add menu items first.</p>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="!loading && !error && items.length === 0" style="text-align:center;padding:48px;background:#f9fafb;border-radius:8px;color:#666">
        <mat-icon style="font-size:48px;width:48px;height:48px">restaurant_menu</mat-icon>
        <p style="margin-top:16px;font-weight:600">No menu items available</p>
        <p style="margin-top:8px;font-size:14px">The restaurant owner hasn't added any items yet.</p>
      </div>
      
      <div class="he-menu-grid" *ngIf="!loading && !error && items.length > 0">
          <mat-card *ngFor="let m of items" class="he-menu-card">
          <img mat-card-image [src]="m.imageUrl" [alt]="m.name" (error)="onImgError($event)" />
          <mat-card-content>
            <div style="font-weight:700; display:flex; justify-content:space-between; align-items:center">
              <span>{{ m.name }}</span>
              <span style="color:#2e7d32">{{ m.price | currency:'INR':'symbol' }}</span>
            </div>
            <div style="font-size:12px;color:#666">{{ m.description }}</div>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-stroked-button color="primary" (click)="cart.add({id:m.id,name:m.name,price:m.price,imageUrl:m.imageUrl}); $event.stopPropagation();">
              <mat-icon>add_shopping_cart</mat-icon>&nbsp;Add to cart
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .he-menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }
    /* Ensure category list text is visible */
    mat-nav-list a.mat-mdc-list-item {
      color: #263238 !important;
      --mdc-list-list-item-label-text-color: #263238;
      --mdc-list-list-item-supporting-text-color: #455a64;
      border-radius: 8px;
    }
    mat-nav-list a.mat-mdc-list-item:hover { background: var(--c-accent); }
    mat-nav-list .mat-icon { color: #546e7a !important; }
    /* Ensure MDC inner text is visible even with view encapsulation */
    :host ::ng-deep mat-nav-list {
      --mdc-list-list-item-label-text-color: #263238 !important;
      --mdc-list-list-item-supporting-text-color: #455a64 !important;
    }
    :host ::ng-deep .mat-mdc-list-item .mdc-list-item__primary-text { color: #263238 !important; opacity: 1 !important; }
    :host ::ng-deep mat-nav-list [matListItemTitle] { color: #1b1f23 !important; opacity: 1 !important; }
    :host ::ng-deep .mat-mdc-list-item .mdc-list-item__content { color: #1b1f23 !important; }
    /* Active & focus styles */
    mat-nav-list a.mat-mdc-list-item.active {
      background: var(--c-accent) !important;
      position: relative;
    }
    mat-nav-list a.mat-mdc-list-item.active::before{
      content: '';
      position: absolute;
      left: 0; top: 6px; bottom: 6px;
      width: 3px; border-radius: 2px;
      background: var(--c-primary);
    }
    mat-nav-list a.mat-mdc-list-item:focus-visible{
      outline: 2px solid color-mix(in srgb, var(--c-primary) 60%, transparent);
      outline-offset: 2px;
      border-radius: 8px;
    }
    .he-menu-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .he-menu-card img[mat-card-image] {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (max-width: 959px) {
      :host ::ng-deep div[style*='grid-template-columns:260px 1fr'] {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class MenuComponent{
  mode: 'category'|'offers' = 'category';
  title = 'Featured Products';
  active: number | null = null;
  cats: MenuCategory[] = [];
  items: MenuItem[] = [];
  allItems: MenuItem[] = [];
  loading = false;
  error = '';

  private platformId = inject(PLATFORM_ID);

  constructor(public cart: CartService, private route: ActivatedRoute, private menuSvc: MenuService){
    this.route.queryParamMap.subscribe(params => {
      const rid = Number(params.get('rid') || 0);
      if (rid > 0) {
        this.loadMenu(rid);
      } else {
        this.error = 'Please select a restaurant from the restaurants page.';
      }
    });
  }


  private loadMenu(rid: number){
    this.loading = true;
    this.error = '';
    console.log('Loading menu for restaurant:', rid);
    
    this.menuSvc.getMenu(rid).pipe(
      catchError((err) => {
        console.error('Failed to load menu from API:', err);
        return of([] as MenuCategory[]);
      })
    ).subscribe(list => {
      this.loading = false;
      let categories = list || [];
      // If server returned something, try to override missing/incorrect imageUrls with owner's local snapshot
      try{
        const raw = localStorage.getItem(`he.owner.menu.${rid}`);
        if (raw && categories.length){
          const parsed = JSON.parse(raw||'{}');
          const items: any[] = (parsed?.items||[]) as any[];
          const byId = new Map<number,string>();
          const byName = new Map<string,string>();
          items.forEach(i => {
            const u = (i?.imageUrl ?? i?.imgUrl ?? i?.image ?? i?.imageURL ?? '').toString();
            if (u && u.trim()){
              if (i?.id) byId.set(Number(i.id), u);
              if (i?.name) byName.set(String(i.name).toLowerCase(), u);
            }
          });
          categories.forEach(c => (c.items||[]).forEach(i => {
            const local = byId.get((i as any).id) || byName.get(String(i.name||'').toLowerCase());
            if (local && local.trim()) i.imageUrl = local;
          }));
        }
      }catch{}
      if (!categories.length){
        // Fallback to Owner local storage snapshot written by OwnerMenuComponent
        try{
          const raw = localStorage.getItem(`he.owner.menu.${rid}`);
          if (raw){
            const parsed = JSON.parse(raw);
            categories = (parsed?.cats||[]).map((c: any) => ({ id:c.id, name:c.name, position:c.position, items: [] })) as MenuCategory[];
            const items = (parsed?.items||[]) as any[];
            categories.forEach(c => (c.items = items
              .filter(i => (i?.category?.id ?? i?.categoryId ?? i?.catId) == c.id)
              .map(i => {
                const rawUrl = (i.imageUrl ?? i.imgUrl ?? i.image ?? i.imageURL ?? '').toString();
                const imageUrl = rawUrl.trim() ? rawUrl : `https://placehold.co/300x200/ff6b6b/ffffff?text=${encodeURIComponent(i.name||'Food')}`;
                return { id:Number(i.id||0), name:String(i.name||''), description:i.description, price:Number(i.price||0), imageUrl, available: Boolean(i.available ?? true) };
              }) ));
            // If mapping produced empty lists (e.g., category ids mismatched), push all items into the first category
            const totalItems = categories.reduce((n,c)=> n + (c.items?.length||0), 0);
            if (totalItems === 0 && categories.length){
              const first = categories[0];
              first.items = items.map(i => {
                const rawUrl = (i.imageUrl ?? i.imgUrl ?? i.image ?? i.imageURL ?? '').toString();
                const imageUrl = rawUrl.trim() ? rawUrl : `https://placehold.co/300x200/ff6b6b/ffffff?text=${encodeURIComponent(i.name||'Food')}`;
                return { id:Number(i.id||0), name:String(i.name||''), description:i.description, price:Number(i.price||0), imageUrl, available: Boolean(i.available ?? true) };
              });
            }
          }
        }catch{}
      }
      if (!categories.length){
        // No menu data available
        this.cats = [];
        this.items = [];
        this.allItems = [];
        return;
      }
      // Adopt fetched/fallback categories
      this.cats = categories.sort((a,b)=> (a.position||0)-(b.position||0));
      this.allItems = this.cats.flatMap(c => c.items||[]);
      
      console.log('Menu loaded:', { categories: this.cats.length, totalItems: this.allItems.length });
      
      // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        const first = this.cats[0];
        if (first) {
          this.setActive(first.id);
        } else {
          this.error = 'No menu items available for this restaurant yet.';
        }
      });
    });
  }


  setActive(id: number) {
    this.mode = 'category';
    this.title = this.cats.find(c => c.id === id)?.name || 'Menu';
    this.active = id;
    const category = this.cats.find(c => c.id === id);
    this.items = category ? category.items : [];
  }
  showOffers(){
    this.mode = 'offers';
    this.title = 'Special Offers';
    this.items = [...this.allItems].slice(0, 6);
  }

  onImgError(e: Event) {
    const img = e.target as HTMLImageElement;
    const txt = encodeURIComponent(img.alt || 'Food');
    img.src = `https://placehold.co/400x300/cccccc/333333?text=${txt}`; // neutral placeholder
  }
}
