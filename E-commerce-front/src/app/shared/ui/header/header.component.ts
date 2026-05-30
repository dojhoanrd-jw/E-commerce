import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { SearchBarComponent } from '@shared/ui/search-bar/search-bar.component';
import { PRODUCT_CATEGORIES } from '@features/products/models/product.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SearchBarComponent],
  template: `
    <div class="site-header">
    <header class="app-header">
      <button class="burger" type="button" (click)="menuOpen.set(!menuOpen())" aria-label="Menú">
        @if (menuOpen()) { ✕ } @else { ☰ }
      </button>

      <a class="brand" routerLink="/" (click)="menuOpen.set(false)">
        <span class="brand__dot">●</span> E-commerce
      </a>

      <app-search-bar />

      <div class="icons">
        <a class="cart wish" routerLink="/wishlist" routerLinkActive="active" aria-label="Favoritos">
          ♥
          @if (wishlist.count() > 0) {
            <span class="cart__badge">{{ wishlist.count() }}</span>
          }
        </a>

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
      </div>

      <nav class="nav" [class.nav--open]="menuOpen()" (click)="menuOpen.set(false)">
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

    <nav class="dept-bar">
      <a class="dept" [routerLink]="['/']">Todo</a>
      @for (c of categories; track c) {
        <a class="dept" [routerLink]="['/']" [queryParams]="{ category: c }">{{ c }}</a>
      }
      <a class="dept dept--accent" [routerLink]="['/']" fragment="ofertas">🔥 Ofertas</a>
    </nav>
    </div>
  `,
  styles: [`
    .site-header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: var(--color-surface);
      box-shadow: var(--shadow-sm);
    }
    .app-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 0.7rem 1.75rem;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }
    .app-header > app-search-bar { flex: 1; min-width: 0; }
    .burger {
      display: none;
      border: 0;
      background: transparent;
      font-size: 1.4rem;
      line-height: 1;
      cursor: pointer;
      color: var(--color-ink);
      padding: 0.2rem 0.4rem;
    }
    .icons { display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }
    .dept-bar {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 1.75rem;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .dept-bar::-webkit-scrollbar { display: none; }
    .dept {
      flex-shrink: 0;
      color: var(--color-ink-soft);
      font-size: 0.86rem;
      font-weight: 600;
      text-decoration: none;
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      white-space: nowrap;
    }
    .dept:hover { background: var(--color-bg); color: var(--color-ink); text-decoration: none; }
    .dept--accent { color: var(--color-accent-dark); }
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
    .wish { font-size: 1.3rem; line-height: 1; }
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

    @media (max-width: 820px) {
      .app-header {
        flex-wrap: wrap;
        gap: 0.6rem 0.75rem;
        padding: 0.6rem 1rem;
      }
      .burger { display: inline-flex; order: 1; }
      .brand { order: 2; margin-right: auto; }
      .icons { order: 3; }
      .app-header > app-search-bar { order: 4; flex-basis: 100%; }
      .nav {
        order: 5;
        flex-basis: 100%;
        flex-direction: column;
        align-items: stretch;
        gap: 0.15rem;
        display: none;
        padding-top: 0.5rem;
        margin-top: 0.3rem;
        border-top: 1px solid var(--color-border);
      }
      .nav--open { display: flex; }
      .nav-link {
        padding: 0.65rem 0.35rem;
        border-bottom: 0;
        border-radius: var(--radius-sm);
      }
      .nav-link:hover { background: var(--color-bg); }
      .nav-link.active { border-bottom: 0; background: var(--color-bg); }
      .chip { align-self: flex-start; margin-top: 0.4rem; }
      .ghost, .cta { align-self: flex-start; margin-top: 0.4rem; }
      .dept-bar { padding: 0.35rem 1rem; }
    }
  `]
})
export class HeaderComponent {
  protected readonly auth = inject(AuthService);
  protected readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);
  private readonly router = inject(Router);

  protected readonly categories = PRODUCT_CATEGORIES;
  readonly menuOpen = signal(false);

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
    this.menuOpen.set(false);
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
