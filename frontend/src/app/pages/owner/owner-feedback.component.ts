import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  orderItems: string[];
  date: string;
  response?: string;
  replied: boolean;
}

@Component({
  selector: 'app-owner-feedback',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatTabsModule,
    RoleNavbarComponent
  ],
  template: `
    <app-role-navbar></app-role-navbar>
    <div class="feedback-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1><mat-icon>feedback</mat-icon> Customer Feedback</h1>
          <p class="subtitle">Manage reviews and ratings</p>
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Filter By</mat-label>
          <mat-select [(value)]="filterBy" (selectionChange)="filterReviews()">
            <mat-option value="all">All Reviews</mat-option>
            <mat-option value="5">5 Stars</mat-option>
            <mat-option value="4">4 Stars</mat-option>
            <mat-option value="3">3 Stars</mat-option>
            <mat-option value="2">2 Stars</mat-option>
            <mat-option value="1">1 Star</mat-option>
            <mat-option value="unreplied">Unreplied</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div *ngIf="loading" class="loading">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        <p>Loading feedback...</p>
      </div>

      <div *ngIf="!loading" class="content">
        <!-- Rating Summary -->
        <mat-card class="summary-card">
          <h2>Rating Summary</h2>
          <div class="rating-overview">
            <div class="overall-rating">
              <h1>4.5</h1>
              <div class="stars">
                <mat-icon *ngFor="let star of [1,2,3,4]">star</mat-icon>
                <mat-icon>star_half</mat-icon>
              </div>
              <p>Based on {{ filteredReviews.length }} reviews</p>
            </div>
            <div class="rating-breakdown">
              <div class="rating-row" *ngFor="let rating of [5,4,3,2,1]">
                <span>{{ rating }} <mat-icon>star</mat-icon></span>
                <div class="rating-bar">
                  <div class="bar-fill" [style.width.%]="getRatingPercentage(rating)"></div>
                </div>
                <span class="count">{{ getRatingCount(rating) }}</span>
              </div>
            </div>
          </div>
        </mat-card>

        <!-- Reviews List -->
        <div class="reviews-section">
          <h2>Customer Reviews ({{ filteredReviews.length }})</h2>
          
          <mat-card *ngFor="let review of filteredReviews" class="review-card">
            <div class="review-header">
              <div class="customer-info">
                <div class="avatar">{{ review.customerName.charAt(0) }}</div>
                <div>
                  <h3>{{ review.customerName }}</h3>
                  <p class="review-date">{{ review.date }}</p>
                </div>
              </div>
              <div class="rating-display">
                <mat-icon *ngFor="let star of getStarArray(review.rating)">star</mat-icon>
                <mat-icon *ngFor="let star of getEmptyStarArray(review.rating)">star_border</mat-icon>
              </div>
            </div>

            <div class="review-content">
              <p class="review-comment">{{ review.comment }}</p>
              <div class="order-items">
                <mat-chip *ngFor="let item of review.orderItems">{{ item }}</mat-chip>
              </div>
            </div>

            <div class="review-actions">
              <button mat-button (click)="toggleReply(review)" *ngIf="!review.replied">
                <mat-icon>reply</mat-icon>
                Reply to Review
              </button>
              <div *ngIf="review.replied && review.response" class="owner-response">
                <div class="response-header">
                  <mat-icon>storefront</mat-icon>
                  <strong>Owner Response:</strong>
                </div>
                <p>{{ review.response }}</p>
                <button mat-button color="primary" (click)="toggleReply(review)">
                  Edit Response
                </button>
              </div>
            </div>

            <div class="reply-form" *ngIf="replyingTo === review.id">
              <form [formGroup]="replyForm" (ngSubmit)="submitReply(review)">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Your Response</mat-label>
                  <textarea matInput formControlName="response" rows="3" 
                            placeholder="Thank the customer or address their concerns..."></textarea>
                </mat-form-field>
                <div class="form-actions">
                  <button mat-button type="button" (click)="cancelReply()">Cancel</button>
                  <button mat-raised-button color="primary" type="submit">Post Response</button>
                </div>
              </form>
            </div>
          </mat-card>

          <div *ngIf="filteredReviews.length === 0" class="empty-state">
            <mat-icon>rate_review</mat-icon>
            <h3>No Reviews Yet</h3>
            <p>Customer reviews will appear here</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feedback-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 700;
    }

    .page-header mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #6366f1;
    }

    .subtitle {
      color: #666;
      margin: 0;
    }

    .loading {
      text-align: center;
      padding: 60px;
    }

    .summary-card {
      padding: 24px !important;
      margin-bottom: 32px;
    }

    .summary-card h2 {
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .rating-overview {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 48px;
      align-items: center;
    }

    .overall-rating {
      text-align: center;
    }

    .overall-rating h1 {
      margin: 0 0 12px 0;
      font-size: 64px;
      font-weight: 700;
      color: #6366f1;
    }

    .stars {
      display: flex;
      justify-content: center;
      gap: 4px;
      margin-bottom: 12px;
    }

    .stars mat-icon {
      color: #fbbf24;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .overall-rating p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .rating-breakdown {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .rating-row > span:first-child {
      display: flex;
      align-items: center;
      gap: 4px;
      min-width: 60px;
      font-size: 14px;
      font-weight: 500;
    }

    .rating-row mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #fbbf24;
    }

    .rating-bar {
      flex: 1;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
      transition: width 0.5s;
    }

    .count {
      min-width: 40px;
      text-align: right;
      font-size: 14px;
      color: #666;
    }

    .reviews-section h2 {
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .review-card {
      padding: 24px !important;
      margin-bottom: 16px;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .customer-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
    }

    .customer-info h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .review-date {
      margin: 0;
      font-size: 13px;
      color: #666;
    }

    .rating-display {
      display: flex;
      gap: 4px;
    }

    .rating-display mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #fbbf24;
    }

    .review-content {
      margin-bottom: 16px;
    }

    .review-comment {
      margin: 0 0 12px 0;
      line-height: 1.6;
      color: #1a1a1a;
    }

    .order-items {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .review-actions button {
      margin-right: 8px;
    }

    .owner-response {
      background: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #6366f1;
      margin-top: 16px;
    }

    .response-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #6366f1;
    }

    .response-header mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .owner-response p {
      margin: 0 0 12px 0;
      color: #475569;
    }

    .reply-form {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .empty-state {
      text-align: center;
      padding: 80px 24px;
    }

    .empty-state mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #cbd5e1;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      color: #64748b;
    }

    .empty-state p {
      margin: 0;
      color: #94a3b8;
    }
  `]
})
export class OwnerFeedbackComponent implements OnInit {
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  loading = false;
  filterBy = 'all';
  replyingTo: number | null = null;
  replyForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.replyForm = this.fb.group({
      response: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.loading = true;
    // Mock data - replace with real API
    setTimeout(() => {
      this.reviews = [
        {
          id: 1,
          customerName: 'Rahul Sharma',
          rating: 5,
          comment: 'Amazing food! The Chicken Biryani was absolutely delicious. Will definitely order again.',
          orderItems: ['Chicken Biryani', 'Raita', 'Gulab Jamun'],
          date: '2 days ago',
          replied: true,
          response: 'Thank you so much for your kind words! We\'re delighted you enjoyed the biryani. Looking forward to serving you again!'
        },
        {
          id: 2,
          customerName: 'Priya Patel',
          rating: 4,
          comment: 'Good taste but delivery was a bit slow. Food arrived warm though.',
          orderItems: ['Paneer Tikka', 'Naan', 'Dal Makhani'],
          date: '3 days ago',
          replied: false
        },
        {
          id: 3,
          customerName: 'Amit Kumar',
          rating: 5,
          comment: 'Best restaurant in the area! Fresh ingredients and authentic flavors.',
          orderItems: ['Butter Chicken', 'Garlic Naan', 'Rice'],
          date: '5 days ago',
          replied: true,
          response: 'We appreciate your support! Fresh ingredients and authenticity are our priorities. Thank you!'
        },
        {
          id: 4,
          customerName: 'Sneha Reddy',
          rating: 3,
          comment: 'Food was okay, but portion sizes could be bigger for the price.',
          orderItems: ['Veg Biryani', 'Raita'],
          date: '1 week ago',
          replied: false
        },
        {
          id: 5,
          customerName: 'Vikram Singh',
          rating: 5,
          comment: 'Excellent service and packaging. Food was hot and fresh!',
          orderItems: ['Tandoori Chicken', 'Naan', 'Salad'],
          date: '1 week ago',
          replied: false
        }
      ];
      this.filteredReviews = [...this.reviews];
      this.loading = false;
    }, 800);
  }

  filterReviews() {
    if (this.filterBy === 'all') {
      this.filteredReviews = [...this.reviews];
    } else if (this.filterBy === 'unreplied') {
      this.filteredReviews = this.reviews.filter(r => !r.replied);
    } else {
      const rating = parseInt(this.filterBy);
      this.filteredReviews = this.reviews.filter(r => r.rating === rating);
    }
  }

  getRatingPercentage(rating: number): number {
    const count = this.reviews.filter(r => r.rating === rating).length;
    return (count / this.reviews.length) * 100;
  }

  getRatingCount(rating: number): number {
    return this.reviews.filter(r => r.rating === rating).length;
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  toggleReply(review: Review) {
    if (this.replyingTo === review.id) {
      this.replyingTo = null;
      this.replyForm.reset();
    } else {
      this.replyingTo = review.id;
      if (review.response) {
        this.replyForm.patchValue({ response: review.response });
      }
    }
  }

  cancelReply() {
    this.replyingTo = null;
    this.replyForm.reset();
  }

  submitReply(review: Review) {
    if (this.replyForm.valid) {
      review.response = this.replyForm.value.response;
      review.replied = true;
      alert('Response posted successfully!');
      this.cancelReply();
      // TODO: Call API to save response
    }
  }
}
