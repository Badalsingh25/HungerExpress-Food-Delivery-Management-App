import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';
import { AgentService } from '../../core/services/agent.service';

@Component({
  selector: 'app-agent-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    RouterModule,
    RoleNavbarComponent
  ],
  template: `
      <app-role-navbar></app-role-navbar>
      <div class="overview-container">
      <div class="page-header">
        <div>
          <h1><mat-icon>dashboard</mat-icon> Agent Overview</h1>
          <p class="subtitle">Welcome back, {{ stats().agentName }}!</p>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        <p style="text-align: center; margin-top: 16px;">Loading dashboard...</p>
      </div>

      <div *ngIf="!loading" class="content">
        <!-- Status Card with Toggle -->
        <mat-card class="status-card" [class.online]="stats().isAvailable" [class.offline]="!stats().isAvailable">
          <div class="status-content">
            <div class="status-info">
              <div class="status-indicator">
                <div class="status-dot"></div>
                <h2>{{ stats().isAvailable ? 'ONLINE' : 'OFFLINE' }}</h2>
              </div>
              <p>{{ stats().isAvailable ? 'Ready to accept orders' : 'Not accepting orders' }}</p>
            </div>
            <div class="status-actions">
              <mat-slide-toggle 
                [checked]="stats().isAvailable" 
                (change)="toggleAvailability($event.checked)"
                color="primary"
                class="toggle-switch">
              </mat-slide-toggle>
              <button mat-raised-button 
                      [color]="stats().isAvailable ? 'warn' : 'primary'" 
                      (click)="toggleAvailability(!stats().isAvailable)">
                <mat-icon>{{ stats().isAvailable ? 'pause_circle' : 'play_circle' }}</mat-icon>
                {{ stats().isAvailable ? 'Go Offline' : 'Go Online' }}
              </button>
            </div>
          </div>
        </mat-card>

        <!-- Quick Stats -->
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-icon class="stat-icon">delivery_dining</mat-icon>
            <div>
              <h3>Today's Deliveries</h3>
              <p class="stat-value">{{ stats().todayDeliveries }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <mat-icon class="stat-icon">assignment</mat-icon>
            <div>
              <h3>Active Orders</h3>
              <p class="stat-value">{{ stats().activeOrders }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <mat-icon class="stat-icon">check_circle</mat-icon>
            <div>
              <h3>Deliveries Completed</h3>
              <p class="stat-value">{{ stats().totalDeliveries }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <mat-icon class="stat-icon">account_balance_wallet</mat-icon>
            <div>
              <h3>Today's Earnings</h3>
              <p class="stat-value">₹{{ stats().todayEarnings }}</p>
            </div>
          </mat-card>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <button mat-raised-button color="primary" routerLink="/agent/orders">
              <mat-icon>list</mat-icon>
              View Assigned Orders
            </button>
            <button mat-raised-button routerLink="/agent/earnings">
              <mat-icon>account_balance</mat-icon>
              View Earnings
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overview-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
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
      color: #3b82f6;
    }

    .subtitle {
      color: #666;
      margin: 0 0 24px 0;
    }

    .loading {
      margin: 40px 0;
    }

    .status-card {
      padding: 32px !important;
      margin-bottom: 24px;
      border-left: 6px solid;
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
      justify-content: space-between;
      align-items: center;
      gap: 24px;
    }

    .status-info {
      flex: 1;
    }

    .status-actions {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: flex-end;
    }

    .toggle-switch {
      transform: scale(1.5);
    }

    .status-actions button {
      min-width: 150px;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .status-indicator h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }

    .status-card.online h2 {
      color: #059669;
    }

    .status-card.offline h2 {
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
      align-items: center;
      gap: 16px;
      padding: 24px !important;
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }

    .stat-icon {
      font-size: 48px !important;
      width: 48px !important;
      height: 48px !important;
      color: white !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 12px;
    }

    .stat-card h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #666;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      margin: 0;
      color: #1a1a1a;
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
      height: 60px !important;
      font-size: 16px !important;
    }
  `]
})
export class AgentOverviewComponent implements OnInit {
  loading = false;

  constructor(
    public agentService: AgentService,
    private router: Router
  ) {}
  
  // Use shared service for stats
  get stats() {
    return this.agentService.stats;
  }

  ngOnInit() {
    // Stats are already loaded by the service
    this.agentService.refreshStats().subscribe();
  }

  toggleAvailability(newStatus: boolean) {
    this.agentService.toggleAvailability(newStatus).subscribe({
      next: (response) => {
        const status = this.stats().isAvailable ? 'ONLINE ✅' : 'OFFLINE ⭕';
        alert(`You are now ${status}`);
      },
      error: (err) => {
        console.error('Failed to toggle availability:', err);
      }
    });
  }
}
