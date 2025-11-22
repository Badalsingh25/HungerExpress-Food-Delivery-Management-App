import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-select-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="role-dialog">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="dialog-logo">restaurant</mat-icon>
        Choose Your Role
      </h2>
      
      <mat-dialog-content class="dialog-content">
        <p class="dialog-subtitle">Select how you'd like to use HungerExpress</p>
        
        <div class="roles-grid">
          <!-- Customer/User -->
          <button class="role-card customer" (click)="selectRole('customer')">
            <div class="role-icon">
              <mat-icon>person</mat-icon>
            </div>
            <h3>User</h3>
          </button>

          <!-- Restaurant Owner -->
          <button class="role-card owner" (click)="selectRole('owner')">
            <div class="role-icon">
              <mat-icon>storefront</mat-icon>
            </div>
            <h3>Restaurant Owner</h3>
          </button>

          <!-- Delivery Agent -->
          <button class="role-card agent" (click)="selectRole('agent')">
            <div class="role-icon">
              <mat-icon>delivery_dining</mat-icon>
            </div>
            <h3>Delivery Agent</h3>
          </button>

          <!-- Admin -->
          <button class="role-card admin" (click)="selectRole('admin')">
            <div class="role-icon">
              <mat-icon>admin_panel_settings</mat-icon>
            </div>
            <h3>Admin</h3>
          </button>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <p class="action-text">Select a role to continue to login</p>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .role-dialog {
      max-width: 600px;
      width: 100%;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 24px;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
      padding: 20px 24px 10px;
    }

    .dialog-logo {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #ff6b6b;
    }

    .dialog-content {
      padding: 10px 24px 20px !important;
    }

    .dialog-subtitle {
      text-align: center;
      color: #666;
      font-size: 14px;
      margin-bottom: 24px;
    }

    .roles-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 12px;
    }

    .role-card {
      background: linear-gradient(135deg, #f5f5f5 0%, #fff 100%);
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      position: relative;
      overflow: hidden;
    }

    .role-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      transition: all 0.3s ease;
    }

    .role-card.customer::before {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }

    .role-card.owner::before {
      background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
    }

    .role-card.agent::before {
      background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
    }

    .role-card.admin::before {
      background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
    }

    .role-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .role-card.customer:hover {
      border-color: #667eea;
      background: linear-gradient(135deg, #f0f4ff 0%, #fff 100%);
    }

    .role-card.owner:hover {
      border-color: #f5576c;
      background: linear-gradient(135deg, #fff0f5 0%, #fff 100%);
    }

    .role-card.agent:hover {
      border-color: #4facfe;
      background: linear-gradient(135deg, #e3f6ff 0%, #fff 100%);
    }

    .role-card.admin:hover {
      border-color: #43e97b;
      background: linear-gradient(135deg, #e8fff3 0%, #fff 100%);
    }

    .role-icon {
      margin: 0;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      transition: all 0.3s ease;
    }

    .role-card.customer .role-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .role-card.owner .role-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .role-card.agent .role-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .role-card.admin .role-icon {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .role-icon mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: white;
    }

    .role-card h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #263238;
    }

    .dialog-actions {
      padding: 12px 24px !important;
      justify-content: center;
      border-top: 1px solid #e0e0e0;
    }
    
    .action-text {
      margin: 0;
      color: #666;
      font-size: 13px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .roles-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      
      .role-card {
        padding: 16px 12px;
      }
      
      .role-icon {
        width: 50px;
        height: 50px;
      }
      
      .role-icon mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
      
      .role-card h3 {
        font-size: 14px;
      }
    }
  `]
})
export class RoleSelectDialogComponent {
  private dialogRef = inject(MatDialogRef<RoleSelectDialogComponent>);
  private router = inject(Router);

  selectRole(role: 'customer' | 'owner' | 'agent' | 'admin') {
    // Store the selected role in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedRole', role);
    }
    
    // Close dialog and navigate to login
    this.dialogRef.close(role);
    this.router.navigate(['/login'], { queryParams: { role } });
  }

  close() {
    this.dialogRef.close();
  }
}
