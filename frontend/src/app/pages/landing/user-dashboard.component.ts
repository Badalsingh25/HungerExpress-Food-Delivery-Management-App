import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { RoleService } from '../../core/services/role.service';
import { RestaurantService, Restaurant } from '../../core/services/restaurant.service';
import { CartService } from '../../core/services/cart.service';
import { OrdersService, Order } from '../../core/services/orders.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    NgFor,
    NgIf,
    DecimalPipe,
    DatePipe,
    RoleNavbarComponent
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  userName = '';
  userProfilePicture = '';
  isOnline = false;
  recentOrders: Order[] = [];
  popularRestaurants: Restaurant[] = [];

  private authService = inject(AuthService);
  private roleService = inject(RoleService);
  private cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private router: Router,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadRecentOrders();
    this.loadPopularRestaurants();
  }

  loadUserData() {
    this.authService.me().subscribe(user => {
      if (user) {
        this.userName = user.fullName || user.email?.split('@')[0] || 'User';
        // Use UI Avatars - more reliable
        const initial = this.userName.charAt(0).toUpperCase();
        this.userProfilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.userName)}&size=100&background=667eea&color=fff`;
        this.isOnline = true;
        this.cdr.detectChanges();
      }
    });
  }

  loadRecentOrders() {
    this.ordersService.list().subscribe(orders => {
      // Get the most recent 5 orders
      this.recentOrders = orders.slice(0, 5);
      this.cdr.detectChanges();
    });
  }

  loadPopularRestaurants() {
    this.restaurantService.list({}).subscribe(restaurants => {
      this.popularRestaurants = restaurants.slice(0, 6);
      this.cdr.detectChanges();
    });
  }




  getOrderIcon(status: string): string {
    switch(status.toLowerCase()) {
      case 'delivered': return 'check_circle';
      case 'preparing': return 'restaurant';
      case 'out_for_delivery': return 'local_shipping';
      case 'cancelled': return 'cancel';
      default: return 'receipt';
    }
  }

  // Navigation methods
  goToRestaurants() {
    this.router.navigate(['/user/restaurants']);
  }

  goToOrders() {
    this.router.navigate(['/user/orders']);
  }

  goToProfile() {
    this.router.navigate(['/user/profile']);
  }

  goToCart() {
    this.router.navigate(['/user/cart']);
  }

  trackOrder(orderId: number) {
    this.router.navigate(['/user/orders/track'], { queryParams: { id: orderId } });
  }

  reorder(orderId: number) {
    this.router.navigate(['/user/restaurants']);
  }

  orderFromRestaurant(restaurantId: number) {
    this.router.navigate(['/user/menu'], { queryParams: { rid: restaurantId } });
  }
}
