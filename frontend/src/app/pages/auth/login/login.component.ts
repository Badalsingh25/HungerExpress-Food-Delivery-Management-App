import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RoleService } from '../../../core/services/role.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <mat-card class="auth-card">
        <div class="logo-section">
          <mat-icon class="logo-icon">restaurant</mat-icon>
          <h2>Welcome to HungerExpress</h2>
          <p class="subtitle">Login to continue</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" required autofocus />
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password" required />
            <mat-icon matPrefix>lock</mat-icon>
          </mat-form-field>
          <button mat-flat-button color="primary" class="full login-btn" [disabled]="form.invalid">
            <mat-icon>login</mat-icon>
            Login
          </button>
        </form>
        <p class="alt">Don't have an account? <a routerLink="/signup">Sign up</a></p>
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
    
    .login-btn{
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
  `]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private roles: RoleService, 
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  
  ngOnInit() {
    // No role selection - role comes from backend
  }
  
  getRoleDashboard(role: string): string {
    const dashboards: Record<string, string> = {
      'CUSTOMER': '/user/dashboard',
      'OWNER': '/owner/dashboard',
      'AGENT': '/agent/dashboard',
      'ADMIN': '/admin/dashboard'
    };
    return dashboards[role] || '/user/dashboard';
  }
  
  submit() {
    if (this.form.valid) {
      this.auth.login({ email: this.form.value.email, password: this.form.value.password }).subscribe({
        next: (response) => {
          console.log('🔐 Login Response:', response);
          console.log('📧 Email:', response.email);
          console.log('👤 Role from backend:', response.role);
          
          // Navigate based on role from backend
          const role = response.role || 'CUSTOMER';
          const dashboard = this.getRoleDashboard(role);
          
          console.log('🎯 Calculated dashboard URL:', dashboard);
          console.log('🚀 Redirecting to:', dashboard);
          
          // Force navigation with reload
          this.router.navigateByUrl(dashboard).then(() => {
            console.log('✅ Navigation complete to:', dashboard);
          });
        },
        error: (err) => {
          console.error('❌ Login error:', err);
          const msg = err?.error?.message || err?.message || 'Invalid credentials. Check your email and password.';
          alert(msg);
        }
      });
    }
  }
}
