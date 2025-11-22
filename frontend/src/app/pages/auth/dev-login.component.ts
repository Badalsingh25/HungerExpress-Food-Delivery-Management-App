import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { RoleService, UserRole } from '../../core/services/role.service';

@Component({
  selector: 'app-dev-login',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <div class="dev-login-wrapper">
      <mat-card class="dev-card">
        <h2>🔧 Dev Quick Login</h2>
        <p style="color:#666;font-size:13px;margin-bottom:8px">For development/testing. Choose a role:</p>
        <p style="color:#999;font-size:11px;margin-bottom:16px">
          Uses real backend authentication with test accounts.
        </p>
        <div class="role-grid">
          <button mat-raised-button color="primary" (click)="login('CUSTOMER')">
            👤 Customer
          </button>
          <button mat-raised-button color="accent" (click)="login('OWNER')">
            🏪 Owner
          </button>
          <button mat-raised-button (click)="login('AGENT')">
            🚚 Agent
          </button>
          <button mat-raised-button color="warn" (click)="login('ADMIN')">
            👑 Admin
          </button>
        </div>
        <div style="margin-top:20px;padding:12px;background:#f5f5f5;border-radius:8px;font-size:11px;text-align:left">
          <div><strong>Test Accounts:</strong></div>
          <div style="margin-top:6px;color:#666">
            • Admin: badalkusingh8&#64;gmail.com<br>
            • Owner: owner&#64;test.com<br>
            • Customer: customer&#64;test.com<br>
            • Agent: agent&#64;test.com<br>
            <div style="margin-top:6px;color:#999">Password: role123 (e.g. admin123)</div>
          </div>
        </div>
        <p style="margin-top:16px;font-size:12px;color:#999">
          First time? <a href="/signup" style="color:#667eea">Sign up here</a>
        </p>
      </mat-card>
    </div>
  `,
  styles: [`
    .dev-login-wrapper{display:flex;align-items:center;justify-content:center;min-height:80vh;padding:24px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)}
    .dev-card{max-width:400px;width:100%;padding:24px;text-align:center}
    h2{margin:0 0 8px}
    .role-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
  `]
})
export class DevLoginComponent {
  private auth = inject(AuthService);
  private roles = inject(RoleService);
  private router = inject(Router);

  login(role: UserRole) {
    // Use real backend login to get a valid JWT token
    const credentials = this.getDevCredentials(role);
    
    console.log(`[DevLogin] Attempting login as ${role}...`);
    
    this.auth.login(credentials).subscribe({
      next: (res) => {
        console.log(`[DevLogin] ✅ Successfully logged in as ${role}`);
        console.log(`[DevLogin] Token received:`, res.token.substring(0, 20) + '...');
        console.log(`[DevLogin] Role:`, res.role);
        
        // Navigate based on role
        if (role === 'OWNER') this.router.navigateByUrl('/owner/dashboard');
        else if (role === 'AGENT') this.router.navigateByUrl('/agent/overview');
        else if (role === 'ADMIN') this.router.navigateByUrl('/');
        else this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.error('[DevLogin] Login failed:', err);
        if (err?.status === 0) {
          alert(`❌ Backend not running. Start backend on port 8080\n\nThen try again.`);
        } else if (err?.status === 401) {
          alert(`❌ Invalid credentials for ${role}\n\nPlease sign up first at /signup with:\nEmail: ${credentials.email}\nRole: ${role}`);
        } else {
          alert(`❌ Login failed: ${err?.error?.message || 'Unknown error'}`);
        }
      }
    });
  }
  
  private getDevCredentials(role: UserRole): { email: string; password: string } {
    // Dev credentials for each role
    switch(role) {
      case 'ADMIN':
        return { email: 'badalkusingh8@gmail.com', password: 'admin123' };
      case 'OWNER':
        return { email: 'owner@test.com', password: 'owner123' };
      case 'AGENT':
        return { email: 'agent@test.com', password: 'agent123' };
      case 'CUSTOMER':
      default:
        return { email: 'customer@test.com', password: 'customer123' };
    }
  }
}
