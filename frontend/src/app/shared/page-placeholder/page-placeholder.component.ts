import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-page-placeholder',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div style="display:flex;justify-content:center;padding:32px">
      <mat-card style="max-width:900px;width:100%;padding:16px">
        <h2>{{ title }}</h2>
        <p>This page is a placeholder for: <b>{{ title }}</b>. Hook up real data and components here.</p>
      </mat-card>
    </div>
  `
})
export class PagePlaceholderComponent {
  private route = inject(ActivatedRoute);
  get title() { return this.route.snapshot.data['title'] as string || 'Page'; }
}
