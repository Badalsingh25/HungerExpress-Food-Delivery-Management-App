import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/services/role.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  private dialog = inject(MatDialog);
  private router = inject(Router);

  openRoleSelector() {
    this.dialog.open(RoleSelectorDialog, {
      width: '600px',
      panelClass: 'role-selector-dialog'
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}

// Role Selector Dialog Component
@Component({
  selector: 'role-selector-dialog',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="role-selector-container">
      <button mat-icon-button class="close-btn" mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
      
      <h1 class="dialog-title">Choose Your Role</h1>
      <p class="dialog-subtitle">Select how you want to use HungerExpress</p>
      
      <div class="roles-grid">
        <mat-card class="role-card" (click)="selectRole('CUSTOMER')">
          <div class="role-icon customer-icon">
            <mat-icon>person</mat-icon>
          </div>
          <h3>Customer</h3>
          <p>Browse restaurants, order food, and track deliveries</p>
          <ul class="feature-list">
            <li>• Browse menus</li>
            <li>• Place orders</li>
            <li>• Track deliveries</li>
            <li>• Review restaurants</li>
          </ul>
        </mat-card>
        
        <mat-card class="role-card" (click)="selectRole('OWNER')">
          <div class="role-icon owner-icon">
            <mat-icon>store</mat-icon>
          </div>
          <h3>Restaurant Owner</h3>
          <p>Manage your restaurant, menu, and orders</p>
          <ul class="feature-list">
            <li>• Manage menu items</li>
            <li>• Track orders</li>
            <li>• View analytics</li>
            <li>• Handle feedback</li>
          </ul>
        </mat-card>
        
        <mat-card class="role-card" (click)="selectRole('AGENT')">
          <div class="role-icon agent-icon">
            <mat-icon>delivery_dining</mat-icon>
          </div>
          <h3>Delivery Agent</h3>
          <p>Accept deliveries and earn money</p>
          <ul class="feature-list">
            <li>• Accept orders</li>
            <li>• Navigate routes</li>
            <li>• Update status</li>
            <li>• Track earnings</li>
          </ul>
        </mat-card>
        
        <mat-card class="role-card" (click)="selectRole('ADMIN')">
          <div class="role-icon admin-icon">
            <mat-icon>admin_panel_settings</mat-icon>
          </div>
          <h3>Administrator</h3>
          <p>Manage platform operations and analytics</p>
          <ul class="feature-list">
            <li>• User management</li>
            <li>• Restaurant approvals</li>
            <li>• Platform analytics</li>
            <li>• Monitor orders</li>
          </ul>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .role-selector-container {
      padding: 32px 24px;
      position: relative;
    }
    
    .close-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 10;
    }
    
    .dialog-title {
      text-align: center;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px;
      color: #333;
    }
    
    .dialog-subtitle {
      text-align: center;
      font-size: 14px;
      color: #666;
      margin: 0 0 32px;
    }
    
    .roles-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    
    .role-card {
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 24px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .role-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    }
    
    .role-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      transition: transform 0.3s ease;
    }
    
    .role-card:hover .role-icon {
      transform: scale(1.1);
    }
    
    .role-icon mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: white;
    }
    
    .customer-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .owner-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .agent-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    .admin-icon {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }
    
    .role-card h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px;
      color: #333;
    }
    
    .role-card p {
      font-size: 13px;
      color: #666;
      margin: 0 0 16px;
    }
    
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0;
      text-align: left;
      font-size: 12px;
      color: #555;
    }
    
    .feature-list li {
      padding: 4px 0;
    }
    
    @media (max-width: 768px) {
      .roles-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RoleSelectorDialog {
  private auth = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  
  selectRole(role: UserRole) {
    console.log(`[RoleSelector] Selected role: ${role}`);
    
    const credentials = this.getDevCredentials(role);
    
    this.auth.login(credentials).subscribe({
      next: (res) => {
        console.log(`[RoleSelector] ✅ Successfully logged in as ${role}`);
        this.dialog.closeAll();
        
        // Navigate based on role
        if (role === 'OWNER') this.router.navigateByUrl('/owner/dashboard');
        else if (role === 'AGENT') this.router.navigateByUrl('/agent/overview');
        else if (role === 'ADMIN') this.router.navigateByUrl('/admin/dashboard');
        else this.router.navigateByUrl('/restaurants');
      },
      error: (err) => {
        console.error('[RoleSelector] Login failed:', err);
        if (err?.status === 0) {
          alert(`❌ Backend not running. Please start the backend server on port 8080.`);
        } else if (err?.status === 401) {
          alert(`❌ Invalid credentials for ${role}\n\nPlease ensure test account exists or sign up first.`);
        } else {
          alert(`❌ Login failed: ${err?.error?.message || 'Unknown error'}`);
        }
        this.dialog.closeAll();
      }
    });
  }
  
  private getDevCredentials(role: UserRole): { email: string; password: string } {
    switch(role) {
      case 'ADMIN':
        return { email: 'badalkusingh8@gmail.com', password: 'admin123' };
      case 'OWNER':
        return { email: 'owner@test.com', password: 'owner123' };
      case 'AGENT':
        return { email: 'agent@test.com', password: 'agent123' };
      case 'CUSTOMER':
      default:
        return { email: 'customer@test.com', password: 'customer123' };
    }
  }
}
