import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="app-header">
      <a class="app-header__brand" routerLink="/products">● ShopHub</a>

      <nav class="app-header__nav">
        @if (auth.isAuthenticated()) {
          <span class="app-header__user">
            {{ auth.currentUser()?.name }}
            <span class="role-badge">{{ roleLabel(auth.currentUser()?.role) }}</span>
          </span>
          <button class="btn-ghost" type="button" (click)="logout()">Cerrar sesión</button>
        } @else {
          <a routerLink="/auth/login">Iniciar sesión</a>
          <a class="btn-cta" routerLink="/auth/register">Crear cuenta</a>
        }
      </nav>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.9rem 1.75rem;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }
    .app-header__brand {
      font-weight: 800;
      font-size: 1.15rem;
      color: var(--color-ink);
      text-decoration: none;
    }
    .app-header__nav {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .app-header__user {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--color-ink);
    }
    .role-badge {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--color-primary-dark);
      background: rgba(42, 157, 143, 0.12);
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
    }
    .btn-ghost {
      border: 1.5px solid var(--color-border);
      background: transparent;
      color: var(--color-ink);
      font-weight: 600;
      font-family: inherit;
      padding: 0.5rem 0.9rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: border-color 0.15s ease, color 0.15s ease;
    }
    .btn-ghost:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }
    .btn-cta {
      background: var(--color-accent);
      color: #fff;
      padding: 0.5rem 0.9rem;
      border-radius: var(--radius-sm);
      text-decoration: none;
      font-weight: 700;
    }
    .btn-cta:hover {
      background: var(--color-accent-dark);
      text-decoration: none;
    }
  `]
})
export class HeaderComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  roleLabel(role: UserRole | undefined): string {
    switch (role) {
      case 'Admin':
        return 'Admin';
      case 'Seller':
        return 'Vendedor';
      case 'Buyer':
        return 'Comprador';
      default:
        return '';
    }
  }
}
