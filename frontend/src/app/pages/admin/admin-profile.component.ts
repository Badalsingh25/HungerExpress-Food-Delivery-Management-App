import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { NgIf } from '@angular/common';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface AdminProfile {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  profilePictureUrl: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  role: string;
}

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    NgIf,
    RoleNavbarComponent
  ],
  template: `
    <app-role-navbar></app-role-navbar>
    <div class="admin-profile">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          <img [src]="adminProfile?.profilePictureUrl || defaultAvatar" [alt]="adminProfile?.fullName" class="avatar">
          <button mat-mini-fab color="primary" class="edit-avatar-btn">
            <mat-icon>camera_alt</mat-icon>
          </button>
        </div>
        <div class="profile-info">
          <h1>{{adminProfile?.fullName}}</h1>
          <p>{{adminProfile?.email}}</p>
          <div class="role-badge">
            <mat-icon>admin_panel_settings</mat-icon>
            <span>Administrator</span>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <mat-tab-group class="profile-tabs">
        <!-- Personal Information Tab -->
        <mat-tab label="Personal Info">
          <form [formGroup]="personalInfoForm" (ngSubmit)="savePersonalInfo()">
            <mat-card class="profile-section">
              <mat-card-header>
                <mat-card-title>Personal Information</mat-card-title>
                <mat-card-subtitle>Update your admin profile details</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Full Name</mat-label>
                    <input matInput formControlName="fullName" placeholder="Enter your full name">
                    <mat-error *ngIf="personalInfoForm.get('fullName')?.invalid">Full name is required</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" type="email" placeholder="Enter your email">
                    <mat-icon matSuffix>email</mat-icon>
                    <mat-error *ngIf="personalInfoForm.get('email')?.invalid">Valid email is required</mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Phone Number</mat-label>
                    <input matInput formControlName="phone" placeholder="Enter your phone number">
                    <mat-icon matSuffix>phone</mat-icon>
                    <mat-error *ngIf="personalInfoForm.get('phone')?.invalid">Valid phone number is required</mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Address</mat-label>
                    <textarea matInput formControlName="address" rows="3" placeholder="Enter your full address"></textarea>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>City</mat-label>
                    <input matInput formControlName="city" placeholder="Enter your city">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>State</mat-label>
                    <input matInput formControlName="state" placeholder="Enter your state">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Postal Code</mat-label>
                    <input matInput formControlName="postalCode" placeholder="Enter postal code">
                  </mat-form-field>
                </div>
              </mat-card-content>
              <mat-card-actions align="end">
                <button mat-button type="button" (click)="resetPersonalInfo()">Reset</button>
                <button mat-flat-button color="primary" type="submit" [disabled]="personalInfoForm.invalid">
                  Save Changes
                </button>
              </mat-card-actions>
            </mat-card>
          </form>
        </mat-tab>

        <!-- Security Tab -->
        <mat-tab label="Security">
          <div class="security-section">
            <mat-card class="security-card">
              <mat-card-header>
                <mat-card-title>Change Password</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                  <mat-form-field appearance="outline">
                    <mat-label>Current Password</mat-label>
                    <input matInput formControlName="currentPassword" type="password">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>New Password</mat-label>
                    <input matInput formControlName="newPassword" type="password">
                    <mat-error *ngIf="passwordForm.get('newPassword')?.invalid">
                      Password must be at least 8 characters
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Confirm New Password</mat-label>
                    <input matInput formControlName="confirmPassword" type="password">
                    <mat-error *ngIf="passwordForm.get('confirmPassword')?.invalid">
                      Passwords must match
                    </mat-error>
                  </mat-form-field>

                  <mat-card-actions align="end">
                    <button mat-flat-button color="primary" type="submit" [disabled]="passwordForm.invalid">
                      Update Password
                    </button>
                  </mat-card-actions>
                </form>
              </mat-card-content>
            </mat-card>

            <mat-card class="security-card">
              <mat-card-header>
                <mat-card-title>Admin Account Details</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="admin-details">
                  <div class="detail-item">
                    <div class="detail-label">Role</div>
                    <div class="detail-value">Administrator</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Access Level</div>
                    <div class="detail-value">Full Access</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Account Status</div>
                    <div class="detail-value active">Active</div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-profile {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .profile-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 32px;
      margin-bottom: 24px;
      color: white;
    }

    .profile-avatar {
      position: relative;
    }

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 4px solid white;
      object-fit: cover;
    }

    .edit-avatar-btn {
      position: absolute;
      bottom: 0;
      right: 0;
    }

    .profile-info h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
    }

    .profile-info p {
      margin: 0 0 16px 0;
      opacity: 0.9;
    }

    .role-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      font-size: 14px;
    }

    .profile-tabs {
      margin-top: 24px;
    }

    .profile-section {
      margin: 24px 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    mat-form-field {
      width: 100%;
    }

    .security-section {
      padding: 24px 0;
    }

    .security-card {
      margin-bottom: 24px;
    }

    .security-card form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .admin-details {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .detail-item:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-weight: 600;
      color: #666;
    }

    .detail-value {
      font-size: 16px;
      color: #333;
    }

    .detail-value.active {
      color: #4caf50;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .profile-header {
        flex-direction: column;
        text-align: center;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminProfileComponent implements OnInit {
  adminProfile: AdminProfile | null = null;
  defaultAvatar = 'https://via.placeholder.com/120x120?text=Admin';

  personalInfoForm!: FormGroup;
  passwordForm!: FormGroup;

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.initializeForms();
  }

  ngOnInit() {
    this.loadAdminProfile();
  }

  private initializeForms() {
    this.personalInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
      city: [''],
      state: [''],
      postalCode: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  loadAdminProfile() {
    // Mock data for now - replace with actual API call
    this.adminProfile = {
      id: 1,
      email: 'badalkusingh8@gmail.com',
      fullName: 'Badal Singh',
      phone: '+91 9876543210',
      profilePictureUrl: '',
      address: '123 Admin Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      role: 'ADMIN'
    };

    this.personalInfoForm.patchValue({
      fullName: this.adminProfile.fullName,
      email: this.adminProfile.email,
      phone: this.adminProfile.phone,
      address: this.adminProfile.address,
      city: this.adminProfile.city,
      state: this.adminProfile.state,
      postalCode: this.adminProfile.postalCode
    });
  }

  savePersonalInfo() {
    if (this.personalInfoForm.valid) {
      console.log('Saving admin profile:', this.personalInfoForm.value);
      // TODO: Call API to save profile
      alert('Profile updated successfully!');
    }
  }

  resetPersonalInfo() {
    this.loadAdminProfile();
  }

  changePassword() {
    if (this.passwordForm.valid) {
      console.log('Changing password');
      // TODO: Call API to change password
      alert('Password updated successfully!');
      this.passwordForm.reset();
    }
  }
}
