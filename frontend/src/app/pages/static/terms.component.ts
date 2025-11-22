import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="static-page">
      <div class="hero-banner">
        <h1>Terms & Conditions</h1>
        <p>Please read these terms carefully before using our service</p>
      </div>
      
      <div class="content-container">
        <section class="section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using HungerExpress, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section class="section">
          <h2>2. Use of Service</h2>
          <p>
            Our service allows you to order food from partner restaurants. You must be at least 18 years old to use this service.
            You are responsible for maintaining the confidentiality of your account and password.
          </p>
        </section>

        <section class="section">
          <h2>3. Orders and Payments</h2>
          <p>
            All orders are subject to acceptance and availability. Prices are as displayed on the platform at the time of ordering.
            Payment must be made at the time of order placement through our secure payment gateway.
          </p>
        </section>

        <section class="section">
          <h2>4. Delivery</h2>
          <p>
            Delivery times are estimates and may vary based on location, traffic, and restaurant preparation time.
            We strive to deliver within the estimated time frame but cannot guarantee exact delivery times.
          </p>
        </section>

        <section class="section">
          <h2>5. Cancellation and Refunds</h2>
          <p>
            Orders can be cancelled within 2 minutes of placement for a full refund.
            After this period, cancellation is subject to restaurant and delivery partner approval.
          </p>
        </section>

        <section class="section">
          <h2>6. User Conduct</h2>
          <p>
            Users must not misuse the platform, provide false information, or engage in fraudulent activities.
            We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section class="section">
          <h2>7. Privacy</h2>
          <p>
            Your use of HungerExpress is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
          </p>
        </section>

        <section class="section">
          <h2>8. Limitation of Liability</h2>
          <p>
            HungerExpress acts as an intermediary between customers and restaurants.
            We are not liable for food quality, preparation, or any health-related issues arising from restaurant-prepared food.
          </p>
        </section>

        <section class="section">
          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
            Your continued use of the service constitutes acceptance of the modified terms.
          </p>
        </section>

        <section class="cta-section">
          <p class="last-updated">Last Updated: October 26, 2025</p>
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
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .section {
      background: white;
      padding: 35px;
      margin-bottom: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);

      h2 {
        color: #ff6b6b;
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 1.5rem;
      }

      p {
        color: #666;
        line-height: 1.8;
        font-size: 1rem;
        margin: 0;
      }
    }

    .cta-section {
      text-align: center;
      margin-top: 40px;

      .last-updated {
        color: #999;
        font-style: italic;
        margin-bottom: 20px;
      }

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
    }
  `]
})
export class TermsComponent {}
