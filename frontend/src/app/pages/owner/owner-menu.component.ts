import { Component, inject, PLATFORM_ID, Inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface Category { id: number; name: string; position: number; items?: MenuItem[]; }
interface MenuItem { 
  id: number; 
  name: string; 
  description?: string; 
  price: number; 
  imageUrl?: string; 
  available: boolean; 
  category?: { id: number }; 
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  submittedAt?: string;
}

@Component({
  selector: 'app-owner-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule, DragDropModule, MatSnackBarModule, MatChipsModule, MatSlideToggleModule, MatCheckboxModule, RouterLink, RoleNavbarComponent],
  template: `
  <app-role-navbar></app-role-navbar>
  <div class="menu-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <mat-icon class="title-icon">restaurant_menu</mat-icon>
            Menu Management
          </h1>
          <p class="page-subtitle">Manage your restaurant menu, categories, and items</p>
        </div>
        <mat-form-field appearance="outline" class="restaurant-select" *ngIf="restaurants.length > 0">
          <mat-label>Select Restaurant</mat-label>
          <mat-select [(ngModel)]="rid" (selectionChange)="refresh()">
            <mat-option *ngFor="let r of restaurants" [value]="r.id">
              <mat-icon>store</mat-icon>
              {{ r.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <div *ngIf="loadingRestaurants" style="background:#fff;padding:12px 24px;border-radius:8px;color:#666">
          <mat-icon style="animation:spin 1s linear infinite">refresh</mat-icon>
          Loading restaurants...
        </div>
        <div *ngIf="!loadingRestaurants && restaurants.length === 0" style="background:#fff;padding:12px 24px;border-radius:8px;color:#d97706">
          <mat-icon>info</mat-icon>
          No restaurants found. Please add a restaurant first.
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="stat-card">
        <mat-icon class="stat-icon categories">category</mat-icon>
        <div class="stat-content">
          <div class="stat-value">{{ cats.length }}</div>
          <div class="stat-label">Categories</div>
        </div>
      </div>
      <div class="stat-card">
        <mat-icon class="stat-icon items">fastfood</mat-icon>
        <div class="stat-content">
          <div class="stat-value">{{ items.length }}</div>
          <div class="stat-label">Menu Items</div>
        </div>
      </div>
      <div class="stat-card">
        <mat-icon class="stat-icon active">check_circle</mat-icon>
        <div class="stat-content">
          <div class="stat-value">{{ availableItemsCount }}</div>
          <div class="stat-label">Available</div>
        </div>
      </div>
      <div class="stat-card">
        <mat-icon class="stat-icon orders">receipt_long</mat-icon>
        <div class="stat-content">
          <div class="stat-value">{{ recentOrders.length }}</div>
          <div class="stat-label">Recent Orders</div>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="content-grid">
    <!-- Categories Sidebar -->
    <div class="sidebar">
      <mat-card class="section-card">
        <div class="section-header">
          <div class="section-title">
            <mat-icon>category</mat-icon>
            <h3>Categories</h3>
          </div>
          <button mat-raised-button color="primary" (click)="addCategory()">
            <mat-icon>add</mat-icon>
            Add Category
          </button>
        </div>
        <div cdkDropList (cdkDropListDropped)="reorder($event)">
          <div *ngFor="let c of cats; let i=index" cdkDrag style="display:flex;align-items:center;gap:8px;padding:6px;border:1px solid #eee;border-radius:8px;margin-bottom:6px">
            <mat-icon cdkDragHandle>drag_indicator</mat-icon>
            <input [(ngModel)]="c.name" placeholder="Name" style="flex:1;border:none;border-bottom:1px dashed #ccc;outline:none" />
            <button mat-icon-button color="primary" (click)="saveCategory(c)"><mat-icon>save</mat-icon></button>
            <button mat-icon-button color="warn" (click)="deleteCategory(c)"><mat-icon>delete</mat-icon></button>
          </div>
        </div>
      </mat-card>
    </div>

    <!-- Items Section -->
    <div class="main-content">
      <mat-card class="section-card">
        <div class="section-header">
          <div class="section-title">
            <mat-icon>fastfood</mat-icon>
            <h3>Menu Items</h3>
            <span class="item-count">{{ items.length }} items</span>
          </div>
          <button mat-raised-button color="primary" (click)="addItem()">
            <mat-icon>add</mat-icon>
            Add Item
          </button>
        </div>
        <div class="toolbar" style="display:flex;gap:8px;align-items:center;margin-bottom:16px">
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>Search</mat-label>
            <input matInput [(ngModel)]="searchQuery">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="selectedCategory">
              <mat-option [value]="null">All</mat-option>
              <mat-option *ngFor="let c of cats" [value]="c.id">{{ c.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-icon-button color="primary" (click)="toggleBulkMode()">
            <mat-icon>{{ bulkMode ? 'close' : 'check_box' }}</mat-icon>
          </button>
        </div>
        <div class="bulk-actions" *ngIf="bulkMode" style="display:flex;gap:8px;align-items:center;margin-bottom:16px">
          <button mat-icon-button color="primary" (click)="selectAll()">
            <mat-icon>check_box</mat-icon>
          </button>
          <button mat-icon-button (click)="deselectAll()">
            <mat-icon>check_box_outline_blank</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="bulkDelete()">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
        <div class="item-grid">
          <div *ngFor="let m of filteredItems" class="item-card" [class.pending]="m.approvalStatus==='PENDING'" [class.rejected]="m.approvalStatus==='REJECTED'">
            <mat-checkbox *ngIf="bulkMode" 
                          class="item-checkbox"
                          [checked]="isItemSelected(m.id)"
                          (change)="toggleItemSelection(m.id)"
                          (click)="$event.stopPropagation()">
            </mat-checkbox>
            <div class="approval-badge" *ngIf="m.approvalStatus">
              <mat-chip [class]="'status-' + (m.approvalStatus || '').toLowerCase()">
                <mat-icon>{{getStatusIcon(m.approvalStatus)}}</mat-icon>
                {{m.approvalStatus}}
              </mat-chip>
            </div>
            <div class="img-wrap">
              <img *ngIf="m.imageUrl" [src]="m.imageUrl" alt="img" (error)="onImgError($event)" />
            </div>
            <div class="rejection-msg" *ngIf="m.approvalStatus==='REJECTED' && m.rejectionReason">
              <mat-icon>warning</mat-icon>
              <span>{{m.rejectionReason}}</span>
            </div>
            <div class="fields">
              <mat-form-field appearance="outline">
                <mat-label>Name</mat-label>
                <input matInput [(ngModel)]="m.name" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Description</mat-label>
                <input matInput [(ngModel)]="m.description" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Price</mat-label>
                <input matInput type="number" [(ngModel)]="m.price" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select [(value)]="m.category!.id">
                  <mat-option [value]="c.id" *ngFor="let c of cats">{{ c.name }}</mat-option>
                </mat-select>
              </mat-form-field>
              <div class="inline">
                <mat-slide-toggle [(ngModel)]="m.available">Available</mat-slide-toggle>
              </div>
              <div>
                <input type="file" (change)="upload($event, m)" />
                <mat-progress-bar *ngIf="uploadingId===m.id" mode="indeterminate"></mat-progress-bar>
              </div>
              <div class="actions">
                <button mat-stroked-button color="primary" (click)="saveItem(m)" [disabled]="!isDirty(m)">Save</button>
                <button mat-stroked-button color="warn" (click)="deleteItem(m)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </mat-card>

      <!-- Recent Orders -->
      <mat-card class="section-card orders-section">
        <div class="section-header">
          <div class="section-title">
            <mat-icon>receipt_long</mat-icon>
            <h3>Recent Orders</h3>
            <span class="item-count">Last 6 orders</span>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <mat-chip-listbox [multiple]="false" (selectionChange)="onStatusChange($event)">
              <mat-chip-option [selected]="!orderStatus" (click)="setStatus(undefined)">All</mat-chip-option>
              <mat-chip-option [selected]="orderStatus==='PLACED'" (click)="setStatus('PLACED')">Placed</mat-chip-option>
              <mat-chip-option [selected]="orderStatus==='PREPARING'" (click)="setStatus('PREPARING')">Preparing</mat-chip-option>
              <mat-chip-option [selected]="orderStatus==='OUT_FOR_DELIVERY'" (click)="setStatus('OUT_FOR_DELIVERY')">Out</mat-chip-option>
              <mat-chip-option [selected]="orderStatus==='DELIVERED'" (click)="setStatus('DELIVERED')">Delivered</mat-chip-option>
            </mat-chip-listbox>
            <button mat-button color="primary" [routerLink]="['/owner/orders']" [queryParams]="{ rid }"><mat-icon>open_in_new</mat-icon>View All</button>
          </div>
        </div>
        <div *ngIf="loadingOrders">
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        </div>
        <div class="orders-list" *ngIf="!loadingOrders && recentOrders.length; else noOrders">
          <div class="order-row" *ngFor="let o of recentOrders">
            <div class="left">
              <div class="oid">#{{o.id}}</div>
              <div class="osub">{{ o.createdAt | date:'short' }}</div>
            </div>
            <div class="mid">{{ summarize(o) }}</div>
            <div class="right">
              <mat-chip class="st" [ngClass]="o.status.toLowerCase()">{{ o.status }}</mat-chip>
              <strong>₹{{ o.total | number:'1.0-0' }}</strong>
            </div>
          </div>
        </div>
        <ng-template #noOrders>
          <div style="padding:12px;color:#6b7280">No recent orders for this restaurant.</div>
        </ng-template>
      </mat-card>
    </div>
    </div>
  </div>
  `
  ,styles:[`
    /* Container */
    .menu-container{max-width:1400px;margin:0 auto;padding:20px;background:#f8f9fa}
    
    /* Header */
    .page-header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 10px 40px rgba(102,126,234,0.2)}
    .header-content{display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap}
    .header-left{flex:1;min-width:300px}
    .page-title{font-size:32px;font-weight:700;color:#fff;margin:0;display:flex;align-items:center;gap:12px}
    .title-icon{font-size:36px;width:36px;height:36px}
    .page-subtitle{color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:16px}
    .restaurant-select{min-width:280px;background:#fff;border-radius:8px}
    .restaurant-select mat-option{display:flex;align-items:center;gap:8px}
    
    /* Quick Stats */
    .quick-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px}
    .stat-card{background:#fff;border-radius:12px;padding:20px;display:flex;align-items:center;gap:16px;box-shadow:0 4px 12px rgba(0,0,0,0.08);transition:transform .2s,box-shadow .2s;cursor:pointer}
    .stat-card:hover{transform:translateY(-4px);box-shadow:0 8px 20px rgba(0,0,0,0.12)}
    .stat-icon{font-size:40px;width:40px;height:40px;border-radius:12px;padding:16px;display:flex;align-items:center;justify-content:center}
    .stat-icon.categories{background:#e0f2fe;color:#0284c7}
    .stat-icon.items{background:#fef3c7;color:#d97706}
    .stat-icon.active{background:#d1fae5;color:#059669}
    .stat-icon.orders{background:#e9d5ff;color:#9333ea}
    .stat-content{flex:1}
    .stat-value{font-size:28px;font-weight:700;color:#1f2937;line-height:1}
    .stat-label{font-size:14px;color:#6b7280;margin-top:4px}
    
    /* Content Grid */
    .content-grid{display:grid;grid-template-columns:320px 1fr;gap:20px;align-items:start}
    @media (max-width:1024px){.content-grid{grid-template-columns:1fr}}
    
    /* Section Cards */
    .section-card{background:#fff;border-radius:12px;padding:24px;box-shadow:0 4px 12px rgba(0,0,0,0.08);margin-bottom:20px}
    .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #f3f4f6}
    .section-title{display:flex;align-items:center;gap:12px;flex:1}
    .section-title mat-icon{font-size:24px;width:24px;height:24px;color:#667eea}
    .section-title h3{margin:0;font-size:20px;font-weight:700;color:#1f2937}
    .item-count{background:#f3f4f6;padding:4px 12px;border-radius:20px;font-size:13px;color:#6b7280;font-weight:500}
    
    /* Sidebar */
    .sidebar{position:sticky;top:20px}
    
    /* Item Grid */
    .item-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
    .item-card{border:2px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.06);position:relative;transition:transform .2s,box-shadow .2s,border-color .2s}
    .item-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.12);border-color:#667eea}
    .item-card.pending{border-color:#f59e0b;background:#fffbeb}
    .item-card.rejected{border-color:#ef4444;background:#fef2f2}
    
    /* Approval Badge */
    .approval-badge{position:absolute;top:12px;right:12px;z-index:10}
    .approval-badge .status-pending{background:#fef3c7;color:#92400e;font-weight:600}
    .approval-badge .status-approved{background:#d1fae5;color:#065f46;font-weight:600}
    .approval-badge .status-rejected{background:#fee2e2;color:#991b1b;font-weight:600}
    .approval-badge mat-icon{font-size:18px;width:18px;height:18px;margin-right:4px}
    
    /* Rejection Message */
    .rejection-msg{background:#fee2e2;border:1px solid #fecaca;padding:12px;margin:12px;border-radius:8px;display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#991b1b;line-height:1.5}
    .rejection-msg mat-icon{font-size:18px;width:18px;height:18px;flex-shrink:0}
    
    /* Image Wrap */
    .img-wrap{height:160px;background:linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%);display:grid;place-items:center;position:relative}
    .img-wrap img{width:100%;height:100%;object-fit:cover}
    
    /* Fields */
    .fields{display:grid;gap:12px;padding:16px;background:#fafafa;border-top:1px solid #e5e7eb}
    .inline{display:flex;align-items:center;padding:8px 0}
    
    /* Actions */
    .actions{display:flex;justify-content:flex-end;gap:8px;padding-top:8px;border-top:1px solid #e5e7eb;margin-top:8px}
    
    /* Orders Section */
    .orders-section{background:linear-gradient(to bottom,#fff 0%,#fafafa 100%)}
    .orders-list{display:flex;flex-direction:column;gap:12px;margin-top:12px}
    .order-row{display:grid;grid-template-columns:140px 1fr 200px;align-items:center;padding:16px;border:2px solid #e5e7eb;border-radius:12px;background:#fff;transition:transform .2s,box-shadow .2s,border-color .2s}
    .order-row:hover{transform:translateX(4px);box-shadow:0 4px 12px rgba(0,0,0,0.1);border-color:#667eea}
    .order-row .left .oid{font-weight:700;font-size:16px;color:#1f2937}
    .order-row .left .osub{font-size:13px;color:#6b7280;margin-top:4px}
    .order-row .mid{font-size:14px;color:#4b5563;padding:0 16px}
    .order-row .right{display:flex;gap:12px;align-items:center;justify-content:flex-end}
    .order-row .st{background:#eef2ff;color:#3730a3;border:none;font-weight:600;padding:6px 12px;border-radius:6px}
    .order-row .st.preparing{background:#fff7ed;color:#9a3412}
    .order-row .st.out_for_delivery{background:#ecfeff;color:#155e75}
    .order-row .st.delivered{background:#ecfdf5;color:#166534}
    .order-row strong{font-size:18px;color:#1f2937}
    
    /* Animations */
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class OwnerMenuComponent implements OnInit {
  private http = inject(HttpClient);
  private snack = inject(MatSnackBar);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  
  rid = 0; // dynamic via selector
  cats: Category[] = [];
  items: MenuItem[] = [];
  uploadingId?: number;
  restaurants: {id:number,name:string}[] = [];
  loadingRestaurants = true;
  private original = new Map<number, string>();
  recentOrders: { id:number; status:'PLACED'|'PREPARING'|'OUT_FOR_DELIVERY'|'DELIVERED'; total:number; createdAt:string; items:{name:string;qty:number;}[] }[] = [];
  loadingOrders = false;
  orderStatus?: 'PLACED'|'PREPARING'|'OUT_FOR_DELIVERY'|'DELIVERED';
  
  // Search & Filter
  searchQuery = '';
  selectedCategory: number | null = null;
  
  // Bulk Actions
  selectedItems = new Set<number>();
  bulkMode = false;
  
  // Analytics cache
  private _analytics: any = null;
  
  constructor(){}

  ngOnInit(): void {
    // Fetch owner's restaurants from the correct endpoint
    this.loadingRestaurants = true;
    this.http.get<any[]>(`/api/owner/restaurants`).pipe(
      catchError((err) => {
        console.error('[OwnerMenu] Failed to load restaurants:', err);
        this.loadingRestaurants = false;
        this.snack.open('⚠️ Failed to load restaurants. Please check if you have added any restaurants.', undefined, { duration: 3000 });
        return of([]);
      })
    ).subscribe(restaurants => {
      // Defer state updates to next macrotask to avoid NG0100 during hydration/dev-mode double check
      setTimeout(() => {
        this.loadingRestaurants = false;
        this.restaurants = restaurants
          .filter(r => r && r.id)
          .map((r: any) => ({ id: r.id, name: r.name }));
        
        console.log('[OwnerMenu] Loaded restaurants:', this.restaurants);
        
        if (this.restaurants.length > 0) {
          // Try to restore last selected restaurant
          const savedRid = isPlatformBrowser(this.platformId) 
            ? Number(localStorage.getItem('he.owner.lastRid')||'0')
            : 0;
          
          if (savedRid && this.restaurants.some(r => r.id === savedRid)) {
            this.rid = savedRid;
          } else {
            this.rid = this.restaurants[0].id;
          }
          // Defer refresh to next macrotask to avoid ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => this.refresh());
        } else {
          this.snack.open('ℹ️ No restaurants found. Please add a restaurant first.', undefined, { duration: 5000 });
        }
        // Ensure change detection runs after async state changes
        this.cdr.detectChanges();
      }, 0);
    });
  }

  private key(){ return `he.owner.menu.${this.rid}`; }
  private persistLocal(){
    if (!isPlatformBrowser(this.platformId)) return;
    try { localStorage.setItem(this.key(), JSON.stringify({ cats: this.cats, items: this.items })); } catch {}
  }
  private readLocal(){
    if (!isPlatformBrowser(this.platformId)) return {};
    try { return JSON.parse(localStorage.getItem(this.key()) || '{}'); } catch { return {}; }
  }

  refresh(){
    // Use owner-specific endpoint to see ALL items including pending/rejected
    this.http.get<Category[]>(`/api/owner/restaurants/${this.rid}/menu`).pipe(
      catchError(() => {
        const loc = this.readLocal();
        this.cats = loc.cats || [];
        this.items = loc.items || [];
        return of([]);
      })
    ).subscribe(cats => {
      this.cats = cats;
      this.items = cats.flatMap(c => c.items || []).map(i => ({
        ...i,
        category: i.category || { id: 0 }
      }));
      this.persistLocal();
      this.calculateAnalytics(); // Calculate analytics after loading data
      
      // Track originals
      this.items.forEach(m => this.original.set(m.id, JSON.stringify(m)));
      
      // Save restaurant ID to localStorage
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('he.owner.lastRid', String(this.rid));
      }
      
      // Load orders
      this.loadOrders();
    });
  }

  addCategory(){ this.cats.push({ id: 0, name: 'New Category', position: this.cats.length }); this.persistLocal(); }
  saveCategory(c: Category){
    const done = () => { this.snack.open('Category saved', undefined, { duration: 1000 }); this.persistLocal(); this.refresh(); };
    if (c.id){
      this.http.put(`/api/owner/restaurants/${this.rid}/menu/categories/${c.id}`, { name: c.name, position: c.position })
        .pipe(catchError(() => { /* fallback */ return of(null).pipe(tap(()=>{})); }))
        .subscribe(done);
    } else {
      this.http.post<Category>(`/api/owner/restaurants/${this.rid}/menu/categories`, { name: c.name, position: c.position })
        .pipe(catchError(() => { c.id = Date.now(); return of(c as any); }))
        .subscribe(done);
    }
  }
  deleteCategory(c: Category){
    if (!confirm('Delete this category and its items?')) return;
    this.cats = this.cats.filter(x => x !== c);
    this.items = this.items.filter(i => i.category?.id !== c.id);
    this.persistLocal();
    this.http.delete(`/api/owner/restaurants/${this.rid}/menu/categories/${c.id}`)
      .pipe(catchError(() => of(null)))
      .subscribe(() => { this.snack.open('Category deleted', undefined, { duration: 1000 }); this.refresh(); });
  }
  reorder(ev: CdkDragDrop<Category[]>) { moveItemInArray(this.cats, ev.previousIndex, ev.currentIndex); this.cats.forEach((c,i)=>c.position=i); this.persistLocal(); }

  addItem(){ 
    this.items.push({ id: 0, name: 'New Item', description: '', price: 0, available: true, category: { id: this.cats[0]?.id } }); 
    this.persistLocal(); 
    this._analytics = null; // Force analytics recalculation
  }
  saveItem(m: MenuItem){
    const payload = { ...m } as any; if (!payload.category?.id) delete payload.category;
    const done = (result: any) => { 
      if (result?.approvalStatus === 'PENDING') {
        this.snack.open('✅ Item submitted for admin approval', undefined, { duration: 3000, panelClass:'snack-success' }); 
      } else {
        this.snack.open('✅ Item saved successfully', undefined, { duration: 1200, panelClass:'snack-success' }); 
      }
      this.persistLocal(); 
      this.calculateAnalytics(); // Recalculate analytics after saving item
      this.refresh(); 
    };
    if (m.id){
      this.http.put(`/api/owner/restaurants/${this.rid}/menu/items/${m.id}`, payload)
        .pipe(catchError((err) => { 
          console.error('[Menu] Error saving item:', err); // Log error
          if (err?.status === 0) {
            this.snack.open('⚠️ Backend not running - Saved locally only', undefined, { duration: 2000, panelClass:'snack-error' });
          } else {
            const msg = err?.error?.message || err?.message || 'Unknown error';
            this.snack.open(`❌ Failed to save item: ${msg}`, undefined, { duration: 3000, panelClass:'snack-error' });
          }
          return of(null);
        }))
        .subscribe(result => { if (result) done(result); });
    } else {
      this.http.post<MenuItem>(`/api/owner/restaurants/${this.rid}/menu/items`, payload)
        .pipe(catchError((err) => { 
          console.error('[Menu] Error creating item:', err); // Log error
          if (err?.status === 0) {
            this.snack.open('⚠️ Backend not running - Saved locally only', undefined, { duration: 2000 }); 
            m.id = Date.now(); 
            return of(m as any);
          } else {
            const msg = err?.error?.message || err?.message || 'Unknown error';
            this.snack.open(`❌ Failed to create item: ${msg}`, undefined, { duration: 3000, panelClass:'snack-error' });
            return of(null);
          }
        }))
        .subscribe(result => { if (result) done(result); });
    }
  }
  deleteItem(m: MenuItem){
    if (!confirm('Delete this item?')) return;
    this.items = this.items.filter(x => x !== m);
    this.persistLocal();
    this._analytics = null; // Force analytics recalculation
    this.http.delete(`/api/owner/restaurants/${this.rid}/menu/items/${m.id}`)
      .pipe(catchError(() => of(null)))
      .subscribe(() => { 
        this.snack.open('Item deleted', undefined, { duration: 1000 }); 
        this.calculateAnalytics(); // Recalculate analytics
        this.refresh(); 
      });
  }

  upload(ev: any, m: MenuItem){
    const f = ev.target.files?.[0]; if (!f) return;
    const form = new FormData(); form.append('file', f);
    this.uploadingId = m.id;
    this.http.post<{url:string}>(`/api/media/upload`, form).subscribe({
      next: res => { 
        // Wrap in setTimeout to avoid change detection errors
        setTimeout(() => {
          m.imageUrl = res.url; 
          this.uploadingId = undefined; 
          this.persistLocal(); 
          this.snack.open('Image uploaded', undefined, { duration: 1000, panelClass:'snack-success' });
          this.cdr.detectChanges();
        }, 0);
      },
      error: () => { 
        // Fallback: convert to data URL for local storage
        const reader = new FileReader();
        reader.onload = (e) => {
          setTimeout(() => {
            m.imageUrl = e.target?.result as string;
            this.uploadingId = undefined;
            this.persistLocal();
            this.snack.open('Image saved locally (no backend)', undefined, { duration: 2000, panelClass:'snack-success' });
            this.cdr.detectChanges();
          }, 0);
        };
        reader.onerror = () => {
          setTimeout(() => {
            this.uploadingId = undefined;
            this.snack.open('Upload failed - file read error', undefined, { duration: 1500, panelClass:'snack-error' });
            this.cdr.detectChanges();
          }, 0);
        };
        reader.readAsDataURL(f);
      }
    });
  }

  isDirty(m: MenuItem){ if (m.id===0) return true; return this.original.get(m.id)!==this.clean(m); }
  private clean(m: MenuItem){ const o:any = { id:m.id, name:m.name, description:m.description, price:m.price, imageUrl:m.imageUrl, cat:m.category?.id }; return JSON.stringify(o); }
  onImgError(e: Event){ (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Image'; }

  private loadOrders(){
    this.loadingOrders = true;
    const url = this.orderStatus
      ? `/api/owner/restaurants/${this.rid}/orders?status=${this.orderStatus}`
      : `/api/owner/restaurants/${this.rid}/orders`;
    this.http.get<any[]>(url).pipe(
      catchError(() => of([]))
    ).subscribe(list => {
      this.recentOrders = (list||[]).slice(0,6);
      this.loadingOrders = false;
      // Trigger change detection outside current cycle
      setTimeout(() => this.cdr.detectChanges(), 0);
    });
  }
  setStatus(s: 'PLACED'|'PREPARING'|'OUT_FOR_DELIVERY'|'DELIVERED'|undefined){ this.orderStatus = s; this.loadOrders(); }
  onStatusChange(_e: any) { /* handled by chip click */ }
  summarize(o: any){
    const parts = (o.items||[]).slice(0,2).map((it:any)=>`${it.qty}x ${it.name}`);
    const more = (o.items?.length||0) > 2 ? ` +${o.items.length-2} more` : '';
    return parts.join(', ') + more;
  }

  getStatusIcon(status?: string): string {
    switch(status) {
      case 'PENDING': return 'pending';
      case 'APPROVED': return 'check_circle';
      case 'REJECTED': return 'cancel';
      default: return 'help';
    }
  }

  // Computed properties for template
  get availableItemsCount(): number {
    return this.items.filter(i => i.available).length;
  }

  // Search & Filter
  get filteredItems(): MenuItem[] {
    let filtered = this.items;
    
    // Apply search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        (item.description?.toLowerCase() || '').includes(query)
      );
    }
    
    // Apply category filter
    if (this.selectedCategory !== null) {
      filtered = filtered.filter(item => item.category?.id === this.selectedCategory);
    }
    
    return filtered;
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = null;
  }

  // Bulk Actions
  toggleBulkMode() {
    this.bulkMode = !this.bulkMode;
    if (!this.bulkMode) {
      this.selectedItems.clear();
    }
  }

  toggleItemSelection(itemId: number) {
    if (this.selectedItems.has(itemId)) {
      this.selectedItems.delete(itemId);
    } else {
      this.selectedItems.add(itemId);
    }
  }

  isItemSelected(itemId: number): boolean {
    return this.selectedItems.has(itemId);
  }

  selectAll() {
    this.filteredItems.forEach(item => this.selectedItems.add(item.id));
  }

  deselectAll() {
    this.selectedItems.clear();
  }

  bulkSetAvailability(available: boolean) {
    if (this.selectedItems.size === 0) {
      this.snack.open('No items selected', undefined, { duration: 2000 });
      return;
    }

    const selectedCount = this.selectedItems.size;
    this.items.forEach(item => {
      if (this.selectedItems.has(item.id)) {
        item.available = available;
        this.saveItem(item);
      }
    });

    this.snack.open(`${selectedCount} items ${available ? 'enabled' : 'disabled'}`, undefined, { duration: 2000 });
    this.selectedItems.clear();
    this.bulkMode = false;
  }

  bulkDelete() {
    if (this.selectedItems.size === 0) {
      this.snack.open('No items selected', undefined, { duration: 2000 });
      return;
    }

    if (!confirm(`Delete ${this.selectedItems.size} selected items?`)) return;

    const itemsToDelete = this.items.filter(item => this.selectedItems.has(item.id));
    itemsToDelete.forEach(item => this.deleteItem(item));
    
    this.selectedItems.clear();
    this.bulkMode = false;
  }

  // Analytics - call calculateAnalytics() to update
  get analytics() {
    if (!this._analytics) {
      this.calculateAnalytics();
    }
    return this._analytics;
  }
  
  calculateAnalytics() {
    const totalItems = this.items.length;
    const availableItems = this.items.filter(i => i.available).length;
    const unavailableItems = totalItems - availableItems;
    
    // Calculate average price
    const avgPrice = totalItems > 0 
      ? this.items.reduce((sum, item) => sum + item.price, 0) / totalItems 
      : 0;

    // Popular items (from orders)
    const itemRevenue = new Map<number, number>();
    this.recentOrders.forEach(order => {
      order.items?.forEach(orderItem => {
        const menuItem = this.items.find(i => i.name === orderItem.name);
        if (menuItem) {
          const revenue = itemRevenue.get(menuItem.id) || 0;
          itemRevenue.set(menuItem.id, revenue + (menuItem.price * orderItem.qty));
        }
      });
    });

    const topItemsByRevenue = Array.from(itemRevenue.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, revenue]) => ({
        item: this.items.find(i => i.id === id),
        revenue
      }))
      .filter(item => item.item !== undefined);

    this._analytics = {
      totalItems,
      availableItems,
      unavailableItems,
      avgPrice,
      topItemsByRevenue
    };
  }
}
