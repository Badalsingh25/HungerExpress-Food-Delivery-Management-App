import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface AgentProfileData {
  // User table fields
  id: number;
  email: string;
  fullName: string;
  phone: string;
  profilePictureUrl: string;
  
  // AgentProfile table fields
  isAvailable: boolean;
  rating: number;
  totalEarnings: number;
  totalDeliveries: number;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  joinedDate: string;
}

@Component({
  selector: 'app-agent-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    MatDividerModule,
    RoleNavbarComponent
  ],
  template: `
      <app-role-navbar></app-role-navbar>
      <div class="profile-container">
      <div class="page-header">
        <h1><mat-icon>person</mat-icon> Agent Profile</h1>
        <p class="subtitle">Manage your personal information and account settings</p>
      </div>

      <div *ngIf="loading" class="loading">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>

      <div *ngIf="!loading" class="content">
        <!-- Profile Header Card -->
        <mat-card class="header-card">
          <div class="profile-header">
            <div class="avatar-section">
              <div class="avatar-wrapper">
                <img *ngIf="avatarUrl" [src]="avatarUrl" alt="Profile Picture" class="avatar">
                <div *ngIf="!avatarUrl" class="avatar-placeholder">
                  <mat-icon>person</mat-icon>
                </div>
                <button mat-mini-fab color="primary" class="upload-btn" (click)="fileInput.click()">
                  <mat-icon>camera_alt</mat-icon>
                </button>
                <input #fileInput type="file" hidden accept="image/*" (change)="onFileSelected($event)">
              </div>
            </div>

            <div class="profile-info">
              <h2>{{ profile.fullName || 'Agent' }}</h2>
              <p class="email"><mat-icon>email</mat-icon> {{ profile.email }}</p>
              <p class="phone"><mat-icon>phone</mat-icon> {{ profile.phone || 'Not set' }}</p>
              <div class="status-badge" [class.online]="profile.isAvailable">
                <div class="status-dot"></div>
                <span>{{ profile.isAvailable ? 'Online' : 'Offline' }}</span>
              </div>
            </div>

            <div class="stats-section">
              <div class="stat-item">
                <mat-icon>star</mat-icon>
                <div>
                  <span class="stat-label">Rating</span>
                  <span class="stat-value">{{ profile.rating || 0 }}/5</span>
                </div>
              </div>
              <div class="stat-item">
                <mat-icon>delivery_dining</mat-icon>
                <div>
                  <span class="stat-label">Deliveries</span>
                  <span class="stat-value">{{ profile.totalDeliveries || 0 }}</span>
                </div>
              </div>
              <div class="stat-item">
                <mat-icon>account_balance_wallet</mat-icon>
                <div>
                  <span class="stat-label">Earnings</span>
                  <span class="stat-value">₹{{ profile.totalEarnings || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </mat-card>

        <!-- Personal Information -->
        <mat-card class="section-card">
          <div class="section-header">
            <h3><mat-icon>person_outline</mat-icon> Personal Information</h3>
            <button mat-button color="primary" *ngIf="!editingPersonal" (click)="editPersonal()">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
          </div>

          <form [formGroup]="personalForm" *ngIf="editingPersonal" (ngSubmit)="savePersonal()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="fullName" placeholder="Enter your full name">
                <mat-icon matPrefix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phone" placeholder="+91 98765 43210">
                <mat-icon matPrefix>phone</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" [readonly]="true">
                <mat-icon matPrefix>email</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-raised-button type="button" (click)="cancelPersonal()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!personalForm.valid">
                <mat-icon>save</mat-icon>
                Save Changes
              </button>
            </div>
          </form>

          <div *ngIf="!editingPersonal" class="info-display">
            <div class="info-row">
              <span class="label">Full Name:</span>
              <span class="value">{{ profile.fullName || 'Not set' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">{{ profile.email }}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value">{{ profile.phone || 'Not set' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Member Since:</span>
              <span class="value">{{ formatDate(profile.joinedDate) }}</span>
            </div>
          </div>
        </mat-card>

        <!-- Account Actions -->
        <mat-card class="section-card actions-card">
          <h3><mat-icon>settings</mat-icon> Account Actions</h3>
          <div class="actions-grid">
            <button mat-raised-button color="accent" (click)="changePassword()">
              <mat-icon>lock</mat-icon>
              Change Password
            </button>
            <button mat-raised-button (click)="downloadData()">
              <mat-icon>download</mat-icon>
              Download My Data
            </button>
            <button mat-raised-button color="warn" (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
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
      margin: 0 0 32px 0;
    }

    .loading {
      margin: 40px 0;
    }

    .header-card {
      padding: 40px !important;
      margin-bottom: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4) !important;
      border-radius: 16px !important;
    }

    .profile-header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 40px;
      align-items: center;
    }

    .avatar-section {
      position: relative;
    }

    .avatar-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
    }

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .avatar-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 4px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-placeholder mat-icon {
      font-size: 60px;
      width: 60px;
      height: 60px;
      color: white;
    }

    .upload-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 40px !important;
      height: 40px !important;
    }

    .profile-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .profile-info h2 {
      margin: 0 0 12px 0;
      font-size: 28px;
      font-weight: 700;
    }

    .profile-info p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
      opacity: 0.9;
    }

    .profile-info mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      background: rgba(255,255,255,0.2);
      margin-top: 12px;
      font-weight: 600;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ef4444;
      animation: pulse 2s infinite;
    }

    .status-badge.online .status-dot {
      background: #10b981;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .stats-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
    }

    .stat-item mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .stat-label {
      display: block;
      font-size: 12px;
      opacity: 0.8;
    }

    .stat-value {
      display: block;
      font-size: 20px;
      font-weight: 700;
    }

    .section-card {
      padding: 32px !important;
      margin-bottom: 24px;
      border-radius: 12px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
      transition: all 0.3s ease;
    }

    .section-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
      transform: translateY(-2px);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #f1f5f9;
    }

    .section-header h3 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      color: #1e293b;
      font-weight: 600;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .info-display {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 10px;
      border-left: 4px solid #3b82f6;
      transition: all 0.2s ease;
    }

    .info-row:hover {
      background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
      border-left-color: #2563eb;
      transform: translateX(4px);
    }

    .info-row .label {
      font-weight: 600;
      color: #64748b;
      font-size: 15px;
    }

    .info-row .value {
      color: #1e293b;
      font-weight: 500;
      font-size: 15px;
    }

    .actions-card {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
      border: 2px solid #f59e0b !important;
    }

    .actions-card h3 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: 600;
      color: #92400e;
    }

    .actions-card h3 mat-icon {
      color: #f59e0b;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .actions-grid button {
      height: 60px !important;
      font-size: 15px !important;
      font-weight: 500 !important;
      border-radius: 10px !important;
    }

    @media (max-width: 968px) {
      .profile-header {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .stats-section {
        flex-direction: row;
        justify-content: center;
      }
    }
  `]
})
export class AgentProfileComponent implements OnInit {
  loading = false;
  profile: AgentProfileData = {
    id: 0,
    email: '',
    fullName: 'Agent',
    phone: '',
    profilePictureUrl: '',
    isAvailable: false,
    rating: 0,
    totalEarnings: 0,
    totalDeliveries: 0,
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    joinedDate: new Date().toISOString()
  };
  avatarUrl: string | null = null;

