import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

@Component({
  selector: 'app-owner-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RoleNavbarComponent
  ],
  template: `
    <app-role-navbar></app-role-navbar>
    <div class="settings-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1><mat-icon>settings</mat-icon> Account Settings</h1>
          <p class="subtitle">Manage your account information</p>
        </div>
      </div>

      <div class="content">
            <mat-card class="settings-card">
              <h2><mat-icon>person</mat-icon> Account Information</h2>
              <form [formGroup]="accountForm" (ngSubmit)="saveAccountSettings()">
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Full Name</mat-label>
                    <input matInput formControlName="fullName">
                    <mat-icon matPrefix>person</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" type="email">
                    <mat-icon matPrefix>email</mat-icon>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Phone Number</mat-label>
                    <input matInput formControlName="phone">
                    <mat-icon matPrefix>phone</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Language</mat-label>
                    <mat-select formControlName="language">
                      <mat-option value="en">English</mat-option>
                      <mat-option value="hi">Hindi</mat-option>
                      <mat-option value="ta">Tamil</mat-option>
                      <mat-option value="te">Telugu</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <button mat-raised-button color="primary" type="submit">
                  <mat-icon>save</mat-icon>
                  Save Changes
                </button>
              </form>
            </mat-card>

            <mat-card class="settings-card">
              <h2><mat-icon>lock</mat-icon> Change Password</h2>
              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Current Password</mat-label>
                  <input matInput formControlName="currentPassword" type="password">
                  <mat-icon matPrefix>lock</mat-icon>
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>New Password</mat-label>
                    <input matInput formControlName="newPassword" type="password">
                    <mat-icon matPrefix>lock_open</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Confirm New Password</mat-label>
                    <input matInput formControlName="confirmPassword" type="password">
                    <mat-icon matPrefix>lock_open</mat-icon>
                  </mat-form-field>
                </div>

                <button mat-raised-button color="primary" type="submit">
                  <mat-icon>key</mat-icon>
                  Update Password
                </button>
              </form>
            </mat-card>
          </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .page-header {
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
      color: #6366f1;
    }

    .subtitle {
      color: #666;
      margin: 0;
    }

    .content {
      padding: 24px 0;
    }

    .settings-card {
      padding: 24px !important;
      margin-bottom: 24px;
    }

    .settings-card h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .settings-card h2 mat-icon {
      color: #6366f1;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class OwnerSettingsComponent implements OnInit {
  accountForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.accountForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      language: ['en']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    // Load settings from API
    // Mock data for now
    this.accountForm.patchValue({
      fullName: 'Pratik Kumar Dash',
      email: 'Pratik@gmail.com',
      phone: '08260866878',
      language: 'en'
    });
  }

  saveAccountSettings() {
    if (this.accountForm.valid) {
      alert('Account settings saved successfully!');
      // TODO: Call API
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      alert('Password changed successfully!');
      this.passwordForm.reset();
      // TODO: Call API
    }
  }
}
