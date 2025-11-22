import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface MenuItemApproval {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restaurantName: string;
  restaurantId: number;
  categoryName: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  submittedByName: string;
  rejectionReason: string;
  available: boolean;
}

interface ApprovalStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalCount: number;
}

@Component({
  selector: 'app-admin-menu-approvals',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RoleNavbarComponent
  ],
  template: `
      <app-role-navbar></app-role-navbar>
      <div class="approvals-container">
      <div class="header">
        <h1>🍽️ Menu Item Approvals</h1>
        <p class="subtitle">Review and approve menu items submitted by restaurant owners</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card pending">
          <mat-icon>pending</mat-icon>
          <div class="stat-content">
            <div class="stat-value">{{stats.pendingCount}}</div>
            <div class="stat-label">Pending Approval</div>
          </div>
        </mat-card>
        <mat-card class="stat-card approved">
          <mat-icon>check_circle</mat-icon>
          <div class="stat-content">
            <div class="stat-value">{{stats.approvedCount}}</div>
            <div class="stat-label">Approved</div>
          </div>
        </mat-card>
        <mat-card class="stat-card rejected">
          <mat-icon>cancel</mat-icon>
          <div class="stat-content">
            <div class="stat-value">{{stats.rejectedCount}}</div>
            <div class="stat-label">Rejected</div>
          </div>
        </mat-card>
        <mat-card class="stat-card total">
          <mat-icon>restaurant_menu</mat-icon>
          <div class="stat-content">
            <div class="stat-value">{{stats.totalCount}}</div>
            <div class="stat-label">Total Items</div>
          </div>
        </mat-card>
      </div>

      <!-- Tabs -->
      <mat-tab-group (selectedIndexChange)="onTabChange($event)">
        <mat-tab label="Pending ({{stats.pendingCount}})">
          <div class="items-grid">
            <mat-card *ngFor="let item of filteredItems" class="item-card">
              <div class="item-header">
                <mat-chip class="status-chip pending">
                  <mat-icon>pending</mat-icon> {{item.approvalStatus}}
                </mat-chip>
                <span class="submitted-time">{{item.submittedAt}}</span>
              </div>

              <div class="item-image">
                <img [src]="getImageUrl(item.imageUrl, item.name)" 
                     [alt]="item.name"
                     (error)="onImageError($event, item)">
              </div>

              <div class="item-details">
                <h3>{{item.name}}</h3>
                <p class="restaurant-name">
                  <mat-icon>store</mat-icon> {{item.restaurantName}}
                </p>
                <p class="description">{{item.description || 'No description provided'}}</p>
                <div class="meta-info">
                  <span class="price">₹{{item.price}}</span>
                  <span class="category">{{item.categoryName}}</span>
                </div>
                <p class="submitted-by">
                  <mat-icon>person</mat-icon> Submitted by: {{item.submittedByName}}
                </p>
              </div>

              <div class="item-actions">
                <button mat-raised-button color="primary" (click)="approveItem(item)">
                  <mat-icon>check</mat-icon> Approve
                </button>
                <button mat-raised-button color="warn" (click)="openRejectDialog(item)">
                  <mat-icon>close</mat-icon> Reject
                </button>
              </div>
            </mat-card>

            <div *ngIf="filteredItems.length === 0" class="empty-state">
              <mat-icon>check_circle</mat-icon>
              <p>No pending approvals</p>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Approved ({{stats.approvedCount}})">
          <div class="items-grid">
            <mat-card *ngFor="let item of filteredItems" class="item-card">
              <div class="item-header">
                <mat-chip class="status-chip approved">
                  <mat-icon>check_circle</mat-icon> {{item.approvalStatus}}
                </mat-chip>
              </div>

              <div class="item-image">
                <img [src]="getImageUrl(item.imageUrl, item.name)" 
                     [alt]="item.name"
                     (error)="onImageError($event, item)">
              </div>

              <div class="item-details">
                <h3>{{item.name}}</h3>
                <p class="restaurant-name">
                  <mat-icon>store</mat-icon> {{item.restaurantName}}
                </p>
                <p class="description">{{item.description}}</p>
                <div class="meta-info">
                  <span class="price">₹{{item.price}}</span>
                  <span class="category">{{item.categoryName}}</span>
                </div>
              </div>
            </mat-card>

            <div *ngIf="filteredItems.length === 0" class="empty-state">
              <mat-icon>info</mat-icon>
              <p>No approved items yet</p>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Rejected ({{stats.rejectedCount}})">
          <div class="items-grid">
            <mat-card *ngFor="let item of filteredItems" class="item-card">
              <div class="item-header">
                <mat-chip class="status-chip rejected">
                  <mat-icon>cancel</mat-icon> {{item.approvalStatus}}
                </mat-chip>
              </div>

              <div class="item-image">
                <img [src]="getImageUrl(item.imageUrl, item.name)" 
                     [alt]="item.name"
                     (error)="onImageError($event, item)">
              </div>

              <div class="item-details">
                <h3>{{item.name}}</h3>
                <p class="restaurant-name">
                  <mat-icon>store</mat-icon> {{item.restaurantName}}
                </p>
                <p class="description">{{item.description}}</p>
                <div class="meta-info">
                  <span class="price">₹{{item.price}}</span>
                  <span class="category">{{item.categoryName}}</span>
                </div>
                <div class="rejection-reason" *ngIf="item.rejectionReason">
                  <mat-icon>warning</mat-icon>
                  <strong>Rejection Reason:</strong> {{item.rejectionReason}}
                </div>
              </div>

              <div class="item-actions">
                <button mat-raised-button color="primary" (click)="approveItem(item)">
                  <mat-icon>check</mat-icon> Approve Now
                </button>
              </div>
            </mat-card>

            <div *ngIf="filteredItems.length === 0" class="empty-state">
              <mat-icon>info</mat-icon>
              <p>No rejected items</p>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .approvals-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px 16px;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .header {
      margin-bottom: 24px;
    }

    .header h1 {
      font-size: 32px;
      margin: 0 0 8px 0;
      color: #1f2937;
    }

    .subtitle {
      color: #6b7280;
      font-size: 14px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      padding: 20px;
      gap: 16px;
    }

    .stat-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .stat-card.pending mat-icon { color: #f59e0b; }
    .stat-card.approved mat-icon { color: #10b981; }
    .stat-card.rejected mat-icon { color: #ef4444; }
    .stat-card.total mat-icon { color: #3b82f6; }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      line-height: 1;
    }

    .stat-label {
      color: #6b7280;
      font-size: 14px;
      margin-top: 4px;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      padding: 20px 0;
    }

    .item-card {
      display: flex;
      flex-direction: column;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .status-chip {
      font-size: 12px;
      height: 28px;
    }

    .status-chip.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-chip.approved {
      background: #d1fae5;
      color: #065f46;
    }

    .status-chip.rejected {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .submitted-time {
      font-size: 12px;
      color: #6b7280;
    }

    .item-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      color: #1f2937;
    }

    .restaurant-name {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #6b7280;
      font-size: 14px;
      margin: 0 0 8px 0;
    }

    .restaurant-name mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .description {
      color: #4b5563;
      font-size: 14px;
      margin: 0 0 12px 0;
      line-height: 1.5;
    }

    .meta-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .price {
      font-size: 20px;
      font-weight: 700;
      color: #059669;
    }

    .category {
      background: #e5e7eb;
      color: #374151;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
    }

    .submitted-by {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #6b7280;
      margin: 0 0 12px 0;
    }

    .submitted-by mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .rejection-reason {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 12px;
      margin-top: 12px;
      display: flex;
      gap: 8px;
      align-items: flex-start;
      font-size: 13px;
    }

    .rejection-reason mat-icon {
      color: #dc2626;
      font-size: 18px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .item-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
      padding-top: 12px;
    }

    .item-actions button {
      flex: 1;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      color: #4b5563;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.4;
      color: #6b7280;
    }

    .empty-state p {
      font-size: 18px;
      font-weight: 500;
      color: #374151;
    }

    /* Darker placeholder text */
    ::ng-deep .mat-mdc-form-field input::placeholder {
      color: #6b7280 !important;
      opacity: 1 !important;
    }
  `]
})
export class AdminMenuApprovalsComponent implements OnInit {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  stats: ApprovalStats = { pendingCount: 0, approvedCount: 0, rejectedCount: 0, totalCount: 0 };
  allItems: MenuItemApproval[] = [];
  filteredItems: MenuItemApproval[] = [];
  currentStatus: string = 'PENDING';

