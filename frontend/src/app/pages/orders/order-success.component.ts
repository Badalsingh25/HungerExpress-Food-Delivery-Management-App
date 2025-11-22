import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div style="max-width:720px;margin:48px auto;padding:24px;text-align:center">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:100px;height:100px;background:#e8f5e9;border-radius:50%;margin-bottom:24px">
        <mat-icon style="font-size:64px;width:64px;height:64px;color:#2e7d32">check_circle</mat-icon>
      </div>
      <h1 style="color:#1f2937;margin:0 0 12px;font-size:32px;font-weight:700">Order Placed Successfully!</h1>
      <p style="color:#6b7280;font-size:18px;margin:0 0 8px">Thank you for your order. Your food is being prepared.</p>
      
      <div *ngIf="orderId" style="background:#f3f4f6;border-radius:12px;padding:16px;margin:24px 0;border:2px solid #e5e7eb">
        <div style="color:#6b7280;font-size:14px;margin-bottom:4px">Order Number</div>
        <div style="color:#1f2937;font-size:24px;font-weight:700">#{{ orderId }}</div>
      </div>
      
      <div style="margin:24px 0;color:#6b7280;font-size:16px">
        <div>Amount Paid: <strong style="color:#1f2937">₹{{ (total || 0) | number:'1.0-2' }}</strong></div>
        <div *ngIf="method" style="margin-top:4px">Payment Method: <strong style="color:#1f2937">{{ method }}</strong></div>
      </div>
      
      <div style="margin-top:32px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a *ngIf="orderId" 
           [routerLink]="['/user/orders/track']" 
           [queryParams]="{ id: orderId }" 
           mat-raised-button 
           color="primary"
           style="background:#e53935;color:#fff;padding:12px 32px;font-size:16px;font-weight:600">
          <mat-icon style="margin-right:8px">my_location</mat-icon>
          Track Your Order
        </a>
        <a routerLink="/user/orders" 
           mat-stroked-button 
           style="padding:12px 32px;font-size:16px">
          View All Orders
        </a>
        <a routerLink="/user/dashboard" 
           mat-stroked-button 
           style="padding:12px 32px;font-size:16px">
          Continue Shopping
        </a>
      </div>
      
      <div *ngIf="!orderId" style="margin-top:24px;padding:12px;background:#fff3cd;border-radius:8px;color:#856404">
        <mat-icon style="vertical-align:middle;margin-right:8px">warning</mat-icon>
        Order ID not available. Please check "My Orders" to track your order.
      </div>
    </div>
  `
})
export class OrderSuccessComponent implements OnInit {
  orderId?: number;
  total?: number;
  method?: string;
  paymentId?: string;
  
  ngOnInit() {
    const state = (history && history.state) || {};
    this.orderId = state['orderId'];
    this.total = state['total'];
    this.method = state['method'];
    this.paymentId = state['paymentId'];
  }
}
