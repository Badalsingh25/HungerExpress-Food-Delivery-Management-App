import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatOptionModule } from '@angular/material/core';
import { RestaurantService, Restaurant, Cuisine } from '../../core/services/restaurant.service';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    DecimalPipe,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatProgressBarModule,
    RoleNavbarComponent
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  q = '';
  results: Restaurant[] = [];
  cuisine?: Cuisine;
  minRating?: number;
  maxDeliveryFee?: number;
  sortBy = 'relevance';
  loading = false;
  
  cuisines: Cuisine[] = ['PIZZA', 'SUSHI', 'INDIAN', 'CHINESE', 'BURGERS', 'VEGAN', 'DESSERT', 'ITALIAN', 'MEXICAN'];
  popularCuisines: Cuisine[] = ['PIZZA', 'SUSHI', 'INDIAN', 'BURGERS'];
  
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  constructor(
    private api: RestaurantService,
    private cart: CartService,
    private router: Router
  ) {}
  
  ngOnInit() {
    // Set up debounced search
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.performSearch();
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onSearchInput() {
    this.searchSubject.next(this.q);
  }
  
  onFilterChange() {
    this.performSearch();
  }
  
  onSortChange() {
    this.sortResults();
  }
  
  private performSearch() {
    this.loading = true;
    this.api
      .list({
        search: this.q || undefined,
        cuisine: this.cuisine,
        minRating: this.minRating
      })
      .subscribe({
        next: (restaurants) => {
          this.results = this.filterByDeliveryFee(restaurants);
          this.sortResults();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
  
  private filterByDeliveryFee(restaurants: Restaurant[]): Restaurant[] {
    if (this.maxDeliveryFee === undefined) return restaurants;
    
    return restaurants.filter(r => {
      const fee = Number(r.deliveryFee) || 0;
      return fee <= this.maxDeliveryFee!;
    });
  }
  
  private sortResults() {
    if (!this.results.length) return;
    
    switch (this.sortBy) {
      case 'rating':
        this.results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'deliveryFee':
        this.results.sort((a, b) => (Number(a.deliveryFee) || 0) - (Number(b.deliveryFee) || 0));
        break;
      case 'name':
        this.results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // relevance
        // Keep original order for relevance
        break;
    }
  }
  
  // Template helper methods
  formatCuisine(cuisine: string): string {
    return cuisine.charAt(0) + cuisine.slice(1).toLowerCase();
  }
  
  getCuisineIcon(cuisine: Cuisine): string {
    const icons: Record<Cuisine, string> = {
      'PIZZA': 'local_pizza',
      'SUSHI': 'set_meal',
      'INDIAN': 'rice_bowl',
      'CHINESE': 'ramen_dining',
      'BURGERS': 'lunch_dining',
      'VEGAN': 'spa',
      'DESSERT': 'cake',
      'ITALIAN': 'restaurant',
      'MEXICAN': 'local_dining'
    };
    return icons[cuisine] || 'restaurant';
  }
  
  selectCuisine(cuisine: Cuisine) {
    this.cuisine = cuisine;
    this.performSearch();
  }
  
  clearSearch() {
    this.q = '';
    this.performSearch();
  }
  
  clearFilters() {
    this.cuisine = undefined;
    this.minRating = undefined;
    this.maxDeliveryFee = undefined;
    this.performSearch();
  }
  
  clearAll() {
    this.q = '';
    this.clearFilters();
  }
  
  hasActiveFilters(): boolean {
    return this.cuisine !== undefined || 
           this.minRating !== undefined || 
           this.maxDeliveryFee !== undefined;
  }
  
  viewMenu(restaurant: Restaurant) {
    this.router.navigate(['/user/menu'], { queryParams: { rid: restaurant.id } });
  }
  
  addToCart(restaurant: Restaurant) {
    this.cart.add({
      id: restaurant.id,
      name: restaurant.name,
      price: Number(restaurant.deliveryFee) || 0,
      imageUrl: restaurant.imageUrl
    });
  }
}

