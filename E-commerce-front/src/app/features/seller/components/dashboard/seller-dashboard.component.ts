import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SellerService, SellerDashboard } from '@features/seller/services/seller.service';
import { BarChartComponent, BarDatum } from '@shared/ui/bar-chart/bar-chart.component';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BarChartComponent],
  templateUrl: './seller-dashboard.component.html'
})
export class SellerDashboardComponent implements OnInit {
  private readonly sellerService = inject(SellerService);

  readonly data = signal<SellerDashboard | null>(null);
  readonly loading = signal(true);

  readonly monthData = computed<BarDatum[]>(() =>
    (this.data()?.salesByMonth ?? []).map((m) => ({ label: m.month, value: m.revenue }))
  );

  readonly topData = computed<BarDatum[]>(() =>
    (this.data()?.topProducts ?? []).map((t) => ({ label: t.name, value: t.unitsSold }))
  );

  ngOnInit(): void {
    this.sellerService.getDashboard().subscribe({
      next: (d) => {
        this.data.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
