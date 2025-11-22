import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';
import { CouponsService } from '../../core/services/coupons.service';
import { OrdersService } from '../../core/services/orders.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NgFor, DecimalPipe, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatRadioModule, RoleNavbarComponent],
  template: `
    <app-role-navbar></app-role-navbar>
    <div style="max-width:1100px;margin:24px auto;padding:12px 16px;display:grid;grid-template-columns:2fr 0.9fr;gap:24px;background:#f3f4f6;align-items:start">
      <mat-card style="padding:16px;background:#ffffff;border:1px solid #e5e7eb;box-shadow:0 6px 24px rgba(0,0,0,.06);border-radius:12px">
        <form [formGroup]="form" (ngSubmit)="makePayment()" style="display:block">
          <h2 class="he-section-title" style="margin:0 0 8px;color:#1f2937">Order Confirmation</h2>
          <div style="display:grid;gap:12px">
            <mat-card style="padding:12px;background:#ffffff;border:1px solid #ffcdd2;border-radius:10px">
              <mat-radio-group [(ngModel)]="payMethod" [ngModelOptions]="{standalone:true}" name="payMethod" (change)="onPayMethodChange()" style="display:grid;gap:12px">
                <mat-radio-button value="credit" style="display:flex;align-items:center;gap:10px;color:#1f2937">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="mc" style="height:26px"/>
                  <span>Credit card</span>
                </mat-radio-button>
                <mat-radio-button value="debit" style="display:flex;align-items:center;gap:10px;color:#1f2937">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="visa" style="height:26px"/>
                  <span>Debit card</span>
                </mat-radio-button>
                <mat-radio-button value="upi" style="display:flex;align-items:center;gap:10px;color:#1f2937">
                  <img src="/onlinepay.jpg" alt="online pay" style="height:26px" onerror="this.onerror=null;this.src='/upi.png'"/>
                  <span>Online Pay</span>
                </mat-radio-button>
              </mat-radio-group>
            </mat-card>

            <!-- Card details -->
            <div *ngIf="payMethod==='credit' || payMethod==='debit'" style="display:grid;gap:12px;background:#ffffff;border:1px solid #e8eaf0;border-radius:10px;padding:12px">
              <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px">
                <mat-form-field appearance="outline"><mat-label>Card Number</mat-label><input matInput formControlName="cardNumber" /></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Expiry (MM/YY)</mat-label><input matInput formControlName="cardExpiry" /></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>CVV</mat-label><input matInput type="password" maxlength="4" formControlName="cardCvv" /></mat-form-field>
              </div>
              <mat-form-field appearance="outline"><mat-label>Name on Card</mat-label><input matInput formControlName="cardName" /></mat-form-field>
            </div>

            <!-- UPI details -->
            <div *ngIf="payMethod==='upi'" style="display:grid;gap:12px;background:#ffffff;border:1px solid #e8eaf0;border-radius:10px;padding:12px">
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button type="button" mat-stroked-button [class.active]="upiProvider==='phonepe'" (click)="upiProvider='phonepe'">
                  <img src="/phonepay.png" alt="phonepe" style="height:22px;margin-right:6px;object-fit:contain"/> PhonePe
                </button>
                <button type="button" mat-stroked-button [class.active]="upiProvider==='gpay'" (click)="upiProvider='gpay'">
                  <img src="/gpay.png" alt="gpay" style="height:22px;margin-right:6px;object-fit:contain"/> GPay
                </button>
                <button type="button" mat-stroked-button [class.active]="upiProvider==='navi'" (click)="upiProvider='navi'">
                  <img src="/navi.png" alt="navi" style="height:22px;margin-right:6px;object-fit:contain"/> Navi
                </button>
                <button type="button" mat-stroked-button [class.active]="upiProvider==='other'" (click)="upiProvider='other'">
                  <img src="/upi.png" alt="upi" style="height:22px;margin-right:6px;object-fit:contain"/> Other
                </button>
              </div>
              <mat-form-field appearance="outline"><mat-label>UPI ID (VPA)</mat-label><input matInput formControlName="vpa" placeholder="name@bank" /></mat-form-field>
            </div>
          </div>

          <h3 style="margin-top:16px;color:#1f2937">Delivery Address</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <mat-form-field appearance="outline"><mat-label>Name</mat-label><input matInput formControlName="name" required /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput formControlName="phone" required /></mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full"><mat-label>Address Line 1</mat-label><input matInput formControlName="addr1" required /></mat-form-field>
          <mat-form-field appearance="outline" class="full"><mat-label>Address Line 2</mat-label><input matInput formControlName="addr2" /></mat-form-field>
          <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px">
            <mat-form-field appearance="outline"><mat-label>City</mat-label><input matInput formControlName="city" required /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>State</mat-label><input matInput formControlName="state" required /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Pincode</mat-label><input matInput formControlName="zip" required /></mat-form-field>
          </div>
          <div style="display:flex;gap:8px;align-items:center;margin:8px 0">
            <mat-form-field appearance="outline" style="flex:1">
              <mat-label>Coupon Code</mat-label>
              <input matInput [(ngModel)]="couponCode" [ngModelOptions]="{standalone:true}" name="couponCode" />
            </mat-form-field>
            <button mat-stroked-button type="button" (click)="applyCoupon()">Apply</button>
          </div>
          <button mat-flat-button type="submit" [disabled]="form.invalid || cart.subtotal()===0 || isProcessing" style="background:#e53935;color:#fff">
            {{ isProcessing ? 'Processing...' : 'Make a payment' }}
          </button>
        </form>
      </mat-card>

      <mat-card style="background:#ffffff;border:1px solid #e5e7eb;padding:12px;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.06)">
        <h3 style="margin:0 0 6px;color:#b71c1c">Order Summary</h3>
        <div *ngFor="let it of cart.items" style="display:flex;justify-content:space-between;font-size:13px">
          <span>{{ it.name }} × {{ it.qty }}</span>
          <span>₹{{ it.qty * it.price | number:'1.0-2' }}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-weight:700;margin-top:6px">
          <span>Subtotal</span>
          <span>₹{{ cart.subtotal() | number:'1.0-2' }}</span>
        </div>
        <div *ngIf="discount > 0" style="display:flex;justify-content:space-between;margin-top:4px;color:#2e7d32;font-size:13px">
          <span>Discount ({{ appliedCode }})</span>
          <span>-₹{{ discount | number:'1.0-2' }}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-weight:700;margin-top:6px">
          <span>Total</span>
          <span>₹{{ total() | number:'1.0-2' }}</span>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-raised-button.mat-warn, :host ::ng-deep .mat-mdc-unelevated-button.mat-warn { background:#e53935 }
    button.active { border-color:#e53935 !important; color:#e53935 !important }

    /* Ensure inputs are readable on light background */
    :host ::ng-deep .mat-mdc-form-field .mdc-text-field { background:#fff !important; }
    :host ::ng-deep input.mat-mdc-input-element { color:#111827 !important; caret-color:#111827; }
    :host ::ng-deep input.mat-mdc-input-element::placeholder { color:#6b7280 !important; opacity:1; }
    :host ::ng-deep .mat-mdc-form-field .mdc-floating-label { color:#374151 !important; }
  `]
})
export class CheckoutComponent implements OnInit {
  form: FormGroup;
  couponCode = '';
  appliedCode = '';
  discount = 0;
  payMethod: 'credit'|'debit'|'upi' = 'credit';
  upiProvider: 'phonepe'|'gpay'|'navi'|'other' = 'phonepe';
  isProcessing = false;
  constructor(private fb: FormBuilder, public cart: CartService, private router: Router, private coupons: CouponsService, private orders: OrdersService, private http: HttpClient) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      addr1: ['', Validators.required],
      addr2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      cardNumber: [''],
      cardName: [''],
      cardExpiry: [''],
      cardCvv: [''],
      vpa: ['']
    });
  }

  ngOnInit(){
    // Set validators after initial render to avoid ExpressionChangedAfterItHasBeenChecked
    Promise.resolve().then(() => this.onPayMethodChange());
  }

  onPayMethodChange(){
    const cNum = this.form.get('cardNumber')!;
    const cName = this.form.get('cardName')!;
    const cExp = this.form.get('cardExpiry')!;
    const cCvv = this.form.get('cardCvv')!;
    const vpa = this.form.get('vpa')!;

    // clear
    [cNum,cName,cExp,cCvv,vpa].forEach(c => c.clearValidators());

    if (this.payMethod === 'upi') {
      vpa.setValidators([Validators.required]);
    } else {
      cNum.setValidators([Validators.required]);
      cName.setValidators([Validators.required]);
      cExp.setValidators([Validators.required]);
      cCvv.setValidators([Validators.required]);
    }
    [cNum,cName,cExp,cCvv,vpa].forEach(c => c.updateValueAndValidity());
  }

  makePayment(){
    if (this.isProcessing) return;
    this.isProcessing = true;

    const address = {
      name: this.form.value.name,
      phone: this.form.value.phone,
      line1: this.form.value.addr1,
      line2: this.form.value.addr2,
      city: this.form.value.city,
      state: this.form.value.state,
      postal: this.form.value.zip,
      country: 'India'
    };

    // Step 1: Create Razorpay order
    const orderData = {
      amount: this.total() * 100, // Convert to paise
      currency: 'INR'
    };

    this.http.post<any>('/api/payments/order', orderData).subscribe({
      next: (razorpayOrder) => {
        // Step 2: Open Razorpay checkout
        this.openRazorpay(razorpayOrder, address);
      },
      error: (err) => {
        console.error('Failed to create Razorpay order:', err);
        this.isProcessing = false;
        alert('Failed to initiate payment. Please try again.');
      }
    });
  }

  private openRazorpay(razorpayOrder: any, address: any) {
    const options = {
      key: razorpayOrder.keyId || environment.razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || 'INR',
      name: 'HungerExpress',
      description: 'Order Payment',
      order_id: razorpayOrder.orderId,
      handler: (response: any) => {
        // Payment successful
        this.verifyPaymentAndCreateOrder(response, address);
      },
      prefill: {
        name: address.name,
        contact: address.phone
      },
      theme: {
        color: '#e53935'
      },
      modal: {
        ondismiss: () => {
          this.isProcessing = false;
          console.log('Payment cancelled by user');
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  private verifyPaymentAndCreateOrder(paymentResponse: any, address: any) {
    // Step 3: Payment successful, create order
    // Note: Payment verification happens via webhook, this is for immediate user feedback
    console.log('Payment successful:', paymentResponse);
    
    // Create order with items and Razorpay order ID
    const razorpayOrderId = paymentResponse.razorpay_order_id;
    this.orders.createFromCart(this.cart.items, this.total(), address, this.appliedCode || undefined, razorpayOrderId).subscribe({
      next: (order) => {
        this.cart.clear();
        this.isProcessing = false;
        this.router.navigate(['/user/order-success'], { 
          state: { 
            total: this.total(), 
            method: 'Razorpay', 
            orderId: order.id,
            paymentId: paymentResponse.razorpay_payment_id
          } 
        });
      },
      error: (err) => {
        console.error('Failed to create order after payment:', err);
        this.isProcessing = false;
        alert('Payment successful but failed to create order. Please contact support with payment ID: ' + paymentResponse.razorpay_payment_id);
      }
    });
  }

  applyCoupon(){
    const code = (this.couponCode || '').trim();
    if (!code) { this.discount = 0; this.appliedCode = ''; return; }
    this.coupons.validate(code, this.cart.subtotal()).subscribe({
      next: res => { this.discount = res.discount; this.appliedCode = res.code; },
      error: () => { this.discount = 0; this.appliedCode = ''; }
    });
  }

  total(){
    const t = this.cart.subtotal() - this.discount;
    return t < 0 ? 0 : t;
  }

}
