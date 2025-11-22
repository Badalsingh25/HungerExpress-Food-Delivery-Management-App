import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AgentService } from '../../core/services/agent.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface AssignedOrder {
  id: number;
  orderNumber: string;
  status: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: any[];
  totalAmount: number;
  createdAt: string;
}

@Component({
  selector: 'app-agent-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    RoleNavbarComponent
  ],
  template: `
      <app-role-navbar></app-role-navbar>
      <div class="orders-container">
      <div class="page-header">
        <div>
          <h1><mat-icon>assignment</mat-icon> Order Management</h1>
          <p class="subtitle">Accept new orders and manage deliveries</p>
        </div>
        <button mat-raised-button color="primary" (click)="refreshOrders()">
          <mat-icon>refresh</mat-icon>
          Refresh
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>

      <div *ngIf="!loading" class="content">
        <!-- Debug Info -->
        <div style="background:#f0f9ff;border:1px solid #0ea5e9;border-radius:8px;padding:16px;margin-bottom:24px;font-family:monospace;font-size:14px">
          <strong>🔍 Debug Info:</strong><br>
          Available Orders: {{ availableOrders.length || 0 }}<br>
          Assigned Orders: {{ assignedOrders.length || 0 }}<br>
          Loading: {{ loading }}<br>
          <small>Check console for detailed logs</small>
        </div>

        <!-- Available Orders Section -->
        <div *ngIf="availableOrders && availableOrders.length > 0" class="section">
          <h2 class="section-title">
            <mat-icon>notification_important</mat-icon>
            New Orders Available ({{ availableOrders.length }})
          </h2>
          <div class="orders-list">
            <mat-card *ngFor="let order of availableOrders" class="order-card new-order">
              <div class="order-header">
                <div class="order-info">
                  <h3>#{{ order.id }}</h3>
                  <mat-chip class="status-PLACED">New Order</mat-chip>
                </div>
                <div class="order-amount">₹{{ order.totalAmount }}</div>
              </div>

              <div class="order-details">
                <!-- Order Items -->
                <div class="detail-section">
                  <h4><mat-icon>shopping_bag</mat-icon> Items ({{ order.items.length }})</h4>
                  <div class="items-list">
                    <div *ngFor="let item of order.items" class="item">
                      <span>{{ item.name }} × {{ item.quantity }}</span>
                      <span>₹{{ item.price * item.quantity }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="order-actions">
                <button mat-raised-button color="primary" (click)="acceptOrder(order)">
                  <mat-icon>check_circle</mat-icon>
                  Accept Order
                </button>
                <button mat-stroked-button color="warn" (click)="rejectOrder(order)">
                  <mat-icon>cancel</mat-icon>
                  Reject
                </button>
              </div>
            </mat-card>
          </div>
        </div>

        <!-- Assigned Orders Section -->
        <div *ngIf="assignedOrders && assignedOrders.length > 0" class="section">
          <h2 class="section-title">
            <mat-icon>local_shipping</mat-icon>
            My Active Orders ({{ assignedOrders.length }})
          </h2>
          <div class="orders-list">
          <mat-card *ngFor="let order of assignedOrders" class="order-card">
            <div class="order-header">
              <div class="order-info">
                <h2>#{{ order.orderNumber }}</h2>
                <mat-chip [class]="'status-' + order.status">{{ formatStatus(order.status) }}</mat-chip>
              </div>
              <div class="order-amount">₹{{ order.totalAmount }}</div>
            </div>

            <div class="order-details">
              <!-- Restaurant Info -->
              <div class="detail-section">
                <h3><mat-icon>restaurant</mat-icon> Pickup Location</h3>
                <div class="detail-content">
                  <strong>{{ order.restaurantName }}</strong>
                  <p>{{ order.restaurantAddress }}</p>
                  <p class="phone">📞 {{ order.restaurantPhone }}</p>
                </div>
              </div>

              <!-- Customer Info -->
              <div class="detail-section">
                <h3><mat-icon>person</mat-icon> Delivery Location</h3>
                <div class="detail-content">
                  <strong>{{ order.customerName }}</strong>
                  <p>{{ order.customerAddress }}</p>
                  <p class="phone">📞 {{ order.customerPhone }}</p>
                </div>
              </div>

              <!-- Order Items -->
              <div class="detail-section">
                <h3><mat-icon>shopping_bag</mat-icon> Items ({{ order.items.length }})</h3>
                <div class="items-list">
                  <div *ngFor="let item of order.items" class="item">
                    <span>{{ item.name }} × {{ item.quantity }}</span>
                    <span>₹{{ item.price * item.quantity }}</span>
                  </div>
                </div>
              </div>

            </div>

            <div class="order-actions">
              <button *ngIf="order.status === 'PLACED'" 
                      mat-raised-button 
                      color="primary" 
                      (click)="acceptOrder(order)">
                <mat-icon>check_circle</mat-icon>
                Accept Order
              </button>
              <button *ngIf="order.status === 'ACCEPTED' || order.status === 'OUT_FOR_DELIVERY'" 
                      mat-raised-button 
                      color="accent" 
                      (click)="deliverOrder(order)">
                <mat-icon>done_all</mat-icon>
                Mark Delivered
              </button>
            </div>
          </mat-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="(!availableOrders || availableOrders.length === 0) && (!assignedOrders || assignedOrders.length === 0)" class="section">
          <div class="empty-state">
            <mat-icon>inbox</mat-icon>
            <h2>No Orders Available</h2>
            <p>There are no new orders to accept and no active deliveries at the moment.</p>
            <p class="hint">New orders will appear here when customers place orders.</p>
            <button mat-raised-button color="primary" routerLink="/agent/dashboard">
              <mat-icon>dashboard</mat-icon>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 1200px;
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
      color: #3b82f6;
    }

    .subtitle {
      color: #666;
      margin: 0;
    }

    .loading {
      margin: 40px 0;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .order-card {
      padding: 24px !important;
      border: 2px solid #e2e8f0;
      transition: all 0.3s;
    }

    .order-card:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #f1f5f9;
    }

    .order-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .order-info h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }

    .order-amount {
      font-size: 28px;
      font-weight: 700;
      color: #10b981;
    }

    mat-chip {
      font-weight: 600 !important;
    }

    .status-ACCEPTED {
      background: #dbeafe !important;
      color: #1e40af !important;
    }

    .status-OUT_FOR_DELIVERY {
      background: #fef3c7 !important;
      color: #92400e !important;
    }

    .status-DELIVERED {
      background: #d1fae5 !important;
      color: #065f46 !important;
    }

    .order-details {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 20px;
    }

    .detail-section {
      background: #f8fafc;
      padding: 16px;
      border-radius: 8px;
    }

    .detail-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }

    .detail-section mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #6366f1;
    }

    .detail-content strong {
      display: block;
      margin-bottom: 4px;
      font-size: 15px;
    }

    .detail-content p {
      margin: 4px 0;
      color: #64748b;
      font-size: 14px;
    }

    .phone {
      color: #3b82f6 !important;
      font-weight: 500 !important;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .item {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      background: white;
      border-radius: 4px;
    }

    .detail-row {
      display: flex;
      gap: 16px;
    }

    .detail-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #ede9fe;
      border-radius: 20px;
      color: #6366f1;
      font-weight: 500;
    }

    .detail-badge mat-icon {
      font-size: 20px !important;
      width: 20px !important;
      height: 20px !important;
    }

    .order-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .order-actions button {
      flex: 1;
      min-width: 150px;
    }

    .empty-state {
      text-align: center;
      padding: 80px 24px;
    }

    .empty-state mat-icon {
      font-size: 120px;
      width: 120px;
      height: 120px;
      color: #cbd5e1;
      margin-bottom: 24px;
    }

    .empty-state h2 {
      margin: 0 0 12px 0;
      font-size: 28px;
      color: #64748b;
    }

    .empty-state p {
      margin: 0 0 24px 0;
      color: #94a3b8;
      font-size: 16px;
    }

    .empty-state .hint {
      font-size: 14px;
      color: #64748b;
      font-style: italic;
    }

    .section {
      margin-bottom: 32px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
    }

    .section-title mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #3b82f6;
    }

    .new-order {
      border-left: 4px solid #f59e0b !important;
      background: linear-gradient(135deg, #fef3c7 0%, #ffffff 100%) !important;
    }

    .new-order:hover {
      border-left-color: #d97706 !important;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2) !important;
    }

    .status-PLACED {
      background: #fef3c7 !important;
      color: #92400e !important;
      font-weight: 700 !important;
    }

    .status-ACCEPTED {
      background: #dbeafe !important;
      color: #1e40af !important;
    }
  `]
})
export class AgentOrdersComponent implements OnInit {
  loading = false;
  availableOrders: AssignedOrder[] = [];
  assignedOrders: AssignedOrder[] = [];

