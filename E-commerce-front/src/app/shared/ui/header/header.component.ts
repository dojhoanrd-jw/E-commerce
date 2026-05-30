import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <a class="brand" routerLink="/">
        <span class="brand__dot">●</span> ShopHub
      </a>

      <nav class="nav">
        <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          Tienda
        </a>

        @if (auth.isAuthenticated()) {
          <a class="nav-link" routerLink="/orders" routerLinkActive="active">Mis compras</a>
        }
        @if (canSell()) {
          <a class="nav-link" routerLink="/seller/products" routerLinkActive="active">Mis productos</a>
        }
        @if (isAdmin()) {
          <a class="nav-link" routerLink="/admin" routerLinkActive="active">Admin</a>
        }

        <a class="cart" routerLink="/cart" routerLinkActive="active" aria-label="Carrito">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          @if (cart.count() > 0) {
            <span class="cart__badge">{{ cart.count() }}</span>
          }
        </a>

        @if (auth.isAuthenticated()) {
          <a class="chip" routerLink="/profile" routerLinkActive="active">
            <span class="chip__avatar">{{ initials() }}</span>
            <span class="chip__name">{{ auth.currentUser()?.name }}</span>
          </a>
          <button class="ghost" type="button" (click)="logout()">Salir</button>
        } @else {
          <a class="nav-link" routerLink="/auth/login">Iniciar sesión</a>
          <a class="cta" routerLink="/auth/register">Crear cuenta</a>
        }
      </nav>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.75rem;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand {
      font-weight: 800;
      font-size: 1.2rem;
      color: var(--color-ink);
      text-decoration: none;
    }
    .brand__dot { color: var(--color-accent); }
    .nav {
      display: flex;
      align-items: center;
      gap: 1.1rem;
    }
    .nav-link {
      color: var(--color-ink-soft);
      font-weight: 600;
      text-decoration: none;
      padding: 0.35rem 0;
      border-bottom: 2px solid transparent;
    }
    .nav-link:hover { color: var(--color-ink); text-decoration: none; }
    .nav-link.active { color: var(--color-primary-dark); border-bottom-color: var(--color-primary); }

    .cart {
      position: relative;
      display: inline-flex;
      align-items: center;
      color: var(--color-ink-soft);
      padding: 0.2rem;
    }
    .cart:hover { color: var(--color-primary-dark); }
    .cart__badge {
      position: absolute;
      top: -6px;
      right: -8px;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      background: var(--color-accent);
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--color-ink);
      font-weight: 600;
      padding: 0.25rem 0.6rem 0.25rem 0.25rem;
      border: 1px solid var(--color-border);
      border-radius: 999px;
    }
    .chip:hover { border-color: var(--color-primary); text-decoration: none; }
    .chip.active { border-color: var(--color-primary); }
    .chip__avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--color-primary);
      color: #fff;
      font-size: 0.78rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chip__name { font-size: 0.9rem; }

    .ghost {
      border: 1.5px solid var(--color-border);
      background: transparent;
      color: var(--color-ink);
      font-weight: 600;
      font-family: inherit;
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .ghost:hover { border-color: var(--color-accent); color: var(--color-accent); }

    .cta {
      background: var(--color-accent);
      color: #fff;
      padding: 0.5rem 0.95rem;
      border-radius: var(--radius-sm);
      text-decoration: none;
      font-weight: 700;
    }
    .cta:hover { background: var(--color-accent-dark); text-decoration: none; }

    @media (max-width: 640px) {
      .app-header { padding: 0.75rem 1rem; }
      .nav { gap: 0.75rem; }
      .chip__name { display: none; }
    }
  `]
})
export class HeaderComponent {
  protected readonly auth = inject(AuthService);
  protected readonly cart = inject(CartService);
  private readonly router = inject(Router);

  readonly initials = computed(() => {
    const name = this.auth.currentUser()?.name ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });

  readonly canSell = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === 'Seller' || role === 'Admin';
  });

  readonly isAdmin = computed(() => this.auth.currentUser()?.role === 'Admin');

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
