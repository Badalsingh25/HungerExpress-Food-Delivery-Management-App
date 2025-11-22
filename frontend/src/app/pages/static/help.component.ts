import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatExpansionModule, RouterModule],
  template: `
    <div class="static-page">
      <div class="hero-banner">
        <h1>Help Center</h1>
        <p>Find answers to commonly asked questions</p>
      </div>
      
      <div class="content-container">
        <section class="section">
          <h2>Frequently Asked Questions</h2>

          <mat-accordion>
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>help_outline</mat-icon>
                  How do I place an order?
                </mat-panel-title>
              </mat-expansion-panel-header>
              <p>
                Simply browse restaurants, select items from the menu, add them to your cart, and proceed to checkout.
                Choose your payment method and confirm your order. You'll receive a confirmation and can track your delivery in real-time.
              </p>
            </mat-expansion-panel>

            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>payment</mat-icon>
                  What payment methods do you accept?
                </mat-panel-title>
              </mat-expansion-panel-header>
              <p>
                We accept all major credit/debit cards, digital wallets, UPI, net banking, and cash on delivery (where available).
                All online payments are processed securely through our payment gateway.
              </p>
            </mat-expansion-panel>

            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>local_shipping</mat-icon>
                  How long does delivery take?
                </mat-panel-title>
              </mat-expansion-panel-header>
              <p>
                Average delivery time is 15-45 minutes depending on your location, restaurant preparation time, and traffic conditions.
                You can track your order in real-time from the app.
              </p>
            </mat-expansion-panel>

            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>cancel</mat-icon>
                  Can I cancel my order?
                </mat-panel-title>
              </mat-expansion-panel-header>
              <p>
                Yes, you can cancel within 2 minutes of placing the order for a full refund.
                After this window, cancellation depends on the restaurant and delivery partner's discretion.
              </p>
            </mat-expansion-panel>

            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>sync</mat-icon>
                  What is your refund policy?
                </mat-panel-title>
              </mat-expansion-panel-header>
              <p>
                Refunds are processed for cancelled orders, quality issues, or missing items.
                Refund timelines vary by payment method: UPI/wallet (instant to 1 day), cards (5-7 business days).
              </p>
            </mat-expansion-panel>

            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>location_on</mat-icon>
                  How do I change my delivery address?
                </mat-panel-title>
              </mat-expansion-panel-header>
              <p>
                You can update your delivery address from your profile settings before placing an order.
                Once an order is placed, the address cannot be changed.
              </p>
            </mat-expansion-panel>

            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>restaurant</mat-icon>
                  How do I become a partner restaurant?
                </mat-panel-title>
              </mat-expansion-panel-header>
              <p>
                Visit our "Partner With Us" page and fill out the registration form.
                Our team will review your application and contact you within 2-3 business days.
              </p>
            </mat-expansion-panel>

            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>delivery_dining</mat-icon>
                  How can I become a delivery partner?
                </mat-panel-title>
              </mat-expansion-panel-header>
              <p>
                Download our delivery partner app, complete the registration with required documents (license, vehicle papers),
                and attend a brief orientation. You can start delivering once verified.
              </p>
            </mat-expansion-panel>
          </mat-accordion>
        </section>

        <section class="contact-section">
          <h2>Still need help?</h2>
          <p>Contact our 24/7 support team</p>
          <div class="contact-buttons">
            <button mat-flat-button color="primary" routerLink="/contact">
              <mat-icon>email</mat-icon>
              Contact Support
            </button>
            <button mat-stroked-button routerLink="/">
              Back to Home
            </button>
          </div>
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
      padding: 40px;
      margin-bottom: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);

      h2 {
        color: #ff6b6b;
        margin-top: 0;
        margin-bottom: 25px;
        font-size: 2rem;
      }

      mat-accordion {
        mat-expansion-panel {
          margin-bottom: 10px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);

          mat-panel-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            color: #333;

            mat-icon {
              color: #ff6b6b;
            }
          }

          p {
            color: #666;
            line-height: 1.8;
            padding: 10px 0;
          }
        }
      }
    }

    .contact-section {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;

      h2 {
        color: #ff6b6b;
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 2rem;
      }

      p {
        color: #666;
        font-size: 1.1rem;
        margin-bottom: 25px;
      }

      .contact-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;

        button {
          height: 48px;
          padding: 0 30px;
        }
      }
    }

    @media (max-width: 768px) {
      .hero-banner h1 {
        font-size: 2rem;
      }

      .section, .contact-section {
        padding: 25px;
      }

      .contact-buttons {
        flex-direction: column;
        
        button {
          width: 100%;
        }
      }
    }
  `]
})
export class HelpComponent {}
