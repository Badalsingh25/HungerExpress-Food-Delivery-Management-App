import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'CUSTOMER' | 'OWNER' | 'AGENT' | 'ADMIN' | null;

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly KEY = 'he.role';
  private readonly _role$ = new BehaviorSubject<UserRole>(this.read());
  readonly role$ = this._role$.asObservable();
  
  // Signal for zoneless mode - reactive and efficient
  readonly roleSignal = signal<UserRole>(this.read());
  
  // Computed signals for easy role checks
  readonly isCustomer = computed(() => this.roleSignal() === 'CUSTOMER');
  readonly isOwner = computed(() => this.roleSignal() === 'OWNER');
  readonly isAgent = computed(() => this.roleSignal() === 'AGENT');
  readonly isAdmin = computed(() => this.roleSignal() === 'ADMIN');

  get role(): UserRole { return this.roleSignal(); }

  setRole(role: UserRole) {
    const store = this.safeStorage();
    if (store) {
      if (role) store.setItem(this.KEY, role);
      else store.removeItem(this.KEY);
    } else {
      this.memory = role;
    }
    this.roleSignal.set(role);
    this._role$.next(role);
  }

  private read(): UserRole {
    const store = this.safeStorage();
    const v = store ? store.getItem(this.KEY) : this.memory;
    if (v === 'CUSTOMER' || v === 'OWNER' || v === 'AGENT' || v === 'ADMIN') return v;
    return 'CUSTOMER';
  }

  private memory: UserRole = 'CUSTOMER';
  private safeStorage(): Storage | null {
    try {
      // window/localStorage not available on server
      return typeof localStorage !== 'undefined' ? localStorage : null;
    } catch { return null; }
  }
}
