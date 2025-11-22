import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRestaurants: number;
  pendingApprovals: number;
  revenue: number;
}

interface RecentOrder {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: string;
}

interface RecentUser {
  id: number;
  email: string;
  fullName: string;
  role?: string;
  roles?: { name: string }[];
}

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RoleNavbarComponent],
  template: `
      <app-role-navbar></app-role-navbar>
      <div class="admin-container">
      <div class="header">
        <h1>🎯 Admin Dashboard</h1>
        <p>Welcome to HungerExpress Admin Panel</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <div class="stat-value">{{stats.totalUsers}}</div>
            <div class="stat-label">Total Users</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <div class="stat-value">{{stats.totalOrders}}</div>
            <div class="stat-label">Total Orders</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏪</div>
          <div class="stat-info">
            <div class="stat-value">{{stats.totalRestaurants}}</div>
            <div class="stat-label">Restaurants</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <div class="stat-value">₹{{stats.revenue.toFixed(0)}}</div>
            <div class="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section">
        <h2>⚡ Quick Actions</h2>
        <div class="actions-grid">
          <a routerLink="/admin/users" class="action-card">
            <div class="action-icon">👥</div>
            <div class="action-title">Manage Users</div>
            <div class="action-desc">View and manage user accounts</div>
          </a>
          <div (click)="viewAllOrders()" class="action-card clickable">
            <div class="action-icon">📦</div>
            <div class="action-title">View All Data</div>
            <div class="action-desc">System logs and activity</div>
          </div>
          <a routerLink="/admin/restaurants" class="action-card">
            <div class="action-icon">🏪</div>
            <div class="action-title">Restaurants</div>
            <div class="action-desc">Approve and manage restaurants</div>
          </a>
          <a routerLink="/admin/menu-approvals" class="action-card">
            <div class="action-icon">✅</div>
            <div class="action-title">Menu Approvals</div>
            <div class="action-desc">Approve pending menu items</div>
          </a>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="two-column">
        <div class="section">
          <h2>📦 Recent Orders</h2>
          <div class="list">
            <div *ngFor="let order of recentOrders" class="list-item">
              <div class="list-item-content">
                <div class="list-item-title">Order #{{order.id}}</div>
                <div class="list-item-subtitle">User {{order.userId}} • ₹{{order.total}}</div>
              </div>
              <div class="badge" [class]="'badge-' + order.status.toLowerCase()">
                {{order.status}}
              </div>
            </div>
            <div *ngIf="recentOrders.length === 0" class="empty">No orders yet</div>
          </div>
        </div>

        <div class="section">
          <h2>👥 Recent Users</h2>
          <div class="list">
            <div *ngFor="let user of recentUsers" class="list-item">
              <div class="list-item-content">
                <div class="list-item-title">{{user.fullName || 'No name'}}</div>
                <div class="list-item-subtitle">{{user.email}}</div>
              </div>
              <div class="badge badge-role">
                {{user.role || user.roles?.[0]?.name || 'CUSTOMER'}}
              </div>
            </div>
            <div *ngIf="recentUsers.length === 0" class="empty">No users yet</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
    }

    .header {
      margin-bottom: 32px;
    }

    .header h1 {
      font-size: 36px;
      margin: 0 0 8px 0;
      color: #1f2937;
    }

    .header p {
      color: #6b7280;
      font-size: 16px;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      font-size: 48px;
      line-height: 1;
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      line-height: 1;
    }

    .stat-label {
      font-size: 14px;
      color: #6b7280;
      margin-top: 4px;
    }

    .section {
      margin-bottom: 32px;
    }

    .section h2 {
      font-size: 24px;
      margin: 0 0 16px 0;
      color: #1f2937;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-card {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s;
      cursor: pointer;
    }

    .action-card:hover {
      border-color: #8b5cf6;
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(139, 92, 246, 0.2);
    }

    .action-card.clickable {
      cursor: pointer;
    }

    .action-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }

    .action-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #1f2937;
    }

    .action-desc {
      font-size: 14px;
      color: #6b7280;
    }

    .two-column {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .list {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }

    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #f3f4f6;
    }

    .list-item:last-child {
      border-bottom: none;
    }

    .list-item-content {
      flex: 1;
    }

    .list-item-title {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .list-item-subtitle {
      font-size: 13px;
      color: #6b7280;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-placed { background: #dbeafe; color: #1e40af; }
    .badge-preparing { background: #fef3c7; color: #92400e; }
    .badge-out_for_delivery { background: #e0e7ff; color: #3730a3; }
    .badge-delivered { background: #d1fae5; color: #065f46; }
    .badge-cancelled { background: #fee2e2; color: #991b1b; }
    .badge-role { background: #f3e8ff; color: #6b21a8; }

    .empty {
      padding: 32px;
      text-align: center;
      color: #374151;
      font-weight: 500;
      font-size: 15px;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .two-column {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminHomeComponent implements OnInit {
  stats: Stats = {
    totalUsers: 0,
    totalOrders: 0,
    totalRestaurants: 0,
    pendingApprovals: 0,
    revenue: 0
  };

  recentOrders: RecentOrder[] = [];
  recentUsers: RecentUser[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentOrders();
    this.loadRecentUsers();
  }

  loadStats() {
    // Load users count
    this.http.get<any[]>('/api/admin/users').subscribe({
      next: (users) => this.stats.totalUsers = users.length,
      error: () => this.stats.totalUsers = 0
    });

    // Load orders count and revenue
    this.http.get<RecentOrder[]>('/api/admin/orders').subscribe({
      next: (orders) => {
        this.stats.totalOrders = orders.length;
        this.stats.revenue = orders.reduce((sum, o) => sum + o.total, 0);
      },
      error: () => {
        this.stats.totalOrders = 0;
        this.stats.revenue = 0;
      }
    });

    // Load restaurants count
    this.http.get<any[]>('/api/admin/restaurants').subscribe({
      next: (restaurants) => this.stats.totalRestaurants = restaurants.length,
      error: () => this.stats.totalRestaurants = 0
    });
  }

  loadRecentOrders() {
    this.http.get<RecentOrder[]>('/api/admin/orders').subscribe({
      next: (orders) => {
        this.recentOrders = orders.slice(0, 5);
      },
      error: (err) => {
        console.error('Failed to load recent orders', err);
        this.recentOrders = [];
      }
    });
  }

  loadRecentUsers() {
    this.http.get<RecentUser[]>('/api/admin/users').subscribe({
      next: (users) => {
        this.recentUsers = users.slice(0, 5);
      },
      error: (err) => {
        console.error('Failed to load recent users', err);
        this.recentUsers = [];
      }
    });
  }

  viewAllOrders() {
    alert('System logs and comprehensive data analytics coming soon!');
  }
}
