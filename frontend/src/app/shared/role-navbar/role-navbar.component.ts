import { Component, inject } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from '../../core/services/role.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ProfileService } from '../../core/services/profile.service';
import { RoleSelectDialogComponent } from '../role-select-dialog/role-select-dialog.component';

@Component({
  selector: 'app-role-navbar',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule, CommonModule],
  template: `
    <mat-toolbar color="accent" class="nav">
      <button mat-button routerLink="/" class="brand">
        <span class="material-icons">local_pizza</span>
        <span>HungerExpress</span>
      </button>
      <div class="links">
        <!-- Customer menu -->
        <ng-container *ngIf="roleService.isCustomer()">
          <a mat-button routerLink="/user/dashboard">Dashboard</a>
          <a mat-button routerLink="/user/restaurants">Restaurants</a>
          <a mat-button routerLink="/user/menu">Menu</a>
          <a mat-button routerLink="/user/search">Search</a>
          <a mat-button routerLink="/user/cart">
            <span class="material-icons" [matBadge]="cart.totalQty()" matBadgeColor="warn" matBadgeOverlap="false">shopping_cart</span>&nbsp;Cart
          </a>
          <a mat-button routerLink="/user/orders">My Orders</a>
        </ng-container>

        <!-- Owner menu -->
        <ng-container *ngIf="roleService.isOwner()">
          <a mat-button routerLink="/owner/dashboard" routerLinkActive="active">Dashboard</a>
          <a mat-button routerLink="/owner/restaurants" routerLinkActive="active">My Restaurants</a>
          <a mat-button routerLink="/owner/menu" routerLinkActive="active">Menu</a>
          <a mat-button routerLink="/owner/orders" routerLinkActive="active">Orders</a>
          <a mat-button routerLink="/owner/settings" routerLinkActive="active">Settings</a>
        </ng-container>

        <!-- Agent menu -->
        <ng-container *ngIf="roleService.isAgent()">
          <a mat-button routerLink="/agent/dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-button routerLink="/agent/orders" routerLinkActive="active">
            <mat-icon>assignment</mat-icon>
            <span>Orders</span>
          </a>
          <a class="hide-sm" mat-button routerLink="/agent/earnings" routerLinkActive="active">
            <mat-icon>account_balance_wallet</mat-icon>
            <span>Earnings</span>
          </a>
        </ng-container>

        <!-- Admin menu -->
        <ng-container *ngIf="roleService.isAdmin()">
          <a mat-button routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
          <a mat-button routerLink="/admin/menu-approvals" routerLinkActive="active">Menu Approvals</a>
          <a mat-button routerLink="/admin/users" routerLinkActive="active">Users</a>
          <a mat-button routerLink="/admin/restaurants" routerLinkActive="active">Restaurants</a>
        </ng-container>
      </div>

      <div class="actions">
        <ng-container *ngIf="auth.token; else loggedOut">
          <a mat-button [routerLink]="getProfileRoute()" class="profile-link">
            <img *ngIf="avatarUrl" [src]="avatarUrl" alt="avatar" (error)="onAvatarError($event)" class="avatar-img">
            <span *ngIf="!avatarUrl" class="material-icons">account_circle</span>
            Profile
          </a>
          <a mat-button (click)="logout()">
            <span class="material-icons">logout</span>
            Logout
          </a>
        </ng-container>
        <ng-template #loggedOut>
          <button mat-flat-button class="lets-eat-btn" (click)="openRoleDialog()">
            <mat-icon>restaurant</mat-icon>
            Let's Eat
          </button>
        </ng-template>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .nav {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #e3edf3 !important;
      color: #263238 !important;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding: 6px 16px;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,.06);
      border-bottom: 1px solid rgba(0,0,0,.06);
    }
    .nav .brand {
      font-weight: 600;
      font-size: 20px;
    }
    .nav a, .nav button, .nav .material-icons {
      color: #263238 !important;
      white-space: nowrap;
    }
    .nav a:hover { opacity: .85; }
    .links {
      display: flex;
      gap: 12px;
      align-items: center;
      flex: 1;
      min-width: 0;
      overflow: auto;
      padding: 6px 0;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .profile-link{display:flex;align-items:center;gap:6px}
    .profile-link img,
    .profile-link .avatar-img{
      width:28px;
      height:28px;
      border-radius:50%;
      object-fit:cover;
      border:2px solid #fff;
      background: #e3edf3;
      display: block;
      transition: none !important;
      animation: none !important;
    }
    .profile-link .material-icons {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .track-btn {
      margin-left: 8px;
    }
    .actions a.mat-button {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    a.active { font-weight: 700; text-decoration: underline; text-underline-offset: 4px; }
    
    /* Agent navbar links with icons */
    .links a mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-right: 4px;
      vertical-align: middle;
    }
    .links a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    
    .lets-eat-btn {
      background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%) !important;
      color: white !important;
      font-weight: 600 !important;
      font-size: 16px !important;
      padding: 8px 24px !important;
      border-radius: 24px !important;
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3) !important;
      transition: all 0.3s ease !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }
    
    .lets-eat-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4) !important;
      background: linear-gradient(135deg, #ff8e53 0%, #ff6b6b 100%) !important;
    }
    
    .lets-eat-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    @media (max-width: 959px) {
      .hide-sm {
        display: none !important;
      }
      .links {
        order: 1;
        width: 100%;
        justify-content: center;
      }
      .brand {
        flex-grow: 1;
      }
      .lets-eat-btn {
        font-size: 14px !important;
        padding: 6px 16px !important;
      }
    }
  `]
})
export class RoleNavbarComponent {
  roleService = inject(RoleService);
  auth = inject(AuthService);
  router = inject(Router);
  private dialog = inject(MatDialog);
  cart = inject(CartService);
  private profile = inject(ProfileService);
  avatarUrl: string | undefined;

  constructor() {
    // Load avatar once on initialization
    this.loadAvatar();
  }

  loadAvatar() {
    const savedAvatar = this.profile.getAvatar();
    if (savedAvatar && savedAvatar.trim()) {
      this.avatarUrl = savedAvatar;
    } else {
      // Use default avatar icon
      this.avatarUrl = undefined;
    }
  }

  onAvatarError(event: Event) {
    // Fallback to account_circle icon if image fails to load
    this.avatarUrl = undefined;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  getProfileRoute(): string {
    if (this.roleService.isOwner()) {
      return '/owner/profile';
    } else if (this.roleService.isAgent()) {
      return '/agent/profile';
    } else if (this.roleService.isAdmin()) {
      return '/admin/profile';
    } else {
      return '/user/profile';
    }
  }

  openRoleDialog() {
    this.dialog.open(RoleSelectDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'role-dialog-panel'
    });
  }
}