  editingPersonal = false;

  personalForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.personalForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]]
    });
  }

  ngOnInit() {
    // Show page immediately with default data
    this.loading = false;
    this.loadProfile();
  }

  loadProfile() {
    this.http.get<AgentProfileData>('/api/agent/profile').subscribe({
      next: (data) => {
        this.profile = data;
        this.avatarUrl = data.profilePictureUrl;
        this.populateForms();
        console.log('✅ Agent profile loaded from backend');
      },
      error: (err) => {
        console.error('❌ Failed to load profile:', err);
        console.warn('Using default profile data');
        // Default profile already initialized above
        this.populateForms();
      }
    });
  }

  populateForms() {
    this.personalForm.patchValue({
      fullName: this.profile.fullName,
      email: this.profile.email,
      phone: this.profile.phone
    });
  }

  editPersonal() {
    this.editingPersonal = true;
  }

  cancelPersonal() {
    this.editingPersonal = false;
    this.populateForms();
  }

  savePersonal() {
    if (this.personalForm.valid) {
      const data = this.personalForm.getRawValue();
      this.http.put('/api/agent/profile/personal', data).subscribe({
        next: () => {
          alert('Personal information updated successfully!');
          this.editingPersonal = false;
          this.loadProfile();
        },
        error: (err) => {
          console.error('Failed to update:', err);
          alert('Failed to update profile. Please try again.');
        }
      });
    }
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/agent/profile/upload-picture', formData).subscribe({
      next: (response) => {
        this.avatarUrl = response.url;
        alert('Profile picture updated successfully!');
        this.loadProfile();
      },
      error: (err) => {
        console.error('Failed to upload:', err);
        alert('Failed to upload picture. Please try again.');
      }
    });
  }

  changePassword() {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
      this.http.post('/api/agent/profile/change-password', { password: newPassword }).subscribe({
        next: () => {
          alert('Password changed successfully!');
        },
        error: (err) => {
          console.error('Failed to change password:', err);
          alert('Failed to change password.');
        }
      });
    }
  }

  downloadData() {
    this.http.get('/api/agent/profile/download', { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agent-data.json';
        a.click();
      },
      error: (err) => {
        console.error('Failed to download:', err);
        alert('Failed to download data.');
      }
    });
  }

  logout() {
    const confirmed = confirm('Are you sure you want to logout?');
    if (confirmed) {
      localStorage.clear();
      window.location.href = '/login';
    }
  }

  formatDate(isoString: string): string {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  }

}
