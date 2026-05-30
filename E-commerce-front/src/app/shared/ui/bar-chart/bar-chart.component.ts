import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BarDatum {
  label: string;
  value: number;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (data.length === 0) {
      <p class="bc-empty">Sin datos todavía.</p>
    } @else {
      <div class="bc">
        @for (d of data; track d.label) {
          <div class="bc-row">
            <span class="bc-label" [title]="d.label">{{ d.label }}</span>
            <div class="bc-track">
              <div class="bc-bar" [style.width.%]="percent(d.value)"></div>
            </div>
            <span class="bc-value">{{ format === 'currency' ? (d.value | currency) : d.value }}</span>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .bc { display: flex; flex-direction: column; gap: 0.6rem; }
    .bc-row { display: grid; grid-template-columns: 110px 1fr 80px; align-items: center; gap: 0.75rem; }
    .bc-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-ink-soft);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bc-track {
      background: var(--color-bg);
      border-radius: 999px;
      height: 14px;
      overflow: hidden;
    }
    .bc-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
      border-radius: 999px;
      min-width: 4px;
      transition: width 0.4s ease;
    }
    .bc-value {
      font-size: 0.85rem;
      font-weight: 700;
      text-align: right;
      color: var(--color-ink);
    }
    .bc-empty { color: var(--color-muted); padding: 1rem 0; }
  `]
})
export class BarChartComponent {
  @Input() data: BarDatum[] = [];
  @Input() format: 'currency' | 'number' = 'number';

  percent(value: number): number {
    const max = Math.max(1, ...this.data.map((d) => d.value));
    return (value / max) * 100;
  }
}
