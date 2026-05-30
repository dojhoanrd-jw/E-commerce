import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, AdminUser } from '@features/admin/services/admin.service';
import { ProductsService } from '@features/products/services/products.service';
import { Product } from '@features/products/models/product.model';
import { Order } from '@core/models/order.model';
import { NotificationService } from '@core/services/notification.service';
import { UserRole } from '@core/models/auth.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly productsService = inject(ProductsService);
  private readonly notification = inject(NotificationService);

  readonly products = signal<Product[]>([]);
  readonly users = signal<AdminUser[]>([]);
  readonly orders = signal<Order[]>([]);

  readonly revenue = computed(() => this.orders().reduce((sum, o) => sum + o.total, 0));
  readonly roles: UserRole[] = ['Buyer', 'Seller', 'Admin'];
  readonly orderStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

  ngOnInit(): void {
    this.productsService.getProduct().subscribe({ next: (d) => this.products.set(d) });
    this.admin.getUsers().subscribe({ next: (d) => this.users.set(d) });
    this.admin.getAllOrders().subscribe({ next: (d) => this.orders.set(d) });
  }

  deleteProduct(product: Product): void {
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

  changeRole(user: AdminUser, role: string): void {
    const newRole = role as UserRole;
    this.admin.changeRole(user.id, newRole).subscribe({
      next: () => {
        this.notification.success(`Rol de ${user.name} actualizado`);
        this.users.update((list) =>
          list.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
      }
    });
  }

  deleteUser(user: AdminUser): void {
    if (!confirm(`¿Eliminar al usuario "${user.name}"?`)) {
      return;
    }
    this.admin.deleteUser(user.id).subscribe({
      next: () => {
        this.notification.success('Usuario eliminado');
        this.users.update((list) => list.filter((u) => u.id !== user.id));
      }
    });
  }

  changeStatus(order: Order, status: string): void {
    this.admin.changeOrderStatus(order.id, status).subscribe({
      next: () => {
        this.notification.success(`Orden #${order.id} → ${status}`);
        this.orders.update((list) =>
          list.map((o) => (o.id === order.id ? { ...o, status } : o))
        );
      }
    });
  }
}
