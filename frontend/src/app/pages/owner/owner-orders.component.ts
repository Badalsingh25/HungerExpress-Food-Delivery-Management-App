import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DragDropModule, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface OrderItem{ name: string; qty: number; price: number; }
interface Order{ id: number; status: 'PLACED'|'PREPARING'|'OUT_FOR_DELIVERY'|'DELIVERED'; total: number; items: OrderItem[]; createdAt: string; }

@Component({
  selector: 'app-owner-orders',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatCardModule, MatIconModule, MatChipsModule, MatButtonModule, MatSnackBarModule, RoleNavbarComponent],
  template: `
  <app-role-navbar></app-role-navbar>
  <div class="kb-container theme-indigo">
    <div class="kb-header" style="position: sticky; top: 0; background: var(--brand-bg); z-index: 5;">
      <button mat-button class="kb-back" (click)="back()"><mat-icon>arrow_back</mat-icon>Go Back</button>
      <h2>Kanbanboard</h2>
      <div class="kb-actions">
        <button mat-icon-button (click)="load()" aria-label="Refresh list"><mat-icon>refresh</mat-icon></button>
        <button mat-icon-button (click)="reconnect()" aria-label="Reconnect live updates"><mat-icon>sync</mat-icon></button>
        <button mat-icon-button><mat-icon>group</mat-icon></button>
        <button mat-icon-button><mat-icon>settings</mat-icon></button>
        <button mat-icon-button><mat-icon>add</mat-icon></button>
      </div>
    </div>

    <div class="kb-columns">
      <!-- Placed -->
      <div class="kb-col">
        <div class="kb-col-head kb-placed">
          <span class="dot" style="background:#ff9800"></span>
          <span>Placed</span>
          <span class="count">{{placed.length}}</span>
          <span class="spacer"></span>
          <button mat-icon-button><mat-icon>push_pin</mat-icon></button>
        </div>
        <div class="kb-col-body" cdkDropList [cdkDropListData]="placed" (cdkDropListDropped)="dropped($event, 'PLACED')">
          <mat-card class="kb-card" *ngFor="let o of placed" cdkDrag>
            <div class="kb-card-title">Order #{{o.id}}</div>
            <div class="kb-card-meta">
              <mat-chip-set>
                <mat-chip appearance="outlined" color="warn">₹{{o.total.toFixed(2)}}</mat-chip>
                <mat-chip appearance="outlined">{{o.createdAt}}</mat-chip>
              </mat-chip-set>
            </div>
            <div class="kb-card-desc">{{ formatItems(o) }}</div>
            <div class="kb-card-footer">
              <div class="avatars">
                <span class="avatar">N</span>
              </div>
              <div class="id">ID-{{o.id}}</div>
              <button mat-icon-button cdkDragHandle aria-label="Drag"><mat-icon>drag_indicator</mat-icon></button>
            </div>
          </mat-card>
        </div>
      </div>

      <!-- Preparing -->
      <div class="kb-col">
        <div class="kb-col-head kb-prep">
          <span class="dot" style="background:#2196f3"></span>
          <span>Preparing</span>
          <span class="count">{{preparing.length}}</span>
          <span class="spacer"></span>
          <button mat-icon-button><mat-icon>push_pin</mat-icon></button>
        </div>
        <div class="kb-col-body" cdkDropList [cdkDropListData]="preparing" (cdkDropListDropped)="dropped($event, 'PREPARING')">
          <mat-card class="kb-card" *ngFor="let o of preparing" cdkDrag>
            <div class="kb-card-title">Order #{{o.id}}</div>
            <div class="kb-card-meta">
              <mat-chip-set>
                <mat-chip appearance="outlined" color="primary">₹{{o.total.toFixed(2)}}</mat-chip>
                <mat-chip appearance="outlined">{{o.createdAt}}</mat-chip>
              </mat-chip-set>
            </div>
            <div class="kb-card-desc">{{ formatItems(o) }}</div>
            <div class="kb-card-footer">
              <div class="avatars">
                <span class="avatar">R</span>
                <span class="avatar">D</span>
              </div>
              <div class="id">ID-{{o.id}}</div>
              <button mat-icon-button cdkDragHandle aria-label="Drag"><mat-icon>drag_indicator</mat-icon></button>
            </div>
          </mat-card>
        </div>
      </div>

      <!-- Out for delivery -->
      <div class="kb-col">
        <div class="kb-col-head kb-out">
          <span class="dot" style="background:#8e24aa"></span>
          <span>Out for delivery</span>
          <span class="count">{{outFor.length}}</span>
          <span class="spacer"></span>
          <button mat-icon-button><mat-icon>push_pin</mat-icon></button>
        </div>
        <div class="kb-col-body" cdkDropList [cdkDropListData]="outFor" (cdkDropListDropped)="dropped($event, 'OUT_FOR_DELIVERY')">
          <mat-card class="kb-card" *ngFor="let o of outFor" cdkDrag>
            <div class="kb-card-title">Order #{{o.id}}</div>
            <div class="kb-card-meta">
              <mat-chip-set>
                <mat-chip appearance="outlined" color="accent">₹{{o.total.toFixed(2)}}</mat-chip>
                <mat-chip appearance="outlined">{{o.createdAt}}</mat-chip>
              </mat-chip-set>
            </div>
            <div class="kb-card-desc">{{ formatItems(o) }}</div>
            <div class="kb-card-footer">
              <div class="avatars">
                <span class="avatar">A</span>
                <span class="avatar">B</span>
              </div>
              <div class="id">ID-{{o.id}}</div>
              <button mat-icon-button cdkDragHandle aria-label="Drag"><mat-icon>drag_indicator</mat-icon></button>
            </div>
          </mat-card>
        </div>
      </div>

      <!-- Delivered -->
      <div class="kb-col">
        <div class="kb-col-head kb-done">
          <span class="dot" style="background:#43a047"></span>
          <span>Delivered</span>
          <span class="count">{{delivered.length}}</span>
          <span class="spacer"></span>
          <button mat-icon-button><mat-icon>push_pin</mat-icon></button>
        </div>
        <div class="kb-col-body" cdkDropList [cdkDropListData]="delivered" (cdkDropListDropped)="dropped($event, 'DELIVERED')">
          <mat-card class="kb-card" *ngFor="let o of delivered" cdkDrag>
            <div class="kb-card-title">Order #{{o.id}}</div>
            <div class="kb-card-meta">
              <mat-chip-set>
                <mat-chip appearance="outlined" color="primary">₹{{o.total.toFixed(2)}}</mat-chip>
                <mat-chip appearance="outlined">{{o.createdAt}}</mat-chip>
              </mat-chip-set>
            </div>
            <div class="kb-card-desc">{{ formatItems(o) }}</div>
            <div class="kb-card-footer">
              <div class="avatars">
                <span class="avatar">C</span>
              </div>
              <div class="id">ID-{{o.id}}</div>
              <button mat-icon-button cdkDragHandle aria-label="Drag"><mat-icon>drag_indicator</mat-icon></button>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .kb-container{max-width:1300px;margin:20px auto;padding:0 16px}
    .kb-header{display:flex;align-items:center;gap:12px;position:sticky;top:8px;background:var(--brand-bg);z-index:5;padding:8px 0}
    .kb-header h2{flex:1;margin:0}
    .kb-actions{display:flex;gap:6px}
    .kb-columns{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:12px}
    .kb-col{background:var(--c-muted-100);border:1px solid var(--c-muted-200);border-radius:12px;display:flex;flex-direction:column;height:70vh}
    .kb-col-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--c-muted-200);font-weight:700}
    .kb-prep{border-top:4px solid var(--c-primary);border-radius:12px 12px 0 0}
    .kb-out{border-top:4px solid color-mix(in srgb, var(--c-primary) 70%, #0000);border-radius:12px 12px 0 0}
    .kb-done{border-top:4px solid color-mix(in srgb, var(--c-primary) 45%, #00ff66 55%);border-radius:12px 12px 0 0}
    .dot{width:10px;height:10px;border-radius:50%}
    .count{background:var(--c-accent);color:var(--c-primary);border-radius:999px;padding:0 8px;font-size:12px}
    .spacer{flex:1}
    .kb-col-body{padding:12px;display:flex;flex-direction:column;gap:10px;overflow:auto}
    .kb-card{border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,.06);}
    .kb-card-title{font-weight:700}
    .kb-card-meta{margin:6px 0}
    .kb-card-desc{font-size:12px;color:#555}
    .kb-card-footer{display:flex;justify-content:space-between;align-items:center;margin-top:8px}
    .avatars{display:flex}
    .avatar{width:24px;height:24px;border-radius:50%;background:#eee;display:inline-flex;align-items:center;justify-content:center;margin-left:-6px;border:2px solid #fff;font-size:12px}
    @media (max-width: 1024px){ .kb-columns{grid-template-columns:1fr} .kb-col{height:auto} }
  `]
})
export class OwnerOrdersComponent implements OnInit {
  placed: Order[] = [];
  preparing: Order[] = [];
  outFor: Order[] = [];
  delivered: Order[] = [];
  private es?: EventSource;
  private snack = inject(MatSnackBar);
  private router = inject(Router);
  private auth = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private pollTimer?: any;
  private backoffMs = 1000;
  private readonly maxBackoffMs = 30000;
  private apiReady = false;
  private notifiedDown = false;

