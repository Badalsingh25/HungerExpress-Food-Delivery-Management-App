import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { catchError, finalize, of } from 'rxjs';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

interface Metric { label: string; value: number | string; icon: string; color: string; route?: string; }
interface Summary { 
  todayOrders: number; 
  pendingOrders: number; 
  revenueToday: number; 
  avgPrepTime: number; 
  topItems: { name: string; count: number; }[];
  hourlyTrends: number[];  // 24 hours (0-23) with order counts
}

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterLink, RoleNavbarComponent],
  template: `
  <app-role-navbar></app-role-navbar>
  <div class="dash theme-olive">
    <div class="top">
      <h2>Owner Dashboard</h2>
      <div class="actions">
        <button mat-stroked-button color="primary" (click)="refresh()" [disabled]="loading" aria-label="Refresh">
          <mat-icon [class.spin]="loading">refresh</mat-icon>&nbsp;Refresh
        </button>
        <button mat-stroked-button color="primary" routerLink="/owner/orders"><mat-icon>view_kanban</mat-icon>&nbsp;Orders Board</button>
        <button mat-stroked-button color="accent" routerLink="/owner/menu"><mat-icon>restaurant_menu</mat-icon>&nbsp;Manage Menu</button>
      </div>
    </div>

    <div class="grid" *ngIf="!loading; else skelMetrics">
      <mat-card class="tile" *ngFor="let m of metrics" [class.clickable]="!!m.route" (click)="open(m)">
        <div class="tile-head">
          <mat-icon>{{m.icon}}</mat-icon>
          <span>{{m.label}}</span>
        </div>
        <div class="tile-val">{{m.value}}</div>
      </mat-card>
    </div>
    <ng-template #skelMetrics>
      <div class="grid">
        <mat-card class="tile" *ngFor="let s of [1,2,3,4]">
          <div class="skel skel-line" style="width:60%"></div>
          <div class="skel skel-num"></div>
        </mat-card>
      </div>
    </ng-template>

    <div class="panels">
      <mat-card class="panel">
        <h3>Top Items Today</h3>
        <div class="list" *ngIf="!loading; else skelList">
          <div class="row" *ngFor="let it of summary?.topItems">
            <span>{{it.name}}</span>
            <span class="count">{{it.count}}</span>
          </div>
          <div *ngIf="!summary?.topItems || summary?.topItems?.length === 0" class="empty-list">
            <mat-icon style="color: #ccc; margin-bottom: 8px;">restaurant</mat-icon>
            <p style="color: #999; margin: 0; font-size: 14px;">No items ordered today</p>
          </div>
        </div>
        <ng-template #skelList>
          <div class="list">
            <div class="row"><span class="skel skel-line" style="width:60%"></span><span class="skel skel-pill"></span></div>
            <div class="row"><span class="skel skel-line" style="width:50%"></span><span class="skel skel-pill"></span></div>
            <div class="row"><span class="skel skel-line" style="width:40%"></span><span class="skel skel-pill"></span></div>
          </div>
        </ng-template>
      </mat-card>

      <mat-card class="panel">
        <h3>Today Trends (Hourly Orders)</h3>
        <div class="chart">
          <div class="chart-placeholder" *ngIf="!loading; else skelChart">
            <div class="bar" 
                 *ngFor="let b of bars; let i = index" 
                 [style.height.%]="b"
                 [title]="'Hour ' + i + ':00 - ' + (summary?.hourlyTrends?.[i] || 0) + ' orders'">
            </div>
            <div *ngIf="bars.length === 0" class="empty-state">
              <mat-icon style="font-size: 48px; width: 48px; height: 48px; color: #ccc;">trending_up</mat-icon>
              <p style="color: #999; margin-top: 8px;">No orders today</p>
            </div>
          </div>
          <ng-template #skelChart>
            <div class="chart-placeholder">
              <div class="bar skel" *ngFor="let s of [1,2,3,4,5,6]"></div>
            </div>
          </ng-template>
        </div>
        <div class="chart-legend" *ngIf="bars.length > 0">
          <span style="font-size: 11px; color: #999;">Hover over bars to see order counts per hour</span>
        </div>
      </mat-card>
    </div>

    <div class="quick-links">
      <mat-card class="ql">
        <button mat-stroked-button color="accent" routerLink="/owner/menu"><mat-icon>add</mat-icon>&nbsp;Add Item</button>
        <button mat-stroked-button color="primary" routerLink="/owner/orders"><mat-icon>view_kanban</mat-icon>&nbsp;View Orders</button>
        <button mat-stroked-button routerLink="/owner/settings"><mat-icon>settings</mat-icon>&nbsp;Settings</button>
      </mat-card>
    </div>
  </div>
  `,
  styles: [`
    .dash{max-width:1200px;margin:24px auto;padding:0 16px}
    .top{display:flex;align-items:center;gap:12px}
    .top h2{flex:1;margin:0}
    .actions{display:flex;gap:8px;flex-wrap:wrap}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:12px}
    .tile{padding:12px;background:var(--brand-surface);border:1px solid var(--c-muted-200);border-radius:12px;box-shadow:var(--brand-shadow)}
    .tile.clickable{ cursor: pointer; transition: transform .05s ease; }
    .tile.clickable:active{ transform: translateY(1px); }
    .tile-head{display:flex;align-items:center;gap:8px;border-top:4px solid var(--c-primary);border-radius:8px 8px 0 0;padding-top:6px}
    .tile-val{font-size:26px;font-weight:700;padding:6px 0 4px;color:var(--c-primary)}
    .panels{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
    .panel{padding:12px;background:var(--brand-surface);border:1px solid var(--c-muted-200);border-radius:12px;box-shadow:var(--brand-shadow)}
    .list{display:flex;flex-direction:column;gap:8px}
    .row{display:flex;justify-content:space-between;padding:8px;border:1px solid var(--c-muted-200);border-radius:8px;background:var(--c-muted-100)}
    .empty-list{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}
    .count{background:var(--c-accent);color:var(--c-primary);border-radius:999px;padding:0 8px}
    .ops{display:flex;flex-direction:column;gap:6px}
    .skel{background:linear-gradient(90deg,#e0e6ec,#f2f6fa,#e0e6ec);background-size:200% 100%;animation:sh 1.2s infinite}
    .skel-line{height:12px;border-radius:6px}
    .skel-num{height:28px;border-radius:6px;margin-top:8px}
    .skel-pill{height:18px;border-radius:999px;width:48px}
    @keyframes sh{0%{background-position:200% 0}100%{background-position:-200% 0}}
    .chart{padding:6px}
    .chart-placeholder{display:flex;gap:6px;align-items:flex-end;height:120px}
    .chart-placeholder .bar{flex:1;min-width:10px;background:var(--c-primary);opacity:.85;border-radius:6px;cursor:pointer;transition:opacity .2s,transform .1s}
    .chart-placeholder .bar:hover{opacity:1;transform:translateY(-2px)}
    .chart-placeholder .empty-state{width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center}
    .chart-legend{padding:8px;text-align:center;background:var(--c-muted-100);border-radius:6px;margin-top:8px}
    .quick-links{margin-top:12px}
    .ql{display:flex;gap:8px;flex-wrap:wrap;padding:12px;justify-content:center;background:var(--brand-surface);border:1px solid var(--c-muted-200);border-radius:12px;box-shadow:var(--brand-shadow)}
    @media (max-width: 1024px){ .panels{grid-template-columns:1fr} }
    .actions :where(button, .mat-icon){ color: var(--c-text); }
    .actions button[color="primary"]{ font-weight:600; }
    .actions .mat-icon.spin{ animation: rot 1s linear infinite; }
    @keyframes rot{ from{ transform: rotate(0deg);} to{ transform: rotate(360deg);} }
  `]
})
export class OwnerDashboardComponent implements OnInit {
  metrics: Metric[] = [];
  summary?: Summary;
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  loading = true;
  bars: number[] = [];

