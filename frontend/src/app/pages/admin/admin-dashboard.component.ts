import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { RoleNavbarComponent } from '../../shared/role-navbar/role-navbar.component';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, RoleNavbarComponent],
  template: `
  <app-role-navbar></app-role-navbar>
  <div class="theme-violet" style="max-width:1200px;margin:20px auto;padding:0 16px;display:grid;gap:16px">
    <h2>📊 Admin Analytics</h2>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px">
      <div class="card">
        <h3>Orders per Day</h3>
        <div style="height:300px">
          <canvas baseChart [data]="ordersData" [options]="lineOptions" [type]="'line'"></canvas>
        </div>
      </div>
      <div class="card">
        <h3>GMV (₹)</h3>
        <div style="height:300px">
          <canvas baseChart [data]="gmvData" [options]="barOptions" [type]="'bar'"></canvas>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Top Restaurants</h3>
      <div style="height:300px">
        <canvas baseChart [data]="topRestData" [options]="barOptions" [type]="'bar'"></canvas>
      </div>
    </div>
  </div>
  `,
  styles:[`
    .card{background:var(--brand-surface);border:1px solid var(--c-muted-200);border-radius:12px;padding:12px;box-shadow:var(--brand-shadow)}
    h3{margin:8px 0 12px}
  `]
})
export class AdminDashboardComponent {
  constructor(private http: HttpClient){}

  lineOptions: ChartOptions<'line'> = { responsive: true, maintainAspectRatio: false };
  barOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false };

  ordersData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [{ label: 'Orders', data: [], borderColor: '#2196f3', backgroundColor: 'rgba(33,150,243,0.2)', fill: true, tension: .3 }] };
  gmvData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [{ label: 'GMV (₹)', data: [], backgroundColor: '#8e24aa' }] };
  topRestData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [{ label: 'GMV (₹)', data: [], backgroundColor: '#43a047' }] };

  ngOnInit(){
    this.http.get<{labels:string[],values:number[]}>('/api/admin/stats/orders-per-day').subscribe({
      next: (s) => {
        this.ordersData = { labels: s.labels, datasets: [{ label:'Orders', data: s.values, borderColor:'#2196f3', backgroundColor:'rgba(33,150,243,0.2)', fill:true, tension:.3 }] };
      },
      error: (err) => console.error('Failed to load orders chart:', err)
    });
    
    this.http.get<{labels:string[],values:number[]}>('/api/admin/stats/gmv-per-day').subscribe({
      next: (s) => {
        this.gmvData = { labels: s.labels, datasets: [{ label:'GMV (₹)', data: s.values, backgroundColor:'#8e24aa' }] };
      },
      error: (err) => console.error('Failed to load GMV chart:', err)
    });
    
    this.http.get<Array<{name:string,value:number}>>('/api/admin/stats/top-restaurants').subscribe({
      next: (rows) => {
        this.topRestData = { labels: rows.map(r=>r.name), datasets: [{ label:'GMV (₹)', data: rows.map(r=>r.value), backgroundColor:'#43a047' }] };
      },
      error: (err) => console.error('Failed to load restaurants chart:', err)
    });
  }
}
