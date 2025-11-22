import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  topItems: Array<{name: string, quantity: number, revenue: number}>;
  revenueByDay: Array<{date: string, revenue: number, orders: number}>;
  customerStats: {
    newCustomers: number;
    returningCustomers: number;
    totalCustomers: number;
  };
}

@Component({
  selector: 'app-owner-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule,
    RoleNavbarComponent
  ],
  template: `
    <app-role-navbar></app-role-navbar>
    <div class="analytics-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1><mat-icon>analytics</mat-icon> Analytics & Reports</h1>
          <p class="subtitle">Track your restaurant performance</p>
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Time Period</mat-label>
          <mat-select [(value)]="selectedPeriod" (selectionChange)="loadAnalytics()">
            <mat-option value="today">Today</mat-option>
            <mat-option value="week">This Week</mat-option>
            <mat-option value="month">This Month</mat-option>
            <mat-option value="year">This Year</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div *ngIf="loading" class="loading">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        <p>Loading analytics...</p>
      </div>

      <div *ngIf="!loading && analytics" class="analytics-content">
        <!-- Key Metrics -->
        <div class="metrics-grid">
          <mat-card class="metric-card revenue">
            <mat-icon>account_balance_wallet</mat-icon>
            <div class="metric-content">
              <h3>Total Revenue</h3>
              <p class="metric-value">₹{{ analytics.totalRevenue | number:'1.2-2' }}</p>
              <span class="metric-change positive">+12.5% from last period</span>
            </div>
          </mat-card>

          <mat-card class="metric-card orders">
            <mat-icon>shopping_bag</mat-icon>
            <div class="metric-content">
              <h3>Total Orders</h3>
              <p class="metric-value">{{ analytics.totalOrders }}</p>
              <span class="metric-change positive">+8.3% from last period</span>
            </div>
          </mat-card>

          <mat-card class="metric-card avg-order">
            <mat-icon>receipt</mat-icon>
            <div class="metric-content">
              <h3>Avg Order Value</h3>
              <p class="metric-value">₹{{ analytics.avgOrderValue | number:'1.2-2' }}</p>
              <span class="metric-change">Same as last period</span>
            </div>
          </mat-card>

          <mat-card class="metric-card pending">
            <mat-icon>pending</mat-icon>
            <div class="metric-content">
              <h3>Pending Orders</h3>
              <p class="metric-value">{{ analytics.pendingOrders }}</p>
              <span class="metric-info">Needs attention</span>
            </div>
          </mat-card>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <!-- Revenue Chart -->
          <mat-card class="chart-card">
            <h2><mat-icon>show_chart</mat-icon> Revenue Trend</h2>
            <div class="chart-area">
              <div class="simple-bar-chart">
                <div *ngFor="let day of analytics.revenueByDay" class="bar-item">
                  <div class="bar" [style.height.%]="(day.revenue / maxRevenue) * 100">
                    <span class="bar-value">₹{{ day.revenue }}</span>
                  </div>
                  <span class="bar-label">{{ day.date }}</span>
                </div>
              </div>
            </div>
          </mat-card>

          <!-- Order Status -->
          <mat-card class="chart-card">
            <h2><mat-icon>pie_chart</mat-icon> Order Status</h2>
            <div class="pie-stats">
              <div class="stat-item completed">
                <div class="stat-bar" [style.width.%]="(analytics.completedOrders / analytics.totalOrders) * 100"></div>
                <span class="stat-label">Completed: {{ analytics.completedOrders }}</span>
              </div>
              <div class="stat-item pending">
                <div class="stat-bar" [style.width.%]="(analytics.pendingOrders / analytics.totalOrders) * 100"></div>
                <span class="stat-label">Pending: {{ analytics.pendingOrders }}</span>
              </div>
              <div class="stat-item cancelled">
                <div class="stat-bar" [style.width.%]="(analytics.cancelledOrders / analytics.totalOrders) * 100"></div>
                <span class="stat-label">Cancelled: {{ analytics.cancelledOrders }}</span>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Top Items -->
        <mat-card class="top-items-card">
          <h2><mat-icon>stars</mat-icon> Top Selling Items</h2>
          <div class="items-list">
            <div *ngFor="let item of analytics.topItems; let i = index" class="item-row">
              <span class="rank">#{{ i + 1 }}</span>
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.quantity }} orders • ₹{{ item.revenue | number:'1.2-2' }} revenue</p>
              </div>
              <div class="item-progress">
                <div class="progress-bar" [style.width.%]="(item.revenue / analytics.topItems[0].revenue) * 100"></div>
              </div>
            </div>
          </div>
        </mat-card>

        <!-- Customer Stats -->
        <mat-card class="customer-stats-card">
          <h2><mat-icon>people</mat-icon> Customer Statistics</h2>
          <div class="customer-grid">
            <div class="customer-stat">
              <mat-icon>person_add</mat-icon>
              <h3>{{ analytics.customerStats.newCustomers }}</h3>
              <p>New Customers</p>
            </div>
            <div class="customer-stat">
              <mat-icon>repeat</mat-icon>
              <h3>{{ analytics.customerStats.returningCustomers }}</h3>
              <p>Returning Customers</p>
            </div>
            <div class="customer-stat">
              <mat-icon>groups</mat-icon>
              <h3>{{ analytics.customerStats.totalCustomers }}</h3>
              <p>Total Customers</p>
            </div>
          </div>
        </mat-card>
      </div>

      <div *ngIf="!loading && !analytics" class="empty-state">
        <mat-icon>analytics</mat-icon>
        <h3>No Analytics Data</h3>
        <p>Start receiving orders to see your analytics</p>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
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
      color: #6366f1;
    }

    .subtitle {
      color: #666;
      margin: 0;
    }

    .loading {
      text-align: center;
      padding: 60px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .metric-card {
      display: flex;
      gap: 16px;
      padding: 24px !important;
    }

    .metric-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: white;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 12px;
    }

    .metric-card.revenue mat-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .metric-card.orders mat-icon {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .metric-card.avg-order mat-icon {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .metric-card.pending mat-icon {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .metric-content h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }

    .metric-value {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: #1a1a1a;
    }

    .metric-change {
      font-size: 13px;
      color: #666;
    }

    .metric-change.positive {
      color: #10b981;
    }

    .metric-info {
      font-size: 13px;
      color: #ef4444;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .chart-card {
      padding: 24px !important;
    }

    .chart-card h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 24px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .simple-bar-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 250px;
      gap: 12px;
    }

    .bar-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .bar {
      width: 100%;
      background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%);
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 20px;
      transition: all 0.3s;
    }

    .bar:hover {
      background: linear-gradient(180deg, #818cf8 0%, #6366f1 100%);
    }

    .bar-value {
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }

    .bar-label {
      font-size: 11px;
      color: #666;
    }

    .pie-stats {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .stat-bar {
      height: 40px;
      border-radius: 8px;
      transition: all 0.3s;
    }

    .stat-item.completed .stat-bar {
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
    }

    .stat-item.pending .stat-bar {
      background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
    }

    .stat-item.cancelled .stat-bar {
      background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }

    .top-items-card {
      padding: 24px !important;
      margin-bottom: 32px;
    }

    .top-items-card h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 24px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .rank {
      font-size: 24px;
      font-weight: 700;
      color: #6366f1;
      min-width: 40px;
    }

    .item-info {
      flex: 1;
    }

    .item-info h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
    }

    .item-info p {
      margin: 0;
      font-size: 13px;
      color: #666;
    }

    .item-progress {
      flex: 1;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
      transition: width 0.5s;
    }

    .customer-stats-card {
      padding: 24px !important;
    }

    .customer-stats-card h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 24px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .customer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 24px;
    }

    .customer-stat {
      text-align: center;
      padding: 24px;
      background: #f8fafc;
      border-radius: 12px;
    }

    .customer-stat mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #6366f1;
      margin-bottom: 12px;
    }

    .customer-stat h3 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 700;
    }

    .customer-stat p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .empty-state {
      text-align: center;
      padding: 80px 24px;
    }

    .empty-state mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #cbd5e1;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      color: #64748b;
    }

    .empty-state p {
      margin: 0;
      color: #94a3b8;
    }
  `]
})
export class OwnerAnalyticsComponent implements OnInit {
  analytics: AnalyticsData | null = null;
  loading = false;
  selectedPeriod = 'week';
  maxRevenue = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading = true;
    // Mock data for now - replace with real API call
    setTimeout(() => {
      this.analytics = {
        totalRevenue: 45280.50,
        totalOrders: 128,
        avgOrderValue: 353.75,
        pendingOrders: 5,
        completedOrders: 115,
        cancelledOrders: 8,
        topItems: [
          { name: 'Chicken Biryani', quantity: 45, revenue: 13500 },
          { name: 'Butter Chicken', quantity: 38, revenue: 11400 },
          { name: 'Paneer Tikka', quantity: 32, revenue: 8960 },
          { name: 'Naan Bread', quantity: 68, revenue: 2040 },
          { name: 'Gulab Jamun', quantity: 28, revenue: 1680 }
        ],
        revenueByDay: [
          { date: 'Mon', revenue: 5200, orders: 15 },
          { date: 'Tue', revenue: 6100, orders: 18 },
          { date: 'Wed', revenue: 5800, orders: 17 },
          { date: 'Thu', revenue: 7200, orders: 22 },
          { date: 'Fri', revenue: 8500, orders: 25 },
          { date: 'Sat', revenue: 9800, orders: 28 },
          { date: 'Sun', revenue: 8200, orders: 24 }
        ],
        customerStats: {
          newCustomers: 42,
          returningCustomers: 86,
          totalCustomers: 128
        }
      };
      this.maxRevenue = Math.max(...this.analytics.revenueByDay.map(d => d.revenue));
      this.loading = false;
    }, 1000);
  }
}
