import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface DeliveryStats {
  todayDeliveries: number;
  pendingPickups: number;
  totalEarnings: number;
  todayEarnings: number;
  completedDeliveries: number;
  rating: number;
  totalOrders: number;
}

interface ActiveOrder {
  id: number;
  orderNumber: string;
  restaurantName: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  status: string;
  amount: number;
  distance: string;
  estimatedTime: string;
  items: number;
}

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatBadgeModule,
    RoleNavbarComponent
  ],
  template: `
      <app-role-navbar></app-role-navbar>
      <div class="agent-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <div>
          <h1><mat-icon>delivery_dining</mat-icon> Delivery Agent Dashboard</h1>
          <p class="subtitle">Welcome back, {{ agentName }}!</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="toggleAvailability()">
            <mat-icon>{{ isAvailable ? 'pause_circle' : 'play_circle' }}</mat-icon>
            {{ isAvailable ? 'Go Offline' : 'Go Online' }}
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        <p>Loading dashboard...</p>
      </div>

      <div *ngIf="!loading" class="dashboard-content">
        <!-- Status Card -->
        <mat-card class="status-card" [class.online]="isAvailable" [class.offline]="!isAvailable">
          <div class="status-content">
            <div class="status-badge">
              <div class="status-dot"></div>
              <h3>{{ isAvailable ? 'You are ONLINE' : 'You are OFFLINE' }}</h3>
            </div>
            <p>{{ isAvailable ? 'Ready to accept deliveries' : 'Not accepting deliveries' }}</p>
          </div>
        </mat-card>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-icon>local_shipping</mat-icon>
            <div class="stat-content">
              <h3>Today's Deliveries</h3>
              <p class="stat-value">{{ stats?.todayDeliveries || 0 }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <mat-icon>pending_actions</mat-icon>
            <div class="stat-content">
              <h3>Pending Pickups</h3>
              <p class="stat-value pending">{{ stats?.pendingPickups || 0 }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <mat-icon>account_balance_wallet</mat-icon>
            <div class="stat-content">
              <h3>Today's Earnings</h3>
              <p class="stat-value earnings">₹{{ stats?.todayEarnings || 0 }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <mat-icon>star</mat-icon>
            <div class="stat-content">
              <h3>Your Rating</h3>
              <p class="stat-value rating">{{ stats?.rating || 0 }}/5</p>
            </div>
          </mat-card>
        </div>

        <!-- Active Orders -->
        <mat-card class="active-orders-card">
          <div class="card-header">
            <h2><mat-icon>assignment</mat-icon> Active Orders</h2>
            <button mat-button (click)="refreshOrders()">
              <mat-icon>refresh</mat-icon>
              Refresh
            </button>
          </div>

          <div *ngIf="activeOrders && activeOrders.length > 0" class="orders-list">
            <div *ngFor="let order of activeOrders" class="order-item">
              <div class="order-header">
                <div class="order-info">
                  <h3>#{{ order.orderNumber }}</h3>
                  <mat-chip [class]="'status-' + order.status">{{ order.status }}</mat-chip>
                </div>
                <div class="order-amount">₹{{ order.amount }}</div>
              </div>

              <div class="order-details">
                <div class="detail-row">
                  <mat-icon>restaurant</mat-icon>
                  <div>
                    <strong>{{ order.restaurantName }}</strong>
                    <p>{{ order.items }} items</p>
                  </div>
                </div>

                <div class="detail-row">
                  <mat-icon>person</mat-icon>
                  <div>
                    <strong>{{ order.customerName }}</strong>
                    <p>{{ order.customerPhone }}</p>
                  </div>
                </div>

                <div class="detail-row">
                  <mat-icon>location_on</mat-icon>
                  <div>
                    <p>{{ order.customerAddress }}</p>
                    <span class="distance">{{ order.distance }} • {{ order.estimatedTime }}</span>
                  </div>
                </div>
              </div>

              <div class="order-actions">
                <button *ngIf="order.status === 'ASSIGNED'" mat-raised-button color="primary" (click)="acceptOrder(order)">
                  <mat-icon>check_circle</mat-icon>
                  Accept Order
                </button>
                <button *ngIf="order.status === 'PICKED_UP'" mat-raised-button color="accent" (click)="markDelivered(order)">
                  <mat-icon>done_all</mat-icon>
                  Mark Delivered
                </button>
                <button mat-stroked-button color="primary" (click)="openInGoogleMaps(order)">
                  <mat-icon>navigation</mat-icon>
                  Navigate
                </button>
                <button mat-stroked-button (click)="callCustomer(order)">
                  <mat-icon>phone</mat-icon>
                  Call Customer
                </button>
              </div>
            </div>
          </div>

          <div *ngIf="!activeOrders || activeOrders.length === 0" class="empty-state">
            <mat-icon>inbox</mat-icon>
            <h3>No Active Orders</h3>
            <p>{{ isAvailable ? 'Waiting for new deliveries...' : 'Go online to receive orders' }}</p>
          </div>
        </mat-card>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <button mat-raised-button (click)="viewAllOrders()">
              <mat-icon>list</mat-icon>
              All Orders
            </button>
            <button mat-raised-button (click)="viewEarnings()">
              <mat-icon>account_balance</mat-icon>
              Earnings
            </button>
            <button mat-raised-button (click)="viewProfile()">
              <mat-icon>person</mat-icon>
              Profile
            </button>
          </div>
        </div>

        <!-- Total Earnings Summary -->
        <mat-card class="earnings-card">
          <h2><mat-icon>attach_money</mat-icon> Earnings Summary</h2>
          <div class="earnings-summary">
            <div class="earning-item">
              <span>Total Earnings</span>
              <strong>₹{{ stats?.totalEarnings || 0 }}</strong>
            </div>
            <div class="earning-item">
              <span>Today's Earnings</span>
              <strong class="today">₹{{ stats?.todayEarnings || 0 }}</strong>
            </div>
            <div class="earning-item">
              <span>Total Deliveries</span>
              <strong>{{ stats?.completedDeliveries || 0 }}</strong>
            </div>
            <div class="earning-item">
              <span>Avg per Delivery</span>
              <strong>₹{{ calculateAvgEarnings() }}</strong>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .agent-dashboard {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 700;
    }

    .dashboard-header mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #3b82f6;
    }

    .subtitle {
      color: #666;
      margin: 0;
    }

    .loading {
      text-align: center;
      padding: 60px;
    }

    .status-card {
      padding: 24px !important;
      margin-bottom: 24px;
      border-left: 6px solid;
      transition: all 0.3s;
    }

    .status-card.online {
      border-left-color: #10b981;
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    }

    .status-card.offline {
      border-left-color: #ef4444;
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    }

    .status-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-badge h3 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }

    .status-card.online h3 {
      color: #059669;
    }

    .status-card.offline h3 {
      color: #dc2626;
    }

    .status-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .status-card.online .status-dot {
      background: #10b981;
    }

    .status-card.offline .status-dot {
      background: #ef4444;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      gap: 16px;
      padding: 24px !important;
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }

    .stat-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: white;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 12px;
    }

    .stat-content h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      margin: 0;
      color: #1a1a1a;
    }

    .stat-value.pending {
      color: #f59e0b;
    }

    .stat-value.earnings {
      color: #10b981;
    }

    .stat-value.rating {
      color: #fbbf24;
    }

    .active-orders-card {
      padding: 24px !important;
      margin-bottom: 32px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .card-header h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .order-item {
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      transition: all 0.3s;
    }

    .order-item:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .order-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .order-info h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
    }

    .order-amount {
      font-size: 24px;
      font-weight: 700;
      color: #10b981;
    }

    .order-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .detail-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .detail-row mat-icon {
      color: #6366f1;
      margin-top: 2px;
    }

    .detail-row strong {
      display: block;
      margin-bottom: 4px;
    }

    .detail-row p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .distance {
      font-size: 13px;
      color: #3b82f6;
      font-weight: 500;
    }

    .order-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    mat-chip {
      font-weight: 600 !important;
    }

    .status-ASSIGNED {
      background: #dbeafe !important;
      color: #1e40af !important;
    }

    .status-PICKED_UP {
      background: #fef3c7 !important;
      color: #92400e !important;
    }

    .status-DELIVERED {
      background: #d1fae5 !important;
      color: #065f46 !important;
    }

    .empty-state {
      text-align: center;
      padding: 60px 24px;
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

    .quick-actions {
      margin-bottom: 32px;
    }

    .quick-actions h2 {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .actions-grid button {
      padding: 16px !important;
      height: auto !important;
    }

    .earnings-card {
      padding: 24px !important;
    }

    .earnings-card h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .earnings-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .earning-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .earning-item span {
      font-size: 14px;
      color: #666;
    }

    .earning-item strong {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
    }

    .earning-item strong.today {
      color: #10b981;
    }
  `]
})
export class AgentDashboardComponent implements OnInit {
  loading = false;
  isAvailable = false;
  agentName = 'Agent';
  stats: DeliveryStats | null = null;
  activeOrders: ActiveOrder[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    // Mock data for now
    setTimeout(() => {
      this.agentName = 'Rajesh Kumar';
      this.isAvailable = true;
      this.stats = {
        todayDeliveries: 12,
        pendingPickups: 3,
        totalEarnings: 15840,
        todayEarnings: 840,
        completedDeliveries: 156,
        rating: 4.7,
        totalOrders: 160
      };
      this.activeOrders = [
        {
          id: 1,
          orderNumber: 'ORD001234',
          restaurantName: 'Spice Garden',
          customerName: 'Amit Sharma',
          customerAddress: '123 MG Road, Bangalore',
          customerPhone: '+91 98765 43210',
          status: 'ASSIGNED',
          amount: 450,
          distance: '2.3 km',
          estimatedTime: '15 mins',
          items: 3
        },
        {
          id: 2,
          orderNumber: 'ORD001235',
          restaurantName: 'Pizza Corner',
          customerName: 'Priya Patel',
          customerAddress: '456 Brigade Road, Bangalore',
          customerPhone: '+91 98765 43211',
          status: 'PICKED_UP',
          amount: 680,
          distance: '1.8 km',
          estimatedTime: '10 mins',
          items: 2
        }
      ];
      this.loading = false;
    }, 1000);
  }

