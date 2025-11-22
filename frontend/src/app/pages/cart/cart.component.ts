import { Component } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart.service';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, MatCardModule, MatButtonModule, MatIconModule, RoleNavbarComponent],
  template: `
    <app-role-navbar></app-role-navbar>
    <div style="max-width:1120px;margin:24px auto;padding:0 24px;display:grid;grid-template-columns:minmax(620px,1.8fr) minmax(360px,1fr);gap:24px;justify-content:center;background:linear-gradient(180deg,#fff,#f5f6f8)">
      <!-- Left: orders list with red + dark-white theme -->
      <mat-card style="background:#f7f8fb;border:1px solid #e8eaf0">
        <h2 style="color:#b71c1c;margin:0 0 8px">Your Order</h2>
        <div *ngFor="let it of cart.items" (click)="goCheckout()" style="display:flex;align-items:center;gap:12px;border:1px solid #eceff1;border-radius:12px;padding:12px;margin:8px 0;cursor:pointer;background:#ffffff;box-shadow:0 1px 2px rgba(183,28,28,.06)">
          <img [src]="it.imageUrl" alt="" style="width:56px;height:56px;object-fit:cover;border-radius:10px" />
          <div style="flex:1">
            <div style="font-weight:700;color:#1f2937">{{ it.name }}</div>
            <div style="color:#546e7a">{{ it.price | currency:'INR':'symbol' }}</div>
          </div>
          <button mat-mini-fab color="primary" (click)="cart.dec(it.id); $event.stopPropagation();"><mat-icon>remove</mat-icon></button>
          <div style="width:32px;text-align:center;color:#1f2937">{{ it.qty }}</div>
          <button mat-mini-fab color="primary" (click)="cart.inc(it.id); $event.stopPropagation();"><mat-icon>add</mat-icon></button>
          <button mat-icon-button color="warn" (click)="cart.remove(it.id); $event.stopPropagation();"><mat-icon>delete</mat-icon></button>
        </div>
        <div *ngIf="cart.items.length === 0" style="padding:24px;text-align:center;color:#777">Your cart is empty.</div>

        <!-- Checkout section below items -->
        <div style="border-top:1px dashed #e0e0e0;margin-top:12px;padding-top:12px">
          <div style="display:flex;justify-content:space-between;color:#37474f"><span>Items</span><span>{{ cart.totalQty() }}</span></div>
          <div style="display:flex;justify-content:space-between"><span style="color:#37474f">Subtotal</span><span style="color:#263238">{{ cart.subtotal() | currency:'INR':'symbol' }}</span></div>
          <button mat-flat-button color="warn" style="width:100%;margin-top:12px;background:#e53935;color:#fff" [disabled]="cart.items.length===0" (click)="goCheckout()">Checkout</button>
        </div>
      </mat-card>

      <!-- Right: compact summary -->
      <mat-card style="background:#fff;border:1px solid #e8eaf0">
        <h3 style="color:#263238">Summary</h3>
        <div style="display:flex;justify-content:space-between"><span>Items</span><span>{{ cart.totalQty() }}</span></div>
        <div style="display:flex;justify-content:space-between"><span>Subtotal</span><span>{{ cart.subtotal() | currency:'INR':'symbol' }}</span></div>
        <div style="display:flex;justify-content:space-between"><span>Delivery</span><span>₹0.00</span></div>
        <div style="display:flex;justify-content:space-between;font-weight:700;margin-top:8px"><span>Total</span><span>{{ cart.subtotal() | currency:'INR':'symbol' }}</span></div>
        <button mat-stroked-button style="width:100%;margin-top:8px;border-color:#e53935;color:#e53935" (click)="cart.clear()" [disabled]="cart.items.length===0">Clear Cart</button>
      </mat-card>
    </div>
  `
})
export class CartComponent {
  constructor(public cart: CartService, private router: Router) {}
  goCheckout(){ if (this.cart.items.length) this.router.navigate(['/checkout']); }
}
