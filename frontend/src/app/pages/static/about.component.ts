import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="static-page">
      <div class="hero-banner">
        <h1>About HungerExpress</h1>
        <p>Your favorite food, delivered fast and fresh</p>
      </div>
      
      <div class="content-container">
        <section class="section">
          <h2>Our Story</h2>
          <p>
            Founded in 2020, HungerExpress has revolutionized the way people order food online.
            We connect thousands of customers with their favorite restaurants, delivering happiness one meal at a time.
          </p>
        </section>

        <section class="section">
          <h2>Our Mission</h2>
          <p>
            To make quality food accessible to everyone by providing a seamless, reliable, and delightful food delivery experience.
            We believe everyone deserves great food at their doorstep.
          </p>
        </section>

        <section class="section">
          <h2>Why Choose Us?</h2>
          <div class="features-grid">
            <div class="feature">
              <mat-icon>flash_on</mat-icon>
              <h3>Fast Delivery</h3>
              <p>Average delivery time of just 15 minutes</p>
            </div>
            <div class="feature">
              <mat-icon>restaurant</mat-icon>
              <h3>5000+ Restaurants</h3>
              <p>Wide variety of cuisines to choose from</p>
            </div>
            <div class="feature">
              <mat-icon>verified</mat-icon>
              <h3>Quality Assured</h3>
              <p>Every order checked for quality and freshness</p>
            </div>
            <div class="feature">
              <mat-icon>support_agent</mat-icon>
              <h3>24/7 Support</h3>
              <p>Always here to help you</p>
            </div>
          </div>
        </section>

        <section class="cta-section">
          <button mat-flat-button color="primary" routerLink="/">
            <mat-icon>arrow_back</mat-icon>
            Back to Home
          </button>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .static-page {
      min-height: 100vh;
      background: #f5f5f5;
    }

    .hero-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 100px 20px 60px;
      text-align: center;

      h1 {
        font-size: 3rem;
        margin: 0 0 1rem;
        font-weight: 800;
      }

      p {
        font-size: 1.2rem;
        opacity: 0.9;
      }
    }

    .content-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .section {
      background: white;
      padding: 40px;
      margin-bottom: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);

      h2 {
        color: #ff6b6b;
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 2rem;
      }

      p {
        color: #666;
        line-height: 1.8;
        font-size: 1.1rem;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 30px;
      margin-top: 30px;
    }

    .feature {
      text-align: center;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #ff6b6b;
        margin-bottom: 15px;
      }

      h3 {
        color: #333;
        margin: 10px 0;
        font-size: 1.2rem;
      }

      p {
        color: #666;
        font-size: 0.95rem;
      }
    }

    .cta-section {
      text-align: center;
      margin-top: 40px;

      button {
        padding: 0 30px;
        height: 48px;
        font-size: 1.1rem;
      }
    }

    @media (max-width: 768px) {
      .hero-banner h1 {
        font-size: 2rem;
      }

      .section {
        padding: 25px;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AboutComponent {}
