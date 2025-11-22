import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface Txn { id: string; type: 'ADD'|'DEBIT'; amount: number; note: string; time: string; }

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [NgFor, MatCardModule, MatButtonModule, RoleNavbarComponent],
  template: `
  <app-role-navbar></app-role-navbar>
  <div style="max-width:800px;margin:24px auto;padding:0 16px;display:grid;gap:12px">
    <h2>Wallet</h2>
    <mat-card>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-weight:700">Current Balance</div>
          <div style="font-size:28px">₹{{ balance.toFixed(2) }}</div>
        </div>
        <div>
          <button mat-flat-button color="primary" (click)="add(200)">Add ₹200</button>
          <button mat-stroked-button color="accent" (click)="add(500)" style="margin-left:8px">Add ₹500</button>
        </div>
      </div>
    </mat-card>

    <mat-card>
      <div style="font-weight:700;margin-bottom:8px">Recent Transactions</div>
      <div *ngFor="let t of txns" style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee">
        <span>{{ t.note }} · {{ t.time }}</span>
        <span [style.color]="t.type==='ADD' ? '#16a34a' : '#b91c1c'">{{ t.type==='ADD' ? '+' : '-' }}₹{{ t.amount.toFixed(2) }}</span>
      </div>
    </mat-card>
  </div>
  `
})
export class WalletComponent{
  balance = 0;
  txns: Txn[] = [];
  add(amount: number){
    this.balance += amount;
    this.txns.unshift({ id: Date.now()+'' , type: 'ADD', amount, note: 'Added to wallet', time: new Date().toLocaleString() });
  }
}
