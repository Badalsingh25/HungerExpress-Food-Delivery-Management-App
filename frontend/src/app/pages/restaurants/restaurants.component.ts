import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, DecimalPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RestaurantService, Restaurant, Cuisine } from '../../core/services/restaurant.service';
import { RouterLink } from '@angular/router';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, DecimalPipe, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, RouterLink, RoleNavbarComponent],
  template: `
    <app-role-navbar></app-role-navbar>
    <div class="rest-wrap theme-olive">
      <div class="header-section">
        <h1 class="page-title">Discover Restaurants</h1>
        <p class="page-subtitle">Browse thousands of restaurants and order your favorite food</p>
      </div>

      <div class="search-container">
        <div class="search-row">
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>Search restaurants, cuisines, or dishes</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput [(ngModel)]="search" (keyup.enter)="load()" placeholder="Try 'Pizza' or 'Italian'..." />
          </mat-form-field>
          <button mat-flat-button class="search-btn" (click)="load()">
            <mat-icon>search</mat-icon>
            Search
          </button>
        </div>
      </div>

      <div class="restaurants-section">
        <h3 class="section-title" *ngIf="restaurants.length > 0">Available Restaurants ({{ restaurants.length }})</h3>
        <div class="grid" *ngIf="restaurants.length > 0">
          <mat-card *ngFor="let r of restaurants" class="card">
            <img mat-card-image [src]="r.imageUrl" [alt]="r.name" />
            <mat-card-content>
              <div class="card-header">
                <h3 class="card-title">{{ r.name }}</h3>
                <div class="rating-badge">
                  <mat-icon>star</mat-icon>
                  {{ r.rating || 4.5 }}
                </div>
              </div>
              <p class="card-description" *ngIf="r.description">{{ r.description }}</p>
              <div class="meta">
                <span class="cuisine-badge">{{ r.cuisine }}</span>
                <span class="delivery-info">₹{{ r.deliveryFee | number:'1.0-2' }} delivery</span>
              </div>
            </mat-card-content>
            <mat-card-actions align="end">
              <a mat-flat-button color="primary" [routerLink]="['/user/menu']" [queryParams]="{ rid: r.id }" (click)="$event.stopPropagation()">
                <mat-icon>restaurant_menu</mat-icon>
                View Menu
              </a>
            </mat-card-actions>
          </mat-card>
        </div>
        <div *ngIf="restaurants.length === 0" class="empty-state">
          <mat-icon>search_off</mat-icon>
          <h3>No restaurants found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rest-wrap { 
      max-width:1200px; 
      margin:24px auto; 
      padding:0 16px 40px; 
      background:var(--brand-surface); 
    }
    
    .header-section {
      text-align: center;
      padding: 2rem 0 1.5rem;
      border-bottom: 2px solid var(--c-muted-200);
      margin-bottom: 2rem;
    }
    
    .page-title { 
      color:var(--c-primary); 
      margin:0 0 0.5rem; 
      font-size: 2.5rem;
      font-weight: 700;
    }
    
    .page-subtitle {
      color: #64748b;
      font-size: 1.1rem;
      margin: 0;
    }
    
    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a202c;
      margin: 0 0 1rem;
    }
    
    .search-container {
      display: flex;
      justify-content: center;
      margin: 0 0 2rem;
    }
    
    .search-row { 
      display:flex; 
      gap:12px; 
      align-items:center; 
      width: 100%;
      max-width: 800px;
    }
    
    .search-btn { 
      background:var(--c-primary); 
      color:#fff;
      padding: 0 2rem;
      white-space: nowrap;
    }
    
    
    .restaurants-section {
      margin-top: 2rem;
    }
    
    .grid { 
      display:grid; 
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
      gap:20px; 
      margin-top: 1.5rem;
    }
    
    .card { 
      border:1px solid var(--c-muted-200); 
      border-radius:16px; 
      overflow:hidden;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    }
    
    .card img[mat-card-image]{ 
      width:100%; 
      aspect-ratio:4/3; 
      object-fit:cover;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    
    .card-title { 
      margin:0; 
      color:#1f2937;
      font-size: 1.25rem;
      font-weight: 600;
      flex: 1;
    }
    
    .rating-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #fef3c7;
      color: #92400e;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      white-space: nowrap;
    }
    
    .rating-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .card-description {
      color: #64748b;
      font-size: 0.9rem;
      margin: 0.5rem 0;
      line-height: 1.5;
    }
    
    .meta { 
      display:flex; 
      justify-content:space-between; 
      align-items: center;
      margin-top: 0.75rem;
    }
    
    .cuisine-badge {
      background: #e0e7ff;
      color: #4338ca;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    
    .delivery-info {
      color: #059669;
      font-weight: 600;
      font-size: 0.875rem;
    }
    
    mat-card-actions {
      padding: 16px !important;
      background: white !important;
    }
    
    mat-card-actions a[mat-flat-button] {
      color: white !important;
      background-color: #ff6b6b !important;
      font-weight: 600 !important;
      padding: 8px 24px !important;
      min-height: 40px !important;
    }
    
    mat-card-actions a[mat-flat-button]:hover {
      background-color: #ff5252 !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3) !important;
    }
    
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #64748b;
    }
    
    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      opacity: 0.5;
      margin-bottom: 1rem;
    }
    
    .empty-state h3 {
      font-size: 1.5rem;
      margin: 0 0 0.5rem;
      color: #334155;
    }
    
    .empty-state p {
      font-size: 1rem;
      margin: 0;
    }
    

    /* Themed search field */
    :host ::ng-deep .rest-wrap .mat-mdc-form-field .mdc-text-field { 
      background:var(--brand-surface) !important; 
      border-radius:8px; 
    }
    
    :host ::ng-deep .rest-wrap .mat-mdc-form-field .mdc-notched-outline__leading,
    :host ::ng-deep .rest-wrap .mat-mdc-form-field .mdc-notched-outline__notch,
    :host ::ng-deep .rest-wrap .mat-mdc-form-field .mdc-notched-outline__trailing { 
      border-color: var(--c-muted-200) !important; 
    }
    
    :host ::ng-deep .rest-wrap input.mat-mdc-input-element { 
      color: var(--c-text) !important; 
    }
    
    :host ::ng-deep .rest-wrap .mat-mdc-form-field .mat-mdc-form-field-icon-prefix .mat-icon { 
      color: var(--c-text) !important; 
      opacity:.8; 
    }
    
    :host ::ng-deep .rest-wrap .mat-mdc-form-field .mdc-floating-label { 
      color:#6b7280 !important; 
    }

    
    /* Card images */
    :host ::ng-deep .grid .card img[mat-card-image]{ 
      width:100% !important; 
      aspect-ratio:4/3 !important; 
      object-fit:cover !important; 
    }
  `]
})
export class RestaurantsComponent {
  restaurants: Restaurant[] = [];
  search = '';
  
  constructor(private api: RestaurantService) { 
    this.load(); 
  }

  load(){ 
    this.api.list({ search: this.search || undefined }).subscribe(rs => this.restaurants = rs); 
  }
}
