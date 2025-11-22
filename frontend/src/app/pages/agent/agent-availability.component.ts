import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface AvailabilityStatus {
  isAvailable: boolean;
  lastStatusChange: string;
  todayOnlineHours: number;
  todayDeliveries: number;
}

@Component({
  selector: 'app-agent-availability',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    RoleNavbarComponent
  ],
  template: `
      <app-role-navbar></app-role-navbar>
      <div class="availability-container">
      <div class="page-header">
        <h1><mat-icon>schedule</mat-icon> Availability Management</h1>
        <p class="subtitle">Control when you're available for deliveries</p>
      </div>

      <div *ngIf="loading" class="loading">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>

      <div *ngIf="!loading" class="content">
        <!-- Main Status Card -->
        <mat-card class="status-card">
          <div class="status-header">
            <div class="status-info">
              <div class="status-badge" [class.online]="status.isAvailable" [class.offline]="!status.isAvailable">
                <div class="status-dot"></div>
                <h2>{{ status.isAvailable ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE' }}</h2>
              </div>
              <p>{{ status.isAvailable ? 'Currently accepting delivery requests' : 'Not accepting delivery requests' }}</p>
            </div>
            <mat-slide-toggle 
              [checked]="status.isAvailable" 
              (change)="toggleAvailability($event.checked)"
              color="primary"
              class="toggle-switch">
            </mat-slide-toggle>
          </div>

          <div class="status-actions">
            <button mat-raised-button 
                    [color]="status.isAvailable ? 'warn' : 'primary'" 
                    (click)="toggleAvailability(!status.isAvailable)">
              <mat-icon>{{ status.isAvailable ? 'pause_circle' : 'play_circle' }}</mat-icon>
              {{ status.isAvailable ? 'Go Offline' : 'Go Online' }}
            </button>
          </div>
        </mat-card>

        <!-- Today's Stats -->
        <div class="stats-section">
          <h2>Today's Activity</h2>
          <div class="stats-grid">
            <mat-card class="stat-card">
              <mat-icon>schedule</mat-icon>
              <div>
                <h3>Hours Online</h3>
                <p class="stat-value">{{ status.todayOnlineHours.toFixed(1) }}h</p>
              </div>
            </mat-card>

            <mat-card class="stat-card">
              <mat-icon>delivery_dining</mat-icon>
              <div>
                <h3>Deliveries Completed</h3>
                <p class="stat-value">{{ status.todayDeliveries }}</p>
              </div>
            </mat-card>

            <mat-card class="stat-card">
              <mat-icon>update</mat-icon>
              <div>
                <h3>Last Status Change</h3>
                <p class="stat-value">{{ formatTime(status.lastStatusChange) }}</p>
              </div>
            </mat-card>
          </div>
        </div>

        <!-- Information -->
        <mat-card class="info-card">
          <h3><mat-icon>info</mat-icon> How It Works</h3>
          <ul>
            <li><strong>Online:</strong> You will receive delivery requests from restaurants near you</li>
            <li><strong>Offline:</strong> No new orders will be assigned to you</li>
            <li><strong>Active Orders:</strong> Complete your active orders before going offline</li>
            <li><strong>Earnings:</strong> You only earn when you're online and completing deliveries</li>
          </ul>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .availability-container {
      max-width: 1000px;
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
      margin: 0 0 32px 0;
    }

    .loading {
      margin: 40px 0;
    }

    .status-card {
      padding: 32px !important;
      margin-bottom: 32px;
    }

    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 24px;
    }

    .status-info {
      flex: 1;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      padding: 16px 24px;
      border-radius: 12px;
      width: fit-content;
    }

    .status-badge.online {
      background: #d1fae5;
    }

    .status-badge.offline {
      background: #fee2e2;
    }

    .status-badge h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }

    .status-badge.online h2 {
      color: #059669;
    }

    .status-badge.offline h2 {
      color: #dc2626;
    }

    .status-dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .status-badge.online .status-dot {
      background: #10b981;
    }

    .status-badge.offline .status-dot {
      background: #ef4444;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .toggle-switch {
      transform: scale(1.5);
    }

    .status-actions {
      display: flex;
      gap: 12px;
    }

    .status-actions button {
      height: 56px !important;
      font-size: 18px !important;
      padding: 0 32px !important;
    }

    .stats-section h2 {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
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

    .info-card {
      padding: 24px !important;
    }

    .info-card h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: #3b82f6;
    }

    .info-card ul {
      margin: 0;
      padding-left: 20px;
    }

    .info-card li {
      margin-bottom: 12px;
      line-height: 1.6;
    }

    .info-card strong {
      color: #1a1a1a;
    }
  `]
})
export class AgentAvailabilityComponent implements OnInit {
  loading = false;
  status: AvailabilityStatus = {
    isAvailable: false,
    lastStatusChange: new Date().toISOString(),
    todayOnlineHours: 0,
    todayDeliveries: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Show page immediately with default data
    this.loadStatus();
  }

  loadStatus() {
    // Load in background without blocking UI
    this.http.get<AvailabilityStatus>('/api/agent/availability').subscribe({
      next: (data) => {
        this.status = data;
        console.log('Availability status loaded from backend');
      },
      error: (err) => {
        console.warn('Backend not available - using default status:', err);
        // Keep default data already displayed
      }
    });
  }

  toggleAvailability(newStatus: boolean) {
    const previousStatus = this.status.isAvailable;
    
    // Optimistic update
    this.status.isAvailable = newStatus;

    this.http.post<{success: boolean, isAvailable: boolean, message: string}>(
      '/api/agent/toggle-availability',
      { isAvailable: newStatus }
    ).subscribe({
      next: (response) => {
        this.status.isAvailable = response.isAvailable;
        this.status.lastStatusChange = new Date().toISOString();
        alert(response.message || `Status changed to ${response.isAvailable ? 'ONLINE' : 'OFFLINE'}`);
      },
      error: (err) => {
        // Revert on error
        this.status.isAvailable = previousStatus;
        console.error('Failed to toggle availability:', err);
        alert('Failed to change status. Backend may not be available.');
      }
    });
  }

  formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
}
