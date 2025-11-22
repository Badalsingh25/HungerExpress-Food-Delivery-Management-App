import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService, Order } from '../../core/services/orders.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-track',
  standalone: true,
  imports: [CommonModule, NgFor, MatButtonModule, MatIconModule, RoleNavbarComponent],
  template: `
  <app-role-navbar></app-role-navbar>
  <div style="max-width:900px;margin:32px auto;padding:0 24px">
    <div style="margin-bottom:24px">
      <button mat-icon-button (click)="goBack()" style="margin-right:8px">
        <mat-icon>arrow_back</mat-icon>
      </button>
    </div>
    
    <h1 style="font-size:28px;font-weight:700;margin-bottom:24px;color:#1f2937">Track Order #{{ order?.id || id }}</h1>

    <!-- Loading State -->
    <div *ngIf="loading" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 24px;gap:16px">
      <mat-icon style="font-size:48px;width:48px;height:48px;color:#e53935;animation:spin 1s linear infinite">sync</mat-icon>
      <p style="color:#6b7280;font-size:16px">Loading order details...</p>
    </div>

    <!-- Error State -->
    <div *ngIf="!loading && !order" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 24px;text-align:center;background:#fef2f2;border-radius:12px;border:2px solid #fecaca">
      <mat-icon style="font-size:64px;width:64px;height:64px;color:#ef4444;margin-bottom:16px">error_outline</mat-icon>
      <h3 style="font-size:20px;font-weight:600;color:#374151;margin-bottom:8px">Order Not Found</h3>
      <p style="color:#6b7280;margin-bottom:8px">We couldn't find order #{{ id }}.</p>
      <p style="color:#6b7280;margin-bottom:24px;font-size:14px">This could be because the order ID is invalid or the order hasn't been synced yet.</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
        <button mat-raised-button color="primary" (click)="refresh(true)">
          <mat-icon style="margin-right:4px">refresh</mat-icon>
          Retry
        </button>
        <button mat-stroked-button (click)="goBack()">Back to My Orders</button>
      </div>
    </div>

    <!-- Order Details -->
    <div *ngIf="!loading && order">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
        <div style="font-size:16px">
          <span style="font-weight:600">Status:</span> 
          <span style="color:#e53935;font-weight:700;text-transform:uppercase">{{ order.status.replace('_',' ') }}</span>
        </div>
        <div style="font-size:18px;font-weight:700">
          <span style="color:#666">Total:</span> ₹{{ order.total.toFixed(2) }}
        </div>
      </div>

      <!-- Status Timeline -->
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:32px">
        <div class="step" [class.active]="isAtLeast('PLACED')">
          <div class="step-label">Placed</div>
        </div>
        <div class="step" [class.active]="isAtLeast('ACCEPTED')">
          <div class="step-label">Accepted</div>
        </div>
        <div class="step" [class.active]="isAtLeast('PREPARING')">
          <div class="step-label">Preparing</div>
        </div>
        <div class="step" [class.active]="isAtLeast('OUT_FOR_DELIVERY')">
          <div class="step-label">Out for delivery</div>
        </div>
        <div class="step" [class.active]="isAtLeast('DELIVERED')">
          <div class="step-label">Delivered</div>
        </div>
      </div>

      <!-- Order Items -->
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:24px">
        <h3 style="font-size:18px;font-weight:700;margin-bottom:16px">Items</h3>
        <div *ngFor="let it of order.items" style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f3f4f6;align-items:center">
          <div>
            <div style="font-weight:600;color:#1f2937">{{ it.name }}</div>
            <div style="color:#6b7280;font-size:14px">Quantity: {{ it.qty }}</div>
          </div>
          <div style="font-weight:700;color:#1f2937">₹{{ (it.qty*it.price).toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .step{ 
      text-align:center; 
      padding:16px 12px; 
      border:2px dashed #cbd5e1; 
      border-radius:8px; 
      background:#f9fafb;
      transition: all 0.3s ease;
    }
    .step-label{
      font-size:14px;
      font-weight:500;
      color:#64748b;
    }
    .step.active{ 
      border-color:#e53935; 
      border-style:solid;
      background:#fef2f2; 
    }
    .step.active .step-label{
      color:#b71c1c; 
      font-weight:700;
    }
  `]
})
export class OrderTrackComponent implements OnInit, OnDestroy {
  order?: Order;
  id = 0;
  loading = true;
  private timer?: any;
  private routeSub?: Subscription;
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private orders: OrdersService,
    private cdr: ChangeDetectorRef
  ){}
  
  ngOnInit(){
    this.routeSub = this.route.queryParamMap.subscribe(p => {
      this.id = Number(p.get('id')||'0');
      this.refresh();
      if (this.timer) clearInterval(this.timer);
      // Auto-refresh every 10 seconds
      this.timer = setInterval(() => this.refresh(false), 10000);
    });
  }
  
  ngOnDestroy(){
    if (this.timer) clearInterval(this.timer);
    if (this.routeSub) this.routeSub.unsubscribe();
  }
  
  refresh(showLoader = true){ 
    if (showLoader) this.loading = true;
    if (!this.id || this.id === 0) {
      this.loading = false;
      this.order = undefined;
      return;
    }
    
    this.orders.get(this.id).subscribe({
      next: (order) => {
        this.order = order || undefined;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Failed to load order #' + this.id + ':', err.status || err.message);
        this.loading = false;
        this.order = undefined;
        this.cdr.detectChanges();
      }
    });
  }
  
  isAtLeast(s: Order['status']){
    const order = this.order; if (!order) return false;
    const rank: Record<Order['status'], number> = { PLACED:1, ACCEPTED:2, PREPARING:3, OUT_FOR_DELIVERY:4, DELIVERED:5, CANCELLED:0 } as const;
    return rank[order.status] >= rank[s];
  }
  
  goBack(){
    this.router.navigate(['/user/orders']);
  }
}