  constructor(private http: HttpClient){ }

  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuth();
    }
  }

  private checkAuth(){
    // Probe once; if unauthorized/offline, avoid spamming failing requests
    console.log('[Orders] Checking authentication...');
    this.auth.me().subscribe({
      next: (user) => { 
        console.log('[Orders] Auth successful, user:', user);
        this.apiReady = true; 
        
        // Small delay to ensure token is fully ready
        setTimeout(() => {
          console.log('[Orders] Loading orders...');
          this.load(); 
          this.connect();
        }, 100);
      },
      error: (err) => {
        console.error('[Orders] Auth failed:', err);
        this.apiReady = false;
        this.snack.open('⚠️ Backend unavailable - Please check your connection and try again.', 'OK', { duration: 5000 });
      }
    });
  }

  private connect(){
    if (!isPlatformBrowser(this.platformId) || !this.apiReady) return;
    this.es?.close();
    const t = this.auth.token;
    const url = t ? `/api/owner/orders/stream?token=${encodeURIComponent(t)}` : '/api/owner/orders/stream';
    
    try {
      this.es = new EventSource(url);
      this.es.onopen = () => {
        // Connected: stop polling and reset backoff
        if (this.pollTimer) { clearInterval(this.pollTimer); this.pollTimer = undefined; }
        this.backoffMs = 1000;
        this.notifiedDown = false;
        console.log('[Orders] SSE connected successfully');
      };
      this.es.addEventListener('orders:update', () => {
        console.log('[Orders] SSE update received, reloading orders...');
        this.load();
      });
      this.es.onerror = () => {
        // Close the EventSource and mark backend as unavailable
        this.es?.close();
        this.apiReady = false;
        
        if (!this.notifiedDown){
          this.snack.open('❌ Live updates disconnected - Backend may have stopped', 'Reconnect', { duration: 0 })
            .onAction().subscribe(() => this.reconnect());
          this.notifiedDown = true;
        }
      };
    } catch (err) {
      console.error('[Orders] EventSource failed:', err);
      this.apiReady = false;
      this.snack.open('❌ Cannot connect to live updates - Check backend server', 'Retry', { duration: 0 })
        .onAction().subscribe(() => this.reconnect());
    }
  }

  reconnect(){ 
    // Try to probe auth first before reconnecting
    this.snack.open('Checking backend availability...', undefined, { duration: 2000 });
    this.checkAuth();
  }

  load(){
    if (!isPlatformBrowser(this.platformId) || !this.apiReady) {
      console.log('[Orders] Load skipped - not ready. Browser:', isPlatformBrowser(this.platformId), 'apiReady:', this.apiReady);
      return;
    }
    
    console.log('[Orders] Fetching orders from /api/owner/orders?view=all');
    // Auth interceptor handles the token automatically
    // Use view=all to fetch all orders for owner kanban board
    this.http.get<Order[]>('/api/owner/orders?view=all').subscribe({
      next: (list) => {
        console.log('[Orders] Received', list.length, 'orders from backend');
        this.placed = list.filter(o => o.status==='PLACED');
        this.preparing = list.filter(o => o.status==='PREPARING');
        this.outFor = list.filter(o => o.status==='OUT_FOR_DELIVERY');
        this.delivered = list.filter(o => o.status==='DELIVERED');
        console.log('[Orders] Filtered - Placed:', this.placed.length, 'Preparing:', this.preparing.length, 'Out:', this.outFor.length, 'Delivered:', this.delivered.length);
        this.notifiedDown = false;
      },
      error: (err) => {
        console.error('[Orders] Failed to load orders:', err);
        this.placed = [];
        this.preparing = [];
        this.outFor = [];
        this.delivered = [];
        if (err?.status === 401 || err?.status === 403){
          // Stop further retries and silence errors when unauthorized
          this.apiReady = false;
          if (this.es) { this.es.close(); this.es = undefined; }
          if (this.pollTimer) { clearInterval(this.pollTimer); this.pollTimer = undefined; }
          if (!this.notifiedDown){
            this.snack.open('🔒 Please login as Owner to view orders', 'Dismiss', { duration: 4000 });
            this.notifiedDown = true;
          }
        } else if (err?.status === 0 || !err?.status) {
          // Backend not running
          this.apiReady = false;
          if (!this.notifiedDown) {
            this.snack.open('⚠️ Backend server not running. Start backend on port 8080', 'Dismiss', { duration: 0 });
            this.notifiedDown = true;
          }
        } else {
          if (!this.notifiedDown) {
            this.snack.open(`Cannot load orders from backend`, 'Dismiss', { duration: 4000 });
            this.notifiedDown = true;
          }
        }
      }
    });
  }

  dropped(ev: CdkDragDrop<Order[]>, status: Order['status']){
    if (ev.previousContainer === ev.container) return;
    const item = ev.previousContainer.data[ev.previousIndex];
    transferArrayItem(ev.previousContainer.data, ev.container.data, ev.previousIndex, ev.currentIndex);
    // Auth interceptor handles the token automatically
    this.http.patch(`/api/orders/${item.id}/status`, null, { params: { status } as any }).subscribe({
      next: () => this.load(),
      error: () => this.snack.open('Failed to update status', 'Dismiss', { duration: 3000 })
    });
  }
  formatItems(o: Order){ return (o.items||[]).map(i => `${i.name}×${i.qty}`).join(', '); }
  ngOnDestroy(){ if (this.es) this.es.close(); if (this.pollTimer) clearInterval(this.pollTimer); }
  back(){ this.router.navigateByUrl('/owner/dashboard'); }

  private startPolling(){
    if (this.pollTimer || !this.apiReady) return;
    this.pollTimer = setInterval(() => this.load(), 5000);
  }
  private scheduleReconnect(){
    const wait = this.backoffMs;
    this.backoffMs = Math.min(this.backoffMs * 2, this.maxBackoffMs);
    setTimeout(() => { if (this.apiReady) this.connect(); }, wait);
  }

}
