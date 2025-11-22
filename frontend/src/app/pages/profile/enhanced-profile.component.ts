import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { RoleService } from '../../core/services/role.service';

interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  profilePictureUrl: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: Date;
  gender: string;
  preferences: any;
  loyaltyPoints: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  profileCompleted: boolean;
}

interface UserAddress {
  id: number;
  addressType: string;
  fullAddress: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSlideToggleModule,
    NgFor,
    NgIf
  ],
  templateUrl: './enhanced-profile.component.html',
  styleUrls: ['./enhanced-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  addresses: UserAddress[] = [];
  paymentMethods: any[] = [];
  defaultAvatar = 'https://via.placeholder.com/120x120?text=U';

  personalInfoForm!: FormGroup;
  preferencesForm!: FormGroup;
  passwordForm!: FormGroup;

  private authService = inject(AuthService);
  private roleService = inject(RoleService);
  private fb = inject(FormBuilder);

  constructor() {
    this.initializeForms();
  }

  ngOnInit() {
    this.loadUserProfile();
    this.loadAddresses();
    this.loadPaymentMethods();
  }

  private initializeForms() {
    this.personalInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dateOfBirth: [''],
      address: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      gender: ['']
    });

    this.preferencesForm = this.fb.group({
      cuisines: [[]],
      dietary: [[]],
      budget: [''],
      deliveryTime: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  loadUserProfile() {
    this.authService.me().subscribe(user => {
      if (user) {
        this.userProfile = user as unknown as UserProfile;
        this.personalInfoForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          phone: (user as any).phone || '',
          address: (user as any).address || '',
          city: (user as any).city || '',
          state: (user as any).state || '',
          postalCode: (user as any).postalCode || '',
          gender: (user as any).gender || ''
        });
      }
    });
  }

  loadAddresses() {
    // Load user addresses from API
    this.addresses = [
      {
        id: 1,
        addressType: 'HOME',
        fullAddress: '123 Main Street, Downtown',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        isDefault: true
      }
    ];
  }

  loadPaymentMethods() {
    // Load payment methods from API
    this.paymentMethods = [
      {
        id: 1,
        paymentType: 'CARD',
        providerName: 'VISA',
        lastFourDigits: '1234',
        isDefault: true
      }
    ];
  }

  savePersonalInfo() {
    if (this.personalInfoForm.valid) {
      // Save personal info to API
      console.log('Saving personal info:', this.personalInfoForm.value);
    }
  }

  savePreferences() {
    if (this.preferencesForm.valid) {
      // Save preferences to API
      console.log('Saving preferences:', this.preferencesForm.value);
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      // Change password via API
      console.log('Changing password:', this.passwordForm.value);
    }
  }

  addAddress() {
    // Open address dialog
  }

  setDefaultAddress(index: number) {
    this.addresses.forEach((addr, i) => addr.isDefault = i === index);
  }

  deleteAddress(index: number) {
    this.addresses.splice(index, 1);
  }

  addPaymentMethod() {
    // Open payment method dialog
  }

  setDefaultPayment(index: number) {
    this.paymentMethods.forEach((method, i) => method.isDefault = i === index);
  }

  deletePaymentMethod(index: number) {
    this.paymentMethods.splice(index, 1);
  }

  getPaymentIcon(paymentType: string): string {
    switch(paymentType) {
      case 'CARD': return 'credit_card';
      case 'UPI': return 'account_balance_wallet';
      case 'WALLET': return 'account_balance_wallet';
      case 'CASH': return 'money';
      default: return 'payment';
    }
  }

  resetPersonalInfo() {
    this.loadUserProfile();
  }

  resetPreferences() {
    this.preferencesForm.reset();
  }
}
