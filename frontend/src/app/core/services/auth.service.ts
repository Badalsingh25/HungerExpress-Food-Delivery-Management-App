import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { RoleService, UserRole } from './role.service';

export interface AuthResponse { token: string; email: string; role: UserRole; fullName: string; }
export interface SignupRequest { email: string; password: string; fullName: string; role?: UserRole; }
export interface LoginRequest { email: string; password: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private roles = inject(RoleService);
  private readonly key = 'he.jwt';

  get token(): string | null { try { return localStorage.getItem(this.key); } catch { return null; } }
  set token(v: string | null) { try { v ? localStorage.setItem(this.key, v) : localStorage.removeItem(this.key); } catch {} }

  signup(req: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/signup', req).pipe(
      tap(res => { this.token = res.token; this.roles.setRole(res.role); })
    );
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', req).pipe(
      tap(res => { this.token = res.token; this.roles.setRole(res.role); })
    );
  }

  me(): Observable<AuthResponse | null> {
    const t = this.token; if (!t) return of(null as any);
    const headers = new HttpHeaders({ Authorization: `Bearer ${t}` });
    return this.http.get<any>('/api/auth/me', { headers }) as any;
  }

  logout(){ this.token = null; this.roles.setRole('CUSTOMER'); }
}
