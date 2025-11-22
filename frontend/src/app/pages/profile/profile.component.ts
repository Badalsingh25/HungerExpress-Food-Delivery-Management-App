import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { ProfileService, CustomerProfile } from '../../core/services/profile.service';
import { CustomerProfileService, OrderHistory } from '../../core/services/customer-profile.service';
import { RoleService, UserRole } from '../../core/services/role.service';
import { AvatarService } from '../../core/services/avatar.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatIconModule, MatTableModule, MatChipsModule],
  template: `
    <div class="theme-indigo" style="max-width:1200px;margin:24px auto;padding:0 16px">
      <div style="display:grid;gap:16px;grid-template-columns:320px 1fr;align-items:start;margin-bottom:24px">
        <!-- Left: Profile card -->
        <mat-card class="p-card">
        <div class="avatar-wrap">
          <img [src]="getAvatarUrl()" alt="avatar" (error)="onAvatarError($event)">
          <div class="role-pill">{{ role.role || 'CUSTOMER' }}</div>
        </div>
        <div class="name">{{ backendProfile?.fullName || model.firstName + ' ' + model.lastName || 'Guest User' }}</div>
        <div class="muted">{{ backendProfile?.email || model.email || '—' }}</div>
        <div style="margin-top:12px">
          <label class="file-btn">
            <input type="file" accept="image/*" (change)="uploadAvatar($event)">
            Change Photo
          </label>
        </div>
      </mat-card>

        <!-- Right: Details with visible sections -->
        <div class="sections">
          <mat-card>
            <h3 class="sec-title">Account</h3>
            <div style="padding:8px 0 16px">
              <form [formGroup]="form" (ngSubmit)="save()" class="grid2">
                <mat-form-field appearance="fill" class="full"><mat-label>Full Name</mat-label><input matInput formControlName="fullName" placeholder="Enter full name" /></mat-form-field>
                <mat-form-field appearance="fill"><mat-label>Phone</mat-label><input matInput formControlName="phone" placeholder="e.g. 9876543210" /></mat-form-field>
                <mat-form-field appearance="fill"><mat-label>Email</mat-label><input matInput [value]="backendProfile?.email || model.email" readonly /></mat-form-field>
                <mat-form-field appearance="fill" class="full"><mat-label>Address</mat-label><input matInput formControlName="address" placeholder="Street address" /></mat-form-field>
                <mat-form-field appearance="fill"><mat-label>City</mat-label><input matInput formControlName="city" placeholder="City" /></mat-form-field>
                <mat-form-field appearance="fill"><mat-label>State</mat-label><input matInput formControlName="state" placeholder="State" /></mat-form-field>
                <mat-form-field appearance="fill"><mat-label>Postal Code</mat-label><input matInput formControlName="postalCode" placeholder="Postal code" /></mat-form-field>
                <mat-form-field appearance="fill"><mat-label>Role</mat-label><input matInput [value]="role.role || 'CUSTOMER'" readonly /></mat-form-field>
                <div class="full"><button mat-flat-button color="primary" type="submit">Save Profile</button></div>
              </form>
            </div>
          </mat-card>

          <mat-card>
            <h3 class="sec-title">Settings</h3>
            <div style="padding:8px 0 8px;display:grid;gap:8px">
              <mat-slide-toggle [(ngModel)]="model.notifyPush" [ngModelOptions]="{standalone:true}">Push Notifications</mat-slide-toggle>
              <mat-slide-toggle [(ngModel)]="model.notifySms" [ngModelOptions]="{standalone:true}">SMS Alerts</mat-slide-toggle>
              <mat-slide-toggle [(ngModel)]="model.notifyEmail" [ngModelOptions]="{standalone:true}">Email Notifications</mat-slide-toggle>
              <div>
                <button mat-stroked-button color="primary" (click)="saveToggles()">Save Settings</button>
              </div>
            </div>
          </mat-card>
        </div>
      </div>

      <!-- Order History Section -->
      <mat-card>
        <h3 class="sec-title" style="display:flex;align-items:center;gap:8px">
          <mat-icon>receipt_long</mat-icon>
          Order History
        </h3>
        <div *ngIf="loadingOrders" style="padding:24px;text-align:center">
          <mat-icon style="animation:spin 1s linear infinite">refresh</mat-icon>
          <p>Loading orders...</p>
        </div>
        <div *ngIf="!loadingOrders && orderHistory.length === 0" style="padding:24px;text-align:center;color:#666">
          <mat-icon style="font-size:48px;width:48px;height:48px;color:#ccc">shopping_bag</mat-icon>
          <p>No orders yet. Start shopping!</p>
        </div>
        <div *ngIf="!loadingOrders && orderHistory.length > 0" class="order-list">
          <div *ngFor="let order of orderHistory" class="order-item">
            <div class="order-header">
              <div>
                <strong>Order #{{ order.orderId }}</strong>
                <span class="order-date">{{ order.formattedDate }}</span>
              </div>
              <mat-chip [style.background]="getStatusColor(order.status)" [style.color]="'white'">{{ order.status }}</mat-chip>
            </div>
            <div class="order-details">
              <div class="order-info">
                <mat-icon>restaurant</mat-icon>
                <span>{{ order.itemCount }} items</span>
              </div>
              <div class="order-total">₹{{ order.total }}</div>
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .full{grid-column:1 / -1}
    .p-card{display:grid;justify-items:center;gap:8px}
    .avatar-wrap{position:relative}
    .avatar-wrap img{width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid var(--c-accent);box-shadow:0 6px 20px rgba(0,0,0,.06)}
    .role-pill{position:absolute;right:-8px;bottom:-8px;background:var(--c-accent);color:var(--c-primary);padding:2px 8px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid var(--c-muted-200)}
    .name{font-weight:800;font-size:18px}
    .muted{color:#64748b;font-size:12px}
    .file-btn{display:inline-block;background:#6366f1;color:#fff;padding:6px 12px;border-radius:10px;cursor:pointer;box-shadow:0 8px 22px rgba(99,102,241,.25)}
    .file-btn input{display:none}
    .sections{display:grid;gap:12px}
    .sec-title{margin:0 0 8px;color:#111827;font-weight:800;letter-spacing:.2px}
    :host ::ng-deep .mat-mdc-form-field.mat-form-field-appearance-fill .mdc-text-field{background:var(--c-accent)}
    :host ::ng-deep .mat-mdc-form-field .mdc-notched-outline__leading,
    :host ::ng-deep .mat-mdc-form-field .mdc-notched-outline__notch,
    :host ::ng-deep .mat-mdc-form-field .mdc-notched-outline__trailing{border-color:var(--c-muted-200)}
    .order-list{display:grid;gap:12px;padding:16px 0}
    .order-item{border:1px solid #e0e0e0;border-radius:8px;padding:16px;transition:box-shadow 0.2s}
    .order-item:hover{box-shadow:0 4px 12px rgba(0,0,0,0.1)}
    .order-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
    .order-date{color:#666;font-size:12px;margin-left:8px}
    .order-details{display:flex;justify-content:space-between;align-items:center}
    .order-info{display:flex;align-items:center;gap:8px;color:#666}
    .order-total{font-weight:700;font-size:18px;color:var(--c-primary)}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  `]
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  model: CustomerProfile;
  backendProfile: any = null;
  orderHistory: OrderHistory[] = [];
  loadingOrders = false;
  
  constructor(
    private fb: FormBuilder, 
    private profile: ProfileService, 
    private customerProfileService: CustomerProfileService,
    public role: RoleService, 
    private avatarService: AvatarService
  ) {
    this.model = this.profile.load();
    this.form = this.fb.group({
      fullName: [''],
      phone: [''],
      address: [''],
      city: [''],
      state: [''],
      postalCode: ['']
    });
  }

  ngOnInit() {
    // Try to load from backend first
    this.customerProfileService.getProfile().subscribe({
      next: (profile) => {
        this.backendProfile = profile;
        this.form.patchValue({
          fullName: profile.fullName || '',
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          state: profile.state || '',
          postalCode: profile.postalCode || ''
        });
        // Load order history
        this.loadOrderHistory();
      },
      error: (err) => {
        console.log('Could not load backend profile, using local storage', err);
      }
    });
  }

  loadOrderHistory() {
    this.loadingOrders = true;
    this.customerProfileService.getOrderHistory().subscribe({
      next: (orders) => {
        this.orderHistory = orders;
        this.loadingOrders = false;
      },
      error: (err) => {
        console.error('Failed to load order history', err);
        this.loadingOrders = false;
      }
    });
  }

  save() {
    const formValue = this.form.value;
    
    // Save to backend if user is logged in
    this.customerProfileService.updateProfile(formValue).subscribe({
      next: (profile) => {
        this.backendProfile = profile;
        alert('✅ Profile saved successfully!');
      },
      error: (err) => {
        console.error('Failed to save profile', err);
        // Fallback to local storage
        const { fullName, phone, address, city, state, postalCode } = formValue;
        const [firstName, ...lastNameParts] = (fullName || '').split(' ');
        const lastName = lastNameParts.join(' ');
        this.model = { ...this.model, firstName, lastName, name: fullName, phone, address } as CustomerProfile;
        this.profile.save(this.model);
        alert('⚠️ Profile saved locally (not logged in)');
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'PLACED': '#2196F3',
      'PREPARING': '#FF9800',
      'DISPATCHED': '#9C27B0',
      'DELIVERED': '#4CAF50',
      'CANCELLED': '#F44336'
    };
    return colors[status] || '#757575';
  }

  saveToggles(){
    this.profile.save(this.model);
    alert('Settings saved');
  }

  uploadAvatar(e: Event){
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.model.avatarUrl = String(reader.result || '');
      this.profile.save(this.model);
    };
    reader.readAsDataURL(f);
  }

  getAvatarUrl(): string {
    const name = this.backendProfile?.fullName || this.model.firstName + ' ' + this.model.lastName || 'User';
    const url = this.backendProfile?.profilePictureUrl || this.model.avatarUrl;
    return this.avatarService.getAvatarUrl(url, name);
  }

  onAvatarError(ev: Event){ 
    const name = this.backendProfile?.fullName || this.model.firstName + ' ' + this.model.lastName || 'User';
    this.avatarService.handleImageError(ev, name);
  }
}
