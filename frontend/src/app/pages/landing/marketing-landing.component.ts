import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RestaurantService, Restaurant } from '../../core/services/restaurant.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-marketing-landing',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    NgFor
  ],
  templateUrl: './marketing-landing.component.html',
  styleUrls: ['./marketing-landing.component.scss']
})
export class MarketingLandingComponent implements OnInit {
  featuredRestaurants: Restaurant[] = [];

  constructor(
    private router: Router,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit() {
    this.loadFeaturedRestaurants();
  }

  loadFeaturedRestaurants() {
    this.restaurantService.list({}).subscribe(restaurants => {
      // Take top 6 restaurants as featured
      this.featuredRestaurants = restaurants.slice(0, 6);
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  goToRestaurant(restaurantId: number) {
    this.router.navigate(['/restaurants']);
  }

  scrollToRestaurants() {
    const element = document.getElementById('restaurants');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