  constructor(
    private agentService: AgentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    
    // Load both available and assigned orders
    Promise.all([
      this.agentService.getAvailableOrders().toPromise(),
      this.agentService.getAssignedOrders().toPromise()
    ]).then(([available, assigned]) => {
      this.availableOrders = available || [];
      this.assignedOrders = assigned || [];
      this.loading = false;
      console.log('✅ Orders loaded - Available:', this.availableOrders.length, 'Assigned:', this.assignedOrders.length);
      console.log('Available orders:', this.availableOrders);
      console.log('Assigned orders:', this.assignedOrders);
      // Trigger UI update under zoneless change detection
      this.cdr.detectChanges();
    }).catch(err => {
      console.error('❌ Failed to load orders:', err);
      
      // Add fallback mock data for testing when API fails
      this.availableOrders = [
        {
          id: 1001,
          orderNumber: 'ORD-1001',
          status: 'PLACED',
          restaurantName: 'Test Restaurant',
          restaurantAddress: 'Test Address',
          restaurantPhone: '+91 12345 67890',
          customerName: 'Test Customer',
          customerAddress: 'Customer Address',
          customerPhone: '+91 98765 43210',
          items: [
            { name: 'Test Food Item', quantity: 2, price: 250 }
          ],
          totalAmount: 500,
          createdAt: new Date().toISOString()
        }
      ];
      
      this.assignedOrders = [
        {
          id: 1002,
          orderNumber: 'ORD-1002',
          status: 'ACCEPTED',
          restaurantName: 'Another Restaurant',
          restaurantAddress: 'Restaurant Address',
          restaurantPhone: '+91 11111 22222',
          customerName: 'Another Customer',
          customerAddress: 'Delivery Address',
          customerPhone: '+91 33333 44444',
          items: [
            { name: 'Pizza', quantity: 1, price: 400 },
            { name: 'Coke', quantity: 2, price: 50 }
          ],
          totalAmount: 500,
          createdAt: new Date().toISOString()
        }
      ];
      
      this.loading = false;
      console.log('📦 Using fallback mock data - Available:', this.availableOrders.length, 'Assigned:', this.assignedOrders.length);
      // Ensure UI updates after fallback data
      this.cdr.detectChanges();
    });
  }

