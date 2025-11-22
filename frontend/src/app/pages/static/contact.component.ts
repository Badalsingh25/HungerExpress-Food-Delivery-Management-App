import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, RouterModule, FormsModule],
  template: `
    <div class="static-page">
      <div class="hero-banner">
        <h1>Contact Us</h1>
        <p>We're here to help! Get in touch with us</p>
      </div>
      
      <div class="content-container">
        <div class="contact-grid">
          <div class="contact-info">
            <mat-card class="info-card">
              <mat-icon>email</mat-icon>
              <h3>Email</h3>
              <p>support@hungerexpress.com</p>
            </mat-card>

            <mat-card class="info-card">
              <mat-icon>phone</mat-icon>
              <h3>Phone</h3>
              <p>+1 (800) 123-4567</p>
            </mat-card>

            <mat-card class="info-card">
              <mat-icon>location_on</mat-icon>
              <h3>Address</h3>
              <p>123 Food Street<br>San Francisco, CA 94102</p>
            </mat-card>

            <mat-card class="info-card">
              <mat-icon>schedule</mat-icon>
              <h3>Support Hours</h3>
              <p>24/7 Available</p>
            </mat-card>
          </div>

          <div class="contact-form">
            <h2>Send us a message</h2>
            <form>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Name</mat-label>
                <input matInput placeholder="Your name" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" placeholder="your@email.com" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Subject</mat-label>
                <input matInput placeholder="How can we help?" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Message</mat-label>
                <textarea matInput rows="5" placeholder="Your message..."></textarea>
              </mat-form-field>

              <div class="form-actions">
                <button mat-flat-button color="primary" type="submit">
                  <mat-icon>send</mat-icon>
                  Send Message
                </button>
                <button mat-stroked-button routerLink="/" type="button">
                  Back to Home
                </button>
              </div>
            </form>
          </div>
        </div>
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
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 40px;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-card {
      padding: 25px;
      text-align: center;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.15);
      }

      mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: #ff6b6b;
        margin-bottom: 10px;
      }

      h3 {
        margin: 10px 0;
        color: #333;
        font-size: 1.1rem;
      }

      p {
        color: #666;
        margin: 0;
        line-height: 1.6;
      }
    }

    .contact-form {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);

      h2 {
        color: #ff6b6b;
        margin-top: 0;
        margin-bottom: 30px;
        font-size: 2rem;
      }

      .full-width {
        width: 100%;
        margin-bottom: 15px;
      }

      .form-actions {
        display: flex;
        gap: 15px;
        margin-top: 20px;

        button {
          flex: 1;
          height: 48px;
        }
      }
    }

    @media (max-width: 968px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }

      .hero-banner h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class ContactComponent {}
