import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RoleService, UserRole } from '../../../core/services/role.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatButtonToggleModule, MatSelectModule, MatIconModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <mat-card class="auth-card">
        <div class="logo-section">
          <mat-icon class="logo-icon">restaurant</mat-icon>
          <h2>Join HungerExpress</h2>
          <p class="subtitle">Create your account</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="name" required autofocus />
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" required />
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password" required />
            <mat-icon matPrefix>lock</mat-icon>
            <mat-hint>Minimum 8 characters</mat-hint>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full">
            <mat-label>I am a...</mat-label>
            <mat-select formControlName="role" required>
              <mat-option value="CUSTOMER">Customer</mat-option>
              <mat-option value="OWNER">Restaurant Owner</mat-option>
              <mat-option value="AGENT">Delivery Agent</mat-option>
            </mat-select>
            <mat-icon matPrefix>group</mat-icon>
          </mat-form-field>

          <button mat-flat-button color="primary" class="full signup-btn" [disabled]="form.invalid">
            <mat-icon>person_add</mat-icon>
            Create Account
          </button>
        </form>
        <p class="alt">Already have an account? <a routerLink="/login">Login</a></p>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-wrapper{display:flex;align-items:center;justify-content:center;min-height:80vh;padding:24px}
    .auth-card{max-width:420px;width:100%;padding:32px;text-align:center}
    .full{width:100%}
    
    .logo-section{
      margin-bottom:32px;
    }
    
    .logo-icon{
      font-size:64px;
      width:64px;
      height:64px;
      color:#ff6b6b;
      margin:0 auto 16px;
    }
    
    h2{margin:0 0 8px;font-size:24px;font-weight:600}
    .subtitle{color:#666;font-size:14px;margin:0 0 24px}
    .alt{margin-top:16px;font-size:14px}
    .note{margin-top:8px;font-size:12px;color:#999;font-style:italic}
    
    .signup-btn{
      height:48px;
      font-size:16px;
      margin-top:8px;
      display:flex;
      gap:8px;
      align-items:center;
      justify-content:center;
    }
    
    mat-form-field{
      text-align:left;
    }
    
    /* Fix button toggle colors - ensure text is always visible */
    ::ng-deep .role-toggle .mat-button-toggle {
      background-color: #f5f5f5;
      border: 1px solid #e0e0e0;
      color: #333 !important;
    }
    
    ::ng-deep .role-toggle .mat-button-toggle-checked {
      background-color: #667eea;
      color: white !important;
      border-color: #667eea;
    }
    
    ::ng-deep .role-toggle .mat-button-toggle-button {
      color: inherit !important;
    }
    
    .role-badge{
      position:absolute;
      top:16px;
      right:16px;
      display:flex;
      align-items:center;
      gap:6px;
      padding:8px 16px;
      border-radius:20px;
      font-size:14px;
      font-weight:600;
      color:white;
    }
    
    .role-badge.customer{
      background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
    }
    .role-badge.owner{
      background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);
    }
    .role-badge.agent{
      background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);
    }
    .role-badge.admin{
      background:linear-gradient(135deg,#43e97b 0%,#38f9d7 100%);
    }
    
    .role-badge mat-icon{
      font-size:18px;
      width:18px;
      height:18px;
    }
  `]
})
export class SignupComponent implements OnInit {
  form!: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private roles: RoleService,
    private router: Router, 
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['CUSTOMER', Validators.required]
    });
  }
  
  ngOnInit() {
  }
  
  submit() {
    if (this.form.valid) {
      this.auth.signup({ 
        email: this.form.value.email, 
        password: this.form.value.password, 
        fullName: this.form.value.name, 
        role: this.form.value.role
      }).subscribe({
        next: () => {
          // Account created - redirect to login
          alert('Account created successfully! Please login to continue.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Signup error:', err);
          const msg = err?.error?.message || err?.message || 'Signup failed. Password must be at least 8 characters.';
          alert(msg);
        }
      });
    }
  }
}
