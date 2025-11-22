import { Injectable } from '@angular/core';
import type { UserRole } from './role.service';

export interface CustomerProfile {
  firstName?: string;
  lastName?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  avatarUrl?: string;
  role?: UserRole;
  notifyPush: boolean;
  notifySms: boolean;
  notifyEmail: boolean;
}

const DEFAULT_PROFILE: CustomerProfile = {
  firstName: 'Guest',
  lastName: 'User',
  name: 'Guest User',
  phone: '',
  email: '',
  address: '',
  avatarUrl: '',
  role: undefined,
  notifyPush: true,
  notifySms: false,
  notifyEmail: true,
};

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly KEY = 'he.customer.profile';

  load(): CustomerProfile {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : { ...DEFAULT_PROFILE };
    } catch {
      return { ...DEFAULT_PROFILE };
    }
  }

  save(profile: CustomerProfile) {
    localStorage.setItem(this.KEY, JSON.stringify(profile));
  }

  getAvatar(): string | undefined {
    try {
      const raw = localStorage.getItem(this.KEY);
      const p = raw ? (JSON.parse(raw) as CustomerProfile) : undefined;
      return p?.avatarUrl || undefined;
    } catch { return undefined; }
  }
}