  toggleAvailability() {
    this.isAvailable = !this.isAvailable;
    alert(this.isAvailable ? 'You are now ONLINE' : 'You are now OFFLINE');
    // TODO: Call API to update status
  }

  refreshOrders() {
    this.loadDashboard();
  }

  acceptOrder(order: ActiveOrder) {
    // Call API to update order status to OUT_FOR_DELIVERY
    this.http.patch(`/api/orders/${order.id}`, { status: 'OUT_FOR_DELIVERY' }).subscribe({
      next: () => {
        order.status = 'PICKED_UP';
        alert(`Order #${order.orderNumber} accepted! Proceed to pickup from ${order.restaurantName}.`);
        this.loadDashboard(); // Refresh stats
      },
      error: (err) => {
        console.error('Failed to accept order:', err);
        alert('Failed to accept order. Please try again.');
      }
    });
  }

  markDelivered(order: ActiveOrder) {
    const confirmed = confirm(`Mark order #${order.orderNumber} as delivered?`);
    if (confirmed) {
      // Call API to update order status
      this.http.patch(`/api/orders/${order.id}`, { status: 'DELIVERED' }).subscribe({
        next: () => {
          order.status = 'DELIVERED';
          this.activeOrders = this.activeOrders.filter(o => o.id !== order.id);
          alert('Order marked as delivered! ₹' + order.amount + ' collected.');
          this.loadDashboard(); // Refresh stats
        },
        error: (err) => {
          console.error('Failed to mark order as delivered:', err);
          alert('Failed to update order status. Please try again.');
        }
      });
    }
  }

  openInGoogleMaps(order: ActiveOrder) {
    // Open address in Google Maps (works on mobile and desktop)
    const address = encodeURIComponent(order.customerAddress);
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(url, '_blank');
  }

  callCustomer(order: ActiveOrder) {
    // Opens phone dialer on mobile, or shows copy option on desktop
    window.location.href = `tel:${order.customerPhone}`;
  }

  viewAllOrders() {
    this.router.navigate(['/agent/orders']);
  }

  viewEarnings() {
    alert('Earnings page coming soon!');
  }

  viewProfile() {
    this.router.navigate(['/profile']);
  }

  calculateAvgEarnings(): number {
    if (!this.stats || this.stats.completedDeliveries === 0) return 0;
    return Math.round(this.stats.totalEarnings / this.stats.completedDeliveries);
  }
}
