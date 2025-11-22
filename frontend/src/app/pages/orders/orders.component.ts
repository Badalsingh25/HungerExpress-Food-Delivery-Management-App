import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrdersService, Order } from '../../core/services/orders.service';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, NgFor, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, RoleNavbarComponent],
  template: `
  <app-role-navbar></app-role-navbar>
  <div style="max-width:900px;margin:32px auto;padding:0 24px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
      <h1 style="font-size:32px;font-weight:700;margin:0;color:#1f2937">My Orders</h1>
      <button mat-raised-button color="primary" (click)="load()">
        <mat-icon>refresh</mat-icon> Refresh
      </button>
    </div>
    
    <div *ngIf="notif" style="background:#e53935;color:#fff;padding:12px 16px;border-radius:8px;margin-bottom:16px;display:flex;align-items:center;gap:8px">
      <mat-icon>error</mat-icon>
      <span>{{ notif }}</span>
    </div>
    
    <!-- Loading State -->
    <div *ngIf="loading" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 24px;gap:16px">
      <mat-icon style="font-size:48px;width:48px;height:48px;color:#e53935;animation:spin 1s linear infinite">sync</mat-icon>
      <p style="color:#6b7280;font-size:16px">Loading your orders...</p>
    </div>
    
    <!-- Empty State -->
    <div *ngIf="!loading && orders.length===0" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 24px;text-align:center;background:#f9fafb;border-radius:12px;border:2px dashed #e5e7eb">
      <mat-icon style="font-size:64px;width:64px;height:64px;color:#d1d5db;margin-bottom:16px">receipt_long</mat-icon>
      <h3 style="font-size:20px;font-weight:600;color:#374151;margin-bottom:8px">No orders yet</h3>
      <p style="color:#6b7280;margin-bottom:24px">When you place an order, it will appear here</p>
      <button mat-raised-button color="primary" onclick="window.location.href='/user/restaurants'">Browse Restaurants</button>
    </div>
    
    <!-- Orders List -->
    <div style="display:grid;gap:20px" *ngIf="!loading && orders.length">
      <div *ngFor="let o of orders" style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.1);transition:all 0.2s;cursor:pointer" (mouseenter)="$any($event.target).style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'" (mouseleave)="$any($event.target).style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
          <div>
            <div style="font-weight:700;font-size:18px;color:#1f2937">Order #{{ o.id }}</div>
            <div style="color:#6b7280;font-size:14px;margin-top:4px">{{ o.createdAt | date:'short' }}</div>
          </div>
          <mat-chip style="background:#4caf50;color:#fff" *ngIf="o.status === 'DELIVERED'">{{ o.status }}</mat-chip>
          <mat-chip style="background:#ff9800;color:#fff" *ngIf="o.status === 'PREPARING'">{{ o.status }}</mat-chip>
          <mat-chip style="background:#2196f3;color:#fff" *ngIf="o.status === 'PLACED'">{{ o.status }}</mat-chip>
          <mat-chip style="background:#9c27b0;color:#fff" *ngIf="o.status === 'OUT_FOR_DELIVERY'">{{ o.status }}</mat-chip>
          <mat-chip style="background:#f44336;color:#fff" *ngIf="o.status === 'CANCELLED'">{{ o.status }}</mat-chip>
        </div>
        
        <div style="margin:12px 0">
          <div *ngFor="let it of o.items" style="padding:8px 0;border-bottom:1px solid #f3f4f6">
            <span style="font-weight:500">{{ it.name }}</span> × {{ it.qty }}
          </div>
        </div>
        
        <div style="display:flex;justify-content:space-between;margin-top:16px;align-items:center">
          <strong style="font-size:18px;color:#1f2937">₹{{ o.total.toFixed(2) }}</strong>
          <button mat-stroked-button color="primary" (click)="track(o.id)" style="font-weight:600">Track</button>
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
  `]
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = true;
  private timer?: any;
  notif = '';
  constructor(private ordersSvc: OrdersService, private router: Router){}
  ngOnInit(){
    // Clear localStorage cache to force fresh fetch from API
    console.log('🗑️ Clearing localStorage orders cache to force fresh data');
    localStorage.removeItem('he_orders');
    this.load();
  }
  ngOnDestroy(){
    if (this.timer) clearInterval(this.timer);
  }
  load(showLoader = true){
    if (showLoader) this.loading = true;
    this.ordersSvc.list().subscribe({
      next: (orders) => {
        this.orders = orders.sort((a, b) => b.createdAt - a.createdAt);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load orders:', err.status || err.message);
        this.loading = false;
        this.notif = 'Failed to load orders. Please refresh the page.';
        setTimeout(() => this.notif = '', 5000);
      }
    });
  }
  canCancel(o: Order){ return o.status==='PLACED' || o.status==='PREPARING'; }
  cancel(id: number){
    this.ordersSvc.cancel(id).subscribe({
      next: () => {
        this.notif = 'Order cancelled successfully';
        this.load();
        setTimeout(() => this.notif = '', 3000);
      },
      error: () => {
        this.notif = 'Failed to cancel order';
        setTimeout(() => this.notif = '', 3000);
      }
    });
  }
  track(id: number){ 
    this.router.navigate(['/user/orders/track'], { queryParams: { id } });
  }
}
