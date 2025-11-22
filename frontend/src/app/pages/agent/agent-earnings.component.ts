import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../core/services/agent.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface EarningsSummary {
  totalEarnings: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  totalDeliveries: number;
  averagePerDelivery: number;
  pendingPayout: number;
  lastPayoutDate: string;
}

interface Transaction {
  id: number;
  date: string;
  orderNumber: string;
  deliveryFee: number;
  bonus: number;
  total: number;
  status: string;
}

@Component({
  selector: 'app-agent-earnings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressBarModule,
    RoleNavbarComponent
  ],
  template: `
      <app-role-navbar></app-role-navbar>
      <div class="earnings-container">
      <div class="page-header">
        <h1><mat-icon>account_balance_wallet</mat-icon> Earnings</h1>
        <p class="subtitle">Track your delivery income</p>
      </div>

      <div *ngIf="loading" class="loading">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>

      <div *ngIf="!loading" class="content">
        <!-- Summary Cards -->
        <div class="summary-grid">
          <mat-card class="summary-card total">
            <mat-icon>account_balance_wallet</mat-icon>
            <div>
              <h3>Total Earnings</h3>
              <p class="value">₹{{ summary.totalEarnings | number:'1.2-2' }}</p>
            </div>
          </mat-card>

          <mat-card class="summary-card today">
            <mat-icon>today</mat-icon>
            <div>
              <h3>Today</h3>
              <p class="value">₹{{ summary.todayEarnings | number:'1.2-2' }}</p>
            </div>
          </mat-card>

          <mat-card class="summary-card week">
            <mat-icon>date_range</mat-icon>
            <div>
              <h3>This Week</h3>
              <p class="value">₹{{ summary.weekEarnings | number:'1.2-2' }}</p>
            </div>
          </mat-card>

          <mat-card class="summary-card month">
            <mat-icon>calendar_today</mat-icon>
            <div>
              <h3>This Month</h3>
              <p class="value">₹{{ summary.monthEarnings | number:'1.2-2' }}</p>
            </div>
          </mat-card>
        </div>

        <!-- Recent Transactions -->
        <mat-card class="transactions-card">
          <h2><mat-icon>receipt</mat-icon> Recent Transactions</h2>
          
          <div class="transactions-table" *ngIf="transactions && transactions.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order</th>
                  <th>Delivery Fee</th>
                  <th>Bonus</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let txn of transactions">
                  <td>{{ formatDate(txn.date) }}</td>
                  <td><strong>#{{ txn.orderNumber }}</strong></td>
                  <td>₹{{ txn.deliveryFee }}</td>
                  <td>₹{{ txn.bonus }}</td>
                  <td class="total">₹{{ txn.total }}</td>
                  <td><span [class]="'status-badge ' + txn.status.toLowerCase()">{{ txn.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="!transactions || transactions.length === 0" class="no-transactions">
            <mat-icon>receipt_long</mat-icon>
            <p>No transactions yet</p>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .earnings-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 700;
    }

    .page-header mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #10b981;
    }

    .subtitle {
      color: #666;
      margin: 0;
    }

    .loading {
      margin: 40px 0;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .summary-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px !important;
      transition: all 0.3s;
    }

    .summary-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }

    .summary-card mat-icon {
      font-size: 48px !important;
      width: 48px !important;
      height: 48px !important;
      padding: 12px;
      border-radius: 12px;
      color: white !important;
    }

    .summary-card.total mat-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .summary-card.today mat-icon {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .summary-card.week mat-icon {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .summary-card.month mat-icon {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    }

    .summary-card h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }

    .value {
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      color: #1a1a1a;
    }

    .payout-card {
      padding: 24px !important;
      margin-bottom: 24px;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px solid #10b981;
    }

    .payout-card h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
      color: #065f46;
    }

    .payout-info {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 24px;
      align-items: center;
    }

    .payout-amount {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .label {
      font-size: 14px;
      color: #059669;
      font-weight: 500;
    }

    .amount {
      font-size: 42px;
      font-weight: 700;
      color: #10b981;
    }

    .payout-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .payout-details p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 14px;
      color: #065f46;
    }

    .payout-details mat-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      color: #10b981 !important;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px !important;
    }

    .stat-card mat-icon {
      font-size: 40px !important;
      width: 40px !important;
      height: 40px !important;
      color: #6366f1;
    }

    .stat-card h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #666;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      color: #1a1a1a;
    }

    .transactions-card {
      padding: 24px !important;
    }

    .transactions-card h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .transactions-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 12px;
      background: #f8fafc;
      font-weight: 600;
      font-size: 13px;
      color: #64748b;
      border-bottom: 2px solid #e2e8f0;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
    }

    tr:hover {
      background: #f8fafc;
    }

    td.total {
      font-weight: 700;
      color: #10b981;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.paid {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .no-transactions {
      text-align: center;
      padding: 60px;
      color: #94a3b8;
    }

    .no-transactions mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .payout-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AgentEarningsComponent implements OnInit {
  loading = false;
  summary: EarningsSummary = {
    totalEarnings: 0,
    todayEarnings: 0,
    weekEarnings: 0,
    monthEarnings: 0,
    totalDeliveries: 0,
    averagePerDelivery: 0,
    pendingPayout: 0,
    lastPayoutDate: ''
  };
  transactions: Transaction[] = [];

  constructor(private agentService: AgentService) {}

  ngOnInit() {
    // Show page immediately with default data
    this.loadEarnings();
  }

  loadEarnings() {
    // Load earnings summary
    this.agentService.getEarnings().subscribe({
      next: (data) => {
        // Map service data to component structure
        this.summary = {
          totalEarnings: data.totalEarnings || 0,
          todayEarnings: data.todayEarnings || 0,
          weekEarnings: data.weekEarnings || 0,
          monthEarnings: data.monthEarnings || 0,
          totalDeliveries: data.totalDeliveries || 0,
          averagePerDelivery: data.averagePerDelivery || 0,
          pendingPayout: data.pendingPayout || 0,
          lastPayoutDate: data.lastPayoutDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        console.log('✅ Earnings summary loaded:', this.summary);
      },
      error: (err) => {
        console.error('❌ Failed to load earnings summary:', err);
      }
    });
    
    // Load real transaction history
    this.agentService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data.map(t => ({
          id: t.id,
          date: t.date,
          orderNumber: t.orderNumber,
          deliveryFee: t.deliveryFee || 0,
          bonus: t.bonus || 0,
          total: t.total || t.totalEarning || 0,
          status: t.status || 'COMPLETED'
        }));
        
        console.log('✅ Transactions loaded:', this.transactions.length);
      },
      error: (err) => {
        console.error('❌ Failed to load transactions:', err);
        this.transactions = [];
      }
    });
  }

  requestPayout() {
    if (this.summary.pendingPayout < 500) {
      alert('Minimum payout amount is ₹500. Current pending: ₹' + this.summary.pendingPayout);
      return;
    }

    const confirmed = confirm(`Request payout of ₹${this.summary.pendingPayout}?\n\nAmount will be transferred to your registered bank account within 2-3 business days.`);
    
    if (confirmed) {
      // TODO: Implement backend API for payout requests
      console.log('Payout requested:', this.summary.pendingPayout);
      alert('✅ Payout request submitted successfully!\n\n' + 
            `Amount: ₹${this.summary.pendingPayout}\n` +
            'Status: Processing\n' +
            'Expected transfer: 2-3 business days');
      
      // Reset pending payout (in real app, backend would handle this)
      this.summary.pendingPayout = 0;
    }
  }

  formatDate(isoString: string): string {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  }
}