  ngOnInit(){ this.refresh(); }

  refresh(){
    console.log('[OwnerDashboard] Starting refresh...');
    // Call backend summary - require real data, no fallback
    this.loading = true;
    // Auth interceptor handles the token automatically
    this.http.get<Summary>('/api/owner/summary')
      .pipe(
        catchError((err) => {
          console.error('[OwnerDashboard] Error loading summary:', err);
          
          const status = err?.status;
          let message = '';
          let icon = 'error';
          
          if (status === 401 || status === 403) {
            message = 'Please login as Owner to view dashboard';
            icon = 'lock';
          } else if (status === 0 || !status) {
            message = 'Backend server not running. Start backend on port 8080';
            icon = 'cloud_off';
          } else if (status === 404) {
            message = 'Dashboard endpoint not found. Check backend is updated';
            icon = 'warning';
          } else {
            message = `Cannot load dashboard data (${status})`;
            icon = 'error_outline';
          }
          
          // Show error in UI with helpful message
          this.metrics = [
            { label: 'Dashboard Unavailable', value: message, icon: icon, color: '#f44336' }
          ];
          this.summary = { todayOrders: 0, pendingOrders: 0, revenueToday: 0, avgPrepTime: 0, topItems: [], hourlyTrends: [] };
          
          return of(null);
        }),
        finalize(() => { 
          console.log('[OwnerDashboard] Finalize - setting loading to false');
          this.loading = false;
          this.cdr.markForCheck();
          console.log('[OwnerDashboard] Change detection triggered');
        })
      )
      .subscribe((s) => {
        console.log('[OwnerDashboard] Received summary:', s);
        if (s) this.setSummary(s);
      });
  }

  private setSummary(s: Summary){
    console.log('[OwnerDashboard] Setting summary with data:', s);
    this.summary = s;
    this.metrics = [
      { label: 'Orders Today', value: s.todayOrders, icon: 'receipt_long', color: '#1976d2', route: '/owner/orders' },
      { label: 'Pending', value: s.pendingOrders, icon: 'schedule', color: '#f44336', route: '/owner/orders?filter=pending' },
      { label: 'Revenue Today', value: `₹${(s.revenueToday||0).toFixed(2)}`, icon: 'payments', color: '#2e7d32' },
      { label: 'Avg Prep Time', value: `${s.avgPrepTime||0} min`, icon: 'timer', color: '#6a1b9a' },
    ];
    
    // Calculate bar heights from hourly trends (show as percentages)
    if (s.hourlyTrends && s.hourlyTrends.length > 0) {
      const maxOrders = Math.max(...s.hourlyTrends);
      if (maxOrders > 0) {
        // Convert to percentages (0-100) for bar heights
        this.bars = s.hourlyTrends.map(count => (count / maxOrders) * 100);
      } else {
        this.bars = [];
      }
    } else {
      this.bars = [];
    }
    
    this.cdr.markForCheck();
    console.log('[OwnerDashboard] Metrics updated, bars:', this.bars);
  }

  open(m: Metric){
    if (!m.route) return;
    this.router.navigateByUrl(m.route);
  }
}
