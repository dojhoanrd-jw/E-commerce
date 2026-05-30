import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService } from '@features/products/services/products.service';
import { Product } from '@features/products/models/product.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-products.component.html'
})
export class MyProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly notification = inject(NotificationService);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.productsService.getMine().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  remove(product: Product): void {
    if (!confirm(`¿Eliminar "${product.name}"?`)) {
      return;
    }
    this.productsService.delete(product.id).subscribe({
      next: () => {
        this.notification.success('Producto eliminado');
        this.products.update((list) => list.filter((p) => p.id !== product.id));
      }
    });
  }
}
