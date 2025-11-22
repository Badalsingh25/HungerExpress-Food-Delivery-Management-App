import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { ProfileService } from '../../core/services/profile.service';
import { Router } from '@angular/router';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface OwnerProfile {
  id: number;
  userId: number;
  email: string;
  fullName: string;
  phone: string;
  profilePictureUrl: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  businessName: string;
  businessEmail: string;
  gstNumber: string;
  panNumber: string;
  profileCompleted: boolean;
  verified: boolean;
  restaurants: RestaurantSummary[];
}

interface RestaurantSummary {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  logoUrl: string;
  address: string;
  city: string;
  phone: string;
  cuisine: string;
  rating: number;
  approved: boolean;
  active: boolean;
  profileCompleted: boolean;
}

@Component({
  selector: 'app-owner-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatBadgeModule,
    RoleNavbarComponent
  ],
  template: `
    <app-role-navbar></app-role-navbar>
    <div class="owner-profile-container">
      <!-- Header -->
      <div class="profile-header">
        <h1>Owner Profile</h1>
        <p class="subtitle">Manage your profile and restaurants</p>
      </div>

      <div class="profile-content">
          <div class="tab-content">
            <mat-card class="profile-card">
              <div class="profile-top">
                <div class="avatar-section">
                  <div class="avatar">
                    <img [src]="getAvatarUrl()" 
                         alt="Profile">
                    <button mat-mini-fab color="primary" class="upload-btn" (click)="fileInput.click()">
                      <mat-icon>camera_alt</mat-icon>
                    </button>
                    <input #fileInput type="file" hidden accept="image/*" (change)="uploadProfilePicture($event)">
                  </div>
                  <div class="profile-info">
                    <h2>{{ profile?.fullName || 'Complete your profile' }}</h2>
                    <p>{{ profile?.email }}</p>
                    <mat-chip-set>
                      <mat-chip [color]="profile?.profileCompleted ? 'primary' : 'warn'" highlighted>
                        {{ profile?.profileCompleted ? 'Profile Complete' : 'Incomplete Profile' }}
                      </mat-chip>
                      <mat-chip color="accent" highlighted>
                        {{ profile?.restaurants?.length || 0 }} Restaurant(s)
                      </mat-chip>
                    </mat-chip-set>
                  </div>
                </div>
              </div>

              <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="profile-form">
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Full Name</mat-label>
                    <input matInput formControlName="fullName" placeholder="Enter your full name">
                    <mat-icon matPrefix>person</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Phone Number</mat-label>
                    <input matInput formControlName="phone" placeholder="9876543210">
                    <mat-icon matPrefix>phone</mat-icon>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Address</mat-label>
                    <input matInput formControlName="address" placeholder="Street address">
                    <mat-icon matPrefix>home</mat-icon>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>City</mat-label>
                    <input matInput formControlName="city" placeholder="City">
                    <mat-icon matPrefix>location_city</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>State</mat-label>
                    <input matInput formControlName="state" placeholder="State">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Postal Code</mat-label>
                    <input matInput formControlName="postalCode" placeholder="400001">
                  </mat-form-field>
                </div>

                <div class="form-actions">
                  <button mat-raised-button color="primary" type="submit">
                    <mat-icon>save</mat-icon>
                    Save Profile
                  </button>
                </div>
              </form>
            </mat-card>
          </div>
      </div>
    </div>
  `,
  styles: [`
    .owner-profile-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .profile-header {
      margin-bottom: 24px;
    }

    .profile-header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
    }

    .subtitle {
      color: #666;
      margin: 8px 0 0 0;
    }

    .profile-tabs {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .tab-content {
      padding: 24px;
    }

    .profile-card {
      margin-bottom: 24px;
    }

    .profile-top {
      margin-bottom: 32px;
    }

    .avatar-section {
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .avatar {
      position: relative;
      width: 120px;
      height: 120px;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #6366f1;
      display: block;
      background: #6366f1;
    }

    .upload-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 40px;
      height: 40px;
    }

    .profile-info h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
    }

    .profile-info p {
      margin: 0 0 16px 0;
      color: #666;
    }

    .profile-form {
      max-width: 800px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .restaurants-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .restaurants-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .new-restaurant-card {
      margin-bottom: 24px;
      padding: 24px;
      background: #f8f9fa;
    }

    .new-restaurant-card h3 {
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .restaurants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .restaurant-card {
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .restaurant-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .restaurant-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .restaurant-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .status-badges {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      background: #fbbf24;
      color: white;
    }

    .badge.approved {
      background: #10b981;
    }

    .badge.pending {
      background: #f59e0b;
    }

    .badge.active {
      background: #6366f1;
    }

    .restaurant-content {
      padding: 20px;
    }

    .restaurant-content h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .description {
      color: #666;
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .restaurant-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      font-size: 14px;
      color: #666;
    }

    .restaurant-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .restaurant-meta mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .restaurant-actions {
      display: flex;
      gap: 8px;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 24px;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #cbd5e1;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      color: #64748b;
    }

    .empty-state p {
      margin: 0 0 24px 0;
      color: #94a3b8;
    }
  `]
})
export class OwnerProfileComponent implements OnInit {
  profile: OwnerProfile | null = null;
  profileForm: FormGroup;
  avatarUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      address: [''],
      city: [''],
      state: [''],
      postalCode: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  getAvatarUrl(): string {
    if (this.avatarUrl) {
      return this.avatarUrl;
    }
    
    if (this.profile?.profilePictureUrl && this.profile.profilePictureUrl.trim().length > 0) {
      this.avatarUrl = this.profile.profilePictureUrl;
    } else {
      const name = (this.profile?.fullName || 'Owner User').replace(/\s+/g, '+');
      this.avatarUrl = `https://ui-avatars.com/api/?name=${name}&size=120&background=6366f1&color=fff&bold=true`;
    }
    
    return this.avatarUrl;
  }

  loadProfile() {
    this.http.get<OwnerProfile>('/api/owner/profile').subscribe({
      next: (profile) => {
        this.profile = profile;
        this.avatarUrl = ''; // Reset to recalculate
        this.profileForm.patchValue({
          fullName: profile.fullName,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          postalCode: profile.postalCode
        });
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        alert('Failed to load profile. Please try again.');
      }
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    const data = {
      ...this.profileForm.value,
      profilePictureUrl: this.profile?.profilePictureUrl
    };

    this.http.put<OwnerProfile>('/api/owner/profile', data).subscribe({
      next: (profile) => {
        this.profile = profile;
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        alert('Failed to update profile. Please try again.');
      }
    });
  }

  uploadProfilePicture(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    // Upload to server
    this.http.post<{url: string}>('/api/owner/profile/upload-picture', formData).subscribe({
      next: (response) => {
        // Update profile picture in UI
        if (this.profile) {
          this.profile.profilePictureUrl = response.url;
          this.avatarUrl = response.url; // Update avatar URL immediately
        }
        
        // Update ProfileService so navbar shows the new avatar
        const currentProfile = this.profileService.load();
        currentProfile.avatarUrl = response.url;
        this.profileService.save(currentProfile);
        
        alert('Profile picture updated successfully!');
        
        // Force navbar to refresh by triggering navigation
        window.location.reload();
      },
      error: (err) => {
        console.error('Failed to upload picture:', err);
        alert('Failed to upload picture: ' + (err.error?.error || 'Unknown error'));
      }
    });
  }
}