  ngOnInit() {
    this.loadStats();
    this.loadItems('PENDING');
  }

  loadStats() {
    this.http.get<ApprovalStats>('/api/admin/menu-approvals/stats').subscribe({
      next: (stats) => {
        // Use setTimeout to defer the update to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.stats = stats;
        }, 0);
      },
      error: (err) => {
        // Set default stats on error
        setTimeout(() => {
          this.stats = { pendingCount: 0, approvedCount: 0, rejectedCount: 0, totalCount: 0 };
        }, 0);
        if (err?.status === 0) {
          console.warn('Backend not running - using default stats');
        }
      }
    });
  }

  loadItems(status: string) {
    this.currentStatus = status;
    const url = `/api/admin/menu-approvals/all?status=${status}`;
    this.http.get<MenuItemApproval[]>(url).subscribe({
      next: (items) => {
        setTimeout(() => {
          this.allItems = items || [];
          this.filteredItems = items || [];
        }, 0);
      },
      error: (err) => {
        this.allItems = [];
        this.filteredItems = [];
        if (err?.status === 0) {
          alert('⚠️ Backend server not running. Start backend on port 8080');
        } else if (err?.status === 401 || err?.status === 403) {
          alert('🔒 Please login as Admin to view menu approvals');
        } else {
          console.error('Failed to load items:', err);
        }
      }
    });
  }

  onTabChange(index: number) {
    const statuses = ['PENDING', 'APPROVED', 'REJECTED'];
    this.loadItems(statuses[index]);
  }

  approveItem(item: MenuItemApproval) {
    if (!confirm(`Approve "${item.name}" from ${item.restaurantName}?`)) return;

    this.http.post(`/api/admin/menu-approvals/${item.id}/approve`, {}).subscribe({
      next: () => {
        alert('✅ Item approved successfully! Customers can now see this item.');
        this.loadStats();
        this.loadItems(this.currentStatus);
      },
      error: (err) => {
        if (err?.status === 0) {
          alert('❌ Backend server not running. Cannot approve item.');
        } else if (err?.status === 401 || err?.status === 403) {
          alert('❌ Unauthorized. Please login as Admin.');
        } else if (err?.status === 404) {
          alert('❌ Item not found. It may have been deleted.');
          this.loadItems(this.currentStatus);
        } else {
          alert('❌ Failed to approve item. Please try again.');
        }
      }
    });
  }

  openRejectDialog(item: MenuItemApproval) {
    const reason = prompt(`Reject "${item.name}"?\n\nPlease provide a reason for rejection:`);
    if (!reason || reason.trim() === '') {
      if (reason !== null) {
        alert('Please provide a reason for rejection.');
      }
      return;
    }

    this.http.post(`/api/admin/menu-approvals/${item.id}/reject`, { reason: reason.trim() }).subscribe({
      next: () => {
        alert('✅ Item rejected. Owner has been notified with the reason.');
        this.loadStats();
        this.loadItems(this.currentStatus);
      },
      error: (err) => {
        if (err?.status === 0) {
          alert('❌ Backend server not running. Cannot reject item.');
        } else if (err?.status === 401 || err?.status === 403) {
          alert('❌ Unauthorized. Please login as Admin.');
        } else if (err?.status === 404) {
          alert('❌ Item not found. It may have been deleted.');
          this.loadItems(this.currentStatus);
        } else {
          alert('❌ Failed to reject item. Please try again.');
        }
      }
    });
  }

  getImageUrl(imageUrl: string | undefined, itemName: string): string {
    if (!imageUrl) {
      return `https://placehold.co/300x200/e5e7eb/6b7280?text=${encodeURIComponent(itemName)}`;
    }
    // If imageUrl starts with /api, prepend the backend server URL
    if (imageUrl.startsWith('/api')) {
      return `http://localhost:8080${imageUrl}`;
    }
    return imageUrl;
  }

  onImageError(event: Event, item: MenuItemApproval) {
    (event.target as HTMLImageElement).src = `https://placehold.co/300x200/e5e7eb/6b7280?text=${encodeURIComponent(item.name)}`;
  }
}
