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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

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
  isOnline: boolean;
}

@Component({
  selector: 'app-owner-restaurants',
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
    MatSlideToggleModule,
    RoleNavbarComponent
  ],
  template: `
    <app-role-navbar></app-role-navbar>
    <div class="restaurants-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1><mat-icon>store</mat-icon> My Restaurants</h1>
          <p class="subtitle">Manage all your restaurants ({{ restaurants.length }})</p>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="content-layout">
        <!-- LEFT: Restaurant List (Main Content) -->
        <div class="main-content">
          <div class="restaurants-grid">
            <mat-card *ngFor="let restaurant of restaurants" class="restaurant-card">
          <div class="restaurant-image">
            <img [src]="restaurant.imageUrl || 'https://placehold.co/400x200/4CAF50/FFFFFF?text=Restaurant'" 
                 alt="{{restaurant.name}}"
                 (error)="onRestaurantImageError($event)">
            <div class="status-badges">
              <span class="badge" [class.approved]="restaurant.approved" [class.pending]="!restaurant.approved">
                {{ restaurant.approved ? 'Approved' : 'Pending Approval' }}
              </span>
              <span class="badge active" *ngIf="restaurant.active">Active</span>
            </div>
          </div>
          <div class="restaurant-content">
            <div class="restaurant-header">
              <h3>{{ restaurant.name }}</h3>
              <div class="online-status-badge" [class.online]="restaurant.isOnline" [class.offline]="!restaurant.isOnline">
                <div class="status-dot"></div>
                <span>{{ restaurant.isOnline ? 'ONLINE' : 'OFFLINE' }}</span>
              </div>
            </div>
            <p class="description">{{ restaurant.description }}</p>
            <div class="restaurant-meta">
              <span><mat-icon>location_on</mat-icon> {{ restaurant.city }}</span>
              <span><mat-icon>restaurant_menu</mat-icon> {{ restaurant.cuisine }}</span>
              <span><mat-icon>star</mat-icon> {{ restaurant.rating }}</span>
            </div>
            
            <!-- Online/Offline Toggle -->
            <div class="online-toggle-section">
              <div class="toggle-info">
                <mat-icon>{{ restaurant.isOnline ? 'store' : 'store_mall_directory' }}</mat-icon>
                <div>
                  <strong>{{ restaurant.isOnline ? 'Accepting Orders' : 'Not Accepting Orders' }}</strong>
                  <p>{{ restaurant.isOnline ? 'Customers can order from your restaurant' : 'Restaurant hidden from customers' }}</p>
                </div>
              </div>
              <mat-slide-toggle 
                [checked]="restaurant.isOnline" 
                (change)="toggleOnlineStatus(restaurant, $event.checked)"
                color="primary">
              </mat-slide-toggle>
            </div>

            <div class="restaurant-actions">
              <button mat-raised-button color="primary" (click)="selectRestaurant(restaurant)">
                <mat-icon>dashboard</mat-icon>
                Manage
              </button>
              <button mat-button (click)="editRestaurant(restaurant)">
                <mat-icon>edit</mat-icon>
                Edit
              </button>
            </div>
          </div>
            </mat-card>

            <mat-card *ngIf="!loading && restaurants.length === 0" class="empty-state">
              <mat-icon>store</mat-icon>
              <h3>No Restaurants Yet</h3>
              <p>Create your first restaurant using the form on the right →</p>
            </mat-card>

            <mat-card *ngIf="loading" class="empty-state">
              <mat-icon>hourglass_empty</mat-icon>
              <h3>Loading your restaurants...</h3>
              <p>Please wait</p>
            </mat-card>
          </div>
        </div>

        <!-- RIGHT: Add/Edit Restaurant Form (Sidebar) -->
        <div class="sidebar-content">
          <mat-card class="restaurant-form-card">
            <div class="form-header">
              <h2>{{ editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant' }}</h2>
              <button mat-icon-button (click)="cancelEdit()" *ngIf="editingRestaurant" class="close-btn">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form [formGroup]="restaurantForm" (ngSubmit)="saveRestaurant()">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Restaurant Name</mat-label>
                  <input matInput formControlName="name" placeholder="e.g., Spice Garden">
                  <mat-icon matPrefix>restaurant</mat-icon>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Cuisine Type</mat-label>
                  <mat-select formControlName="cuisine">
                <mat-option value="INDIAN">Indian</mat-option>
                <mat-option value="CHINESE">Chinese</mat-option>
                <mat-option value="ITALIAN">Italian</mat-option>
                <mat-option value="MEXICAN">Mexican</mat-option>
                <mat-option value="AMERICAN">American</mat-option>
                <mat-option value="THAI">Thai</mat-option>
                <mat-option value="JAPANESE">Japanese</mat-option>
                <mat-option value="KOREAN">Korean</mat-option>
                <mat-option value="PIZZA">Pizza</mat-option>
                <mat-option value="BURGERS">Burgers</mat-option>
                <mat-option value="SUSHI">Sushi</mat-option>
                <mat-option value="DESSERT">Dessert</mat-option>
                <mat-option value="VEGAN">Vegan</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Describe your restaurant"></textarea>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone" placeholder="Restaurant phone">
              <mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="contact@restaurant.com">
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Address</mat-label>
            <input matInput formControlName="address" placeholder="Restaurant address">
            <mat-icon matPrefix>location_on</mat-icon>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>City</mat-label>
              <input matInput formControlName="city">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>State</mat-label>
              <input matInput formControlName="state">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Postal Code</mat-label>
              <input matInput formControlName="postalCode">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Opening Time</mat-label>
              <input matInput formControlName="openingTime" type="time">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Closing Time</mat-label>
              <input matInput formControlName="closingTime" type="time">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Specialty</mat-label>
              <input matInput formControlName="specialty" placeholder="e.g., Famous for Biryani">
            </mat-form-field>
          </div>

                <div class="form-actions">
                  <button mat-button type="button" (click)="cancelEdit()" *ngIf="editingRestaurant">Cancel</button>
                  <button mat-raised-button color="primary" type="submit" class="full-width-btn">
                    <mat-icon>{{ editingRestaurant ? 'save' : 'add_business' }}</mat-icon>
                    {{ editingRestaurant ? 'Update Restaurant' : 'Create Restaurant' }}
                  </button>
                </div>
            </form>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .restaurants-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header-content h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
    }

    .header-content h1 mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #6366f1;
    }

    .subtitle {
      color: #666;
      margin: 0;
    }

    .content-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 24px;
      align-items: start;
    }

    .main-content {
      min-width: 0;
    }

    .sidebar-content {
      position: sticky;
      top: 24px;
    }

    .restaurant-form-card {
      padding: 24px;
      border: 2px solid #6366f1;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .form-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #6366f1;
    }

    .close-btn {
      color: #666;
    }

    .restaurant-form-card h2 {
      margin: 0 0 24px 0;
      font-size: 24px;
      font-weight: 600;
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

    .restaurants-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
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

    .restaurant-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .restaurant-content h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .online-status-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      transition: all 0.3s;
    }

    .online-status-badge.online {
      background: #d1fae5;
      color: #059669;
    }

    .online-status-badge.offline {
      background: #fee2e2;
      color: #dc2626;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .online-status-badge.online .status-dot {
      background: #10b981;
    }

    .online-status-badge.offline .status-dot {
      background: #ef4444;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    .online-toggle-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      margin: 16px 0;
      border: 2px solid #e2e8f0;
      transition: all 0.3s;
    }

    .online-toggle-section:hover {
      border-color: #6366f1;
      background: #f1f5f9;
    }

    .toggle-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .toggle-info mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #6366f1;
    }

    .toggle-info strong {
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
      color: #1a1a1a;
    }

    .toggle-info p {
      margin: 0;
      font-size: 12px;
      color: #666;
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

    .full-width-btn {
      width: 100%;
    }

    .form-row {
      margin-bottom: 16px;
    }

    @media (max-width: 1200px) {
      .content-layout {
        grid-template-columns: 1fr;
      }

      .sidebar-content {
        position: relative;
        top: 0;
      }
    }
  `]
})
export class OwnerRestaurantsComponent implements OnInit {
  restaurants: RestaurantSummary[] = [];
  loading: boolean = true;
  restaurantForm: FormGroup;
  editingRestaurant: RestaurantSummary | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.restaurantForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      cuisine: ['INDIAN', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      postalCode: [''],
      gstNumber: [''],
      fssaiLicense: [''],
      businessPan: [''],
      openingTime: ['09:00'],
      closingTime: ['22:00'],
      specialty: [''],
      tags: ['']
    });
  }

  ngOnInit() {
    this.loadRestaurants();
  }

  loadRestaurants() {
    console.log('[OwnerRestaurants] Loading restaurants...');
    this.loading = true;
    this.http.get<RestaurantSummary[]>('/api/owner/restaurants').subscribe({
      next: (restaurants) => {
        console.log('[OwnerRestaurants] Restaurants loaded:', restaurants);
        this.restaurants = restaurants.map(r => ({
          id: r.id,
          name: r.name,
          description: r.description || '',
          imageUrl: r.imageUrl || 'https://placehold.co/400x200/4CAF50/FFFFFF?text=' + encodeURIComponent(r.name),
          logoUrl: '',
          address: r.address || '',
          city: r.city || '',
          phone: r.phone || '',
          cuisine: r.cuisine,
          rating: r.rating || 0.0,
          approved: r.approved || false,
          active: r.active || true,
          profileCompleted: true,
          isOnline: r.isOnline || false
        }));
        console.log('[OwnerRestaurants] Restaurants count:', this.restaurants.length);
        this.loading = false;
      },
      error: (err) => {
        console.error('[OwnerRestaurants] Failed to load restaurants:', err);
        console.error('[OwnerRestaurants] Error details:', err.error);
        console.error('[OwnerRestaurants] Error status:', err.status);
        this.loading = false;
        
        // Only show alert if we have no restaurants yet (initial load failure)
        if (this.restaurants.length === 0) {
          alert('Failed to load restaurants. Please refresh the page.');
        } else {
          // Silent fail if we already have restaurants loaded
          console.warn('[OwnerRestaurants] Failed to reload restaurants, but showing cached data');
        }
      }
    });
  }

  saveRestaurant() {
    if (this.restaurantForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.editingRestaurant) {
      // Update existing restaurant
      console.log('[OwnerRestaurants] Updating restaurant:', this.editingRestaurant.id);
      this.http.put<RestaurantSummary>(
        `/api/owner/profile/restaurant/${this.editingRestaurant.id}`,
        this.restaurantForm.value
      ).subscribe({
        next: (response) => {
          console.log('[OwnerRestaurants] Restaurant updated:', response);
          
          // Update the restaurant in the list immediately
          const index = this.restaurants.findIndex(r => r.id === this.editingRestaurant!.id);
          if (index >= 0) {
            this.restaurants[index] = {
              ...this.restaurants[index],
              name: response.name,
              description: response.description,
              imageUrl: response.imageUrl,
              logoUrl: response.logoUrl,
              address: response.address,
              city: response.city,
              phone: response.phone,
              cuisine: response.cuisine,
              rating: response.rating || this.restaurants[index].rating,
              approved: response.approved,
              active: response.active,
              profileCompleted: response.profileCompleted,
              isOnline: response.isOnline
            };
            this.restaurants = [...this.restaurants]; // Trigger change detection
          }
          
          alert('Restaurant updated successfully!');
          this.cancelEdit();
          
          // Try to reload from server to sync
          setTimeout(() => {
            this.loadRestaurants();
          }, 500);
        },
        error: (err) => {
          console.error('[OwnerRestaurants] Failed to update restaurant:', err);
          console.error('[OwnerRestaurants] Error details:', err.error);
          alert('Failed to update restaurant. Please try again.');
        }
      });
    } else {
      // Create new restaurant
      console.log('[OwnerRestaurants] Creating restaurant:', this.restaurantForm.value);
      this.http.post<RestaurantSummary>('/api/owner/profile/restaurant', this.restaurantForm.value).subscribe({
        next: (response) => {
          console.log('[OwnerRestaurants] Restaurant created:', response);
          
          // Add the new restaurant to the list immediately
          const newRestaurant: RestaurantSummary = {
            id: response.id,
            name: response.name,
            description: response.description,
            imageUrl: response.imageUrl || 'https://placehold.co/400x200/4CAF50/FFFFFF?text=Restaurant',
            logoUrl: response.logoUrl,
            address: response.address,
            city: response.city,
            phone: response.phone,
            cuisine: response.cuisine,
            rating: response.rating || 0.0,
            approved: response.approved,
            active: response.active,
            profileCompleted: response.profileCompleted,
            isOnline: response.isOnline || false
          };
          
          this.restaurants = [...this.restaurants, newRestaurant];
          console.log('[OwnerRestaurants] Restaurant added to list:', newRestaurant);
          
          alert('Restaurant created successfully!');
          this.restaurantForm.reset({ cuisine: 'INDIAN', openingTime: '09:00', closingTime: '22:00' });
          
          // Try to reload from server to sync, but don't fail if it doesn't work
          setTimeout(() => {
            this.loadRestaurants();
          }, 500);
        },
        error: (err) => {
          console.error('[OwnerRestaurants] Failed to create restaurant:', err);
          console.error('[OwnerRestaurants] Error details:', err.error);
          alert('Failed to create restaurant. Please try again.');
        }
      });
    }
  }

  selectRestaurant(restaurant: RestaurantSummary) {
    localStorage.setItem('selectedRestaurantId', restaurant.id.toString());
    localStorage.setItem('selectedRestaurantName', restaurant.name);
    localStorage.setItem('he.owner.lastRid', restaurant.id.toString());
    alert(`Selected restaurant: ${restaurant.name}\nYou can now manage this restaurant.`);
    window.location.href = '/owner/menu';
  }

  editRestaurant(restaurant: RestaurantSummary) {
    this.editingRestaurant = restaurant;
    
    this.restaurantForm.patchValue({
      name: restaurant.name,
      description: restaurant.description,
      cuisine: restaurant.cuisine,
      phone: restaurant.phone,
      email: '',
      address: restaurant.address,
      city: restaurant.city,
      state: '',
      postalCode: '',
      gstNumber: '',
      fssaiLicense: '',
      businessPan: '',
      openingTime: '09:00',
      closingTime: '22:00',
      specialty: '',
      tags: ''
    });
    
    setTimeout(() => {
      document.querySelector('.restaurant-form-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  cancelEdit() {
    this.editingRestaurant = null;
    this.restaurantForm.reset({ cuisine: 'INDIAN', openingTime: '09:00', closingTime: '22:00' });
  }

  toggleOnlineStatus(restaurant: RestaurantSummary, newStatus: boolean) {
    // Optimistically update UI
    const previousStatus = restaurant.isOnline;
    restaurant.isOnline = newStatus;

    // Call API to persist status
    this.http.post<{success: boolean, isOnline: boolean, message: string}>(
      `/api/owner/profile/restaurant/${restaurant.id}/toggle-online`,
      {}
    ).subscribe({
      next: (response) => {
        // Update with server response
        restaurant.isOnline = response.isOnline;
        alert(response.message);
        console.log(`[Restaurant] ${restaurant.name} is now ${response.isOnline ? 'ONLINE' : 'OFFLINE'}`);
      },
      error: (err) => {
        // Revert on error
        restaurant.isOnline = previousStatus;
        console.error('Failed to toggle online status:', err);
        alert('Failed to change status. Please try again.');
      }
    });
  }

  onRestaurantImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://placehold.co/400x200/4CAF50/FFFFFF?text=Restaurant';
  }
}
