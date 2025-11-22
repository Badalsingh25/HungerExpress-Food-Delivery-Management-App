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

interface Restaurant { id:number; name:string; city:string; approved:boolean; active:boolean; cuisine:string; rating:number; }

@Component({
  selector: 'app-admin-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule, RoleNavbarComponent, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
  <app-role-navbar></app-role-navbar>
  <div class="restaurants-container">
    <div class="page-header">
      <h1><mat-icon>restaurant</mat-icon> Restaurants Moderation</h1>
      <p class="subtitle">Approve and manage restaurants</p>
    </div>

    <mat-card class="filters-card">
      <div class="filters-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search restaurants</mat-label>
          <input matInput [(ngModel)]="q" (keyup.enter)="load()" placeholder="Search by name...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Approval Status</mat-label>
          <mat-select [(ngModel)]="approved">
            <mat-option [value]="undefined">All</mat-option>
            <mat-option [value]="true">Approved</mat-option>
            <mat-option [value]="false">Pending</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Active Status</mat-label>
          <mat-select [(ngModel)]="active">
            <mat-option [value]="undefined">All</mat-option>
            <mat-option [value]="true">Active</mat-option>
            <mat-option [value]="false">Inactive</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-raised-button color="primary" (click)="load()">
          <mat-icon>filter_list</mat-icon>
          Apply Filters
        </button>
      </div>
    </mat-card>

    <mat-card class="restaurants-table-card">
      <div class="table-container">
        <table class="restaurants-table">
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>City</th>
              <th>Cuisine</th>
              <th>Rating</th>
              <th>Approval</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of rows">
              <td>
                <div class="restaurant-info">
                  <mat-icon>storefront</mat-icon>
                  <span>{{ r.name }}</span>
                </div>
              </td>
              <td>{{ r.city }}</td>
              <td>
                <mat-chip class="cuisine-chip">{{ r.cuisine }}</mat-chip>
              </td>
              <td>
                <div class="rating">
                  <mat-icon>star</mat-icon>
                  <span>{{ r.rating || 'N/A' }}</span>
                </div>
              </td>
              <td>
                <mat-chip [class.approved-chip]="r.approved" [class.pending-chip]="!r.approved">
                  {{r.approved ? 'Approved' : 'Pending'}}
                </mat-chip>
              </td>
              <td>
                <mat-chip [class.active-chip]="r.active" [class.inactive-chip]="!r.active">
                  {{r.active ? 'Active' : 'Inactive'}}
                </mat-chip>
              </td>
              <td class="actions-cell">
                <button *ngIf="!r.approved" mat-raised-button color="primary" (click)="approve(r, true)">
                  <mat-icon>check_circle</mat-icon>
                  Approve
                </button>
                <button *ngIf="!r.active" mat-raised-button color="accent" (click)="toggleActive(r, true)">
                  Activate
                </button>
                <button *ngIf="r.active" mat-raised-button color="warn" (click)="toggleActive(r, false)">
                  Deactivate
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
    .restaurants-container {
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

    .filters-card {
      margin-bottom: 24px;
    }

    .filters-bar {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 250px;
    }

    .restaurants-table-card {
      overflow: hidden;
    }

    .table-container {
      overflow-x: auto;
    }

    .restaurants-table {
      width: 100%;
      border-collapse: collapse;
    }

    .restaurants-table thead {
      background: #f9fafb;
    }

    .restaurants-table th {
      text-align: left;
      padding: 16px;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
    }

    .restaurants-table td {
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .restaurants-table tbody tr:hover {
      background: #f9fafb;
    }

    .restaurant-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .restaurant-info mat-icon {
      color: #6b7280;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .rating mat-icon {
      color: #fbbf24;
      font-size: 18px;
    }

    .cuisine-chip {
      background-color: #dbeafe !important;
      color: #1e40af !important;
    }

    .approved-chip {
      background-color: #d1fae5 !important;
      color: #065f46 !important;
    }

    .pending-chip {
      background-color: #fef3c7 !important;
      color: #92400e !important;
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
      display: flex;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .filters-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        width: 100%;
        min-width: auto;
      }

      .actions-cell {
        flex-direction: column;
      }
    }

    /* Darker placeholder text */
    ::ng-deep .mat-mdc-form-field input::placeholder {
      color: #6b7280 !important;
      opacity: 1 !important;
    }

    /* Empty state for no restaurants */
    .restaurants-table tbody:empty::after {
      content: 'No restaurants found';
      display: block;
      text-align: center;
      padding: 40px;
      color: #374151;
      font-size: 16px;
      font-weight: 500;
    }
  `]
})
export class AdminRestaurantsComponent {
  rows: Restaurant[] = [];
  q = '';
  approved?: boolean; active?: boolean;
  constructor(private http: HttpClient){ this.load(); }
  load(){
    const params: any = {}; if (this.q) params.q=this.q; if (this.approved!==undefined) params.approved=this.approved; if (this.active!==undefined) params.active=this.active;
    this.http.get<Restaurant[]>('/api/admin/restaurants', { params }).subscribe(rs => this.rows = rs);
  }
  approve(r: Restaurant, approved: boolean){
    this.http.patch<Restaurant>(`/api/admin/restaurants/${r.id}/approve`, null, { params: { approved } as any }).subscribe(res => r.approved = res.approved);
  }
  toggleActive(r: Restaurant, active: boolean){
    this.http.patch<Restaurant>(`/api/admin/restaurants/${r.id}/active`, null, { params: { active } as any }).subscribe(res => r.active = res.active);
  }
}