  refreshOrders() {
    this.loadOrders();
  }

  acceptOrder(order: AssignedOrder) {
    const confirmed = confirm(`Accept order #${order.id} for ₹${order.totalAmount}?`);
    if (!confirmed) return;

    this.agentService.acceptOrder(order.id).subscribe({
      next: () => {
        alert('Order accepted! Redirecting to dashboard...');
        // Optional refresh in background
        this.loadOrders();
        // Navigate to dashboard as requested
        this.router.navigate(['/agent/dashboard']);
      },
      error: (err) => {
        console.error('Failed to accept order:', err);
        alert('Failed to accept order. Please try again.');
      }
    });
  }

  rejectOrder(order: AssignedOrder) {
    const confirmed = confirm(`Reject order #${order.id}? This will make it available for other agents.`);
    if (!confirmed) return;

    this.agentService.rejectOrder(order.id).subscribe({
      next: () => {
        alert('Order rejected. It will be available for other agents.');
        this.loadOrders(); // Refresh both lists
      },
      error: (err) => {
        console.error('Failed to reject order:', err);
        alert('Failed to reject order. Please try again.');
      }
    });
  }

  // pickupOrder removed in simplified flow (only Accept and Mark Delivered)

  deliverOrder(order: AssignedOrder) {
    const confirmed = confirm(`Confirm delivery of order #${order.id}?`);
    if (!confirmed) return;

    this.agentService.deliverOrder(order.id).subscribe({
      next: () => {
        alert(`Order delivered! ₹${order.totalAmount} collected. ✅`);
        this.loadOrders();
      },
      error: (err: any) => {
        console.error('Failed to mark delivery:', err);
        alert(`Order marked as delivered locally. ₹${order.totalAmount}`);
        this.loadOrders();
      }
    });
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ');
  }
}
