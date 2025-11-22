import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface User { id: number; email: string; fullName: string; enabled: boolean; roles: { id: number; name: string }[] }

type RoleName = 'CUSTOMER'|'OWNER'|'AGENT'|'ADMIN';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RoleNavbarComponent, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
  <app-role-navbar></app-role-navbar>
  <div class="users-container">
    <div class="page-header">
      <h1><mat-icon>people</mat-icon> Manage Users</h1>
      <p class="subtitle">View and manage user accounts</p>
    </div>

    <mat-card class="search-card">
      <div class="search-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search by name or email</mat-label>
          <input matInput [(ngModel)]="q" (keyup.enter)="load()" placeholder="Type to search...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="load()">
          <mat-icon>search</mat-icon>
          Search
        </button>
      </div>
    </mat-card>

    <mat-card class="users-table-card">
      <div class="table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td>
                <div class="user-info">
                  <mat-icon>account_circle</mat-icon>
                  <span>{{ u.fullName || '-' }}</span>
                </div>
              </td>
              <td>{{ u.email }}</td>
              <td>
                <mat-form-field appearance="outline" class="role-select">
                  <mat-select [(ngModel)]="roleEdit[u.id]" (selectionChange)="changeRole(u)">
                    <mat-option value="CUSTOMER">CUSTOMER</mat-option>
                    <mat-option value="OWNER">OWNER</mat-option>
                    <mat-option value="AGENT">AGENT</mat-option>
                    <mat-option value="ADMIN">ADMIN</mat-option>
                  </mat-select>
                </mat-form-field>
              </td>
              <td>
                <mat-chip [class.active-chip]="u.enabled" [class.inactive-chip]="!u.enabled">
                  {{u.enabled ? 'Active' : 'Inactive'}}
                </mat-chip>
              </td>
              <td class="actions-cell">
                <button mat-raised-button [color]="u.enabled ? 'warn' : 'primary'" (click)="toggleEnabled(u, !u.enabled)">
                  {{u.enabled ? 'Disable' : 'Enable'}}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </mat-card>
  </div>
  `,
  styles: [`
    .users-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 32px;
      margin: 0 0 8px 0;
      color: #1f2937;
    }

    .subtitle {
      color: #6b7280;
      margin: 0;
    }

    .search-card {
      margin-bottom: 24px;
    }

    .search-bar {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .search-field {
      flex: 1;
    }

    .users-table-card {
      overflow: hidden;
    }

    .table-container {
      overflow-x: auto;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
    }

    .users-table thead {
      background: #f9fafb;
    }

    .users-table th {
      text-align: left;
      padding: 16px;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
    }

    .users-table td {
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .users-table tbody tr:hover {
      background: #f9fafb;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-info mat-icon {
      color: #6b7280;
    }

    .role-select {
      width: 150px;
    }

    .role-select ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .active-chip {
      background-color: #d1fae5 !important;
      color: #065f46 !important;
    }

    .inactive-chip {
      background-color: #fee2e2 !important;
      color: #991b1b !important;
    }

    .actions-cell {
      text-align: right;
    }

    @media (max-width: 768px) {
      .search-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        width: 100%;
      }
    }

    /* Darker placeholder text */
    ::ng-deep .mat-mdc-form-field input::placeholder {
      color: #6b7280 !important;
      opacity: 1 !important;
    }

    /* Empty state styling */
    .users-table tbody tr:empty::after {
      content: 'No users found';
      display: block;
      text-align: center;
      padding: 40px;
      color: #374151;
      font-size: 16px;
      font-weight: 500;
    }
  `]
})
export class AdminUsersComponent {
  users: User[] = [];
  q = '';
  roleEdit: Record<number, RoleName> = {};
  constructor(private http: HttpClient){ this.load(); }

  load(){
    const params: any = {}; if (this.q) params.q = this.q;
    this.http.get<User[]>('/api/admin/users', { params }).subscribe(us => {
      this.users = us;
      us.forEach(u => this.roleEdit[u.id] = (u.roles?.[0]?.name as RoleName) || 'CUSTOMER');
    });
  }

  toggleEnabled(u: User, enabled: boolean){
    this.http.patch<User>(`/api/admin/users/${u.id}/enabled`, null, { params: { enabled } as any }).subscribe(res => {
      u.enabled = res.enabled;
    });
  }

  changeRole(u: User){
    const role = this.roleEdit[u.id];
    this.http.patch<User>(`/api/admin/users/${u.id}/role`, null, { params: { role } as any }).subscribe(res => {
      u.roles = res.roles;
    });
  }
}
