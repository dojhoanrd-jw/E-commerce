import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductsService } from '@features/products/services/products.service';
import { ProductSuggestion } from '@features/products/models/product.model';

const RECENT_KEY = 'ecommerce_recent_searches';
const RECENT_MAX = 5;

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="search">
      <form class="search__box" (ngSubmit)="submit()">
        <svg class="search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input
          type="text"
          [formControl]="control"
          (focus)="open.set(true)"
          placeholder="Buscar productos…"
          autocomplete="off"
          aria-label="Buscar productos"
        />
        @if (control.value) {
          <button class="search__clear" type="button" (click)="clearInput()" aria-label="Limpiar">×</button>
        }
      </form>

      @if (open()) {
        <div class="panel">
          @if (control.value.trim().length > 0) {
            @if (loading()) {
              <p class="panel__hint">Buscando…</p>
            } @else if (suggestions().length === 0) {
              <p class="panel__hint">Sin resultados para "{{ control.value.trim() }}"</p>
            } @else {
              @for (s of suggestions(); track s.id) {
                <button class="row" type="button" (click)="select(s)">
                  <img [src]="s.imageurl" [alt]="s.name" />
                  <span class="row__text">
                    <span class="row__name">{{ s.name }}</span>
                    <span class="row__cat">{{ s.category }}</span>
                  </span>
                  <span class="row__price">{{ price(s) | currency }}</span>
                </button>
              }
              <button class="panel__all" type="button" (click)="submit()">
                Ver todos los resultados de "{{ control.value.trim() }}"
              </button>
            }
          } @else if (recent().length > 0) {
            <div class="panel__head">
              <span>Búsquedas recientes</span>
              <button type="button" (click)="clearRecent()">Borrar</button>
            </div>
            @for (term of recent(); track term) {
              <button class="row row--recent" type="button" (click)="useRecent(term)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span class="row__name">{{ term }}</span>
              </button>
            }
          } @else {
            <p class="panel__hint">Escribe para buscar productos</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .search { position: relative; flex: 1; max-width: 460px; }
    .search__box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-bg, #f4f5f6);
      border: 1.5px solid var(--color-border);
      border-radius: 999px;
      padding: 0.45rem 0.9rem;
    }
    .search__box:focus-within { border-color: var(--color-primary); background: #fff; }
    .search__icon { color: var(--color-muted); flex-shrink: 0; }
    .search__box input {
      flex: 1;
      border: 0;
      background: transparent;
      font-family: inherit;
      font-size: 0.92rem;
      color: var(--color-ink);
      outline: none;
    }
    .search__clear {
      border: 0;
      background: transparent;
      color: var(--color-muted);
      font-size: 1.2rem;
      line-height: 1;
      cursor: pointer;
      padding: 0;
    }

    .panel {
      position: absolute;
      top: calc(100% + 0.4rem);
      left: 0;
      right: 0;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 0.4rem;
      z-index: 60;
      max-height: 70vh;
      overflow-y: auto;
    }
    .panel__hint { margin: 0; padding: 0.75rem; color: var(--color-muted); font-size: 0.9rem; }
    .panel__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 0.6rem;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--color-muted);
    }
    .panel__head button {
      border: 0;
      background: transparent;
      color: var(--color-primary-dark);
      font-weight: 600;
      cursor: pointer;
      text-transform: none;
      letter-spacing: 0;
    }

    .row {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      width: 100%;
      border: 0;
      background: transparent;
      padding: 0.5rem 0.6rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      text-align: left;
      font-family: inherit;
    }
    .row:hover { background: var(--color-bg, #f4f5f6); }
    .row img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: var(--radius-sm);
      background: #fff;
      flex-shrink: 0;
    }
    .row__text { display: flex; flex-direction: column; gap: 0.1rem; flex: 1; min-width: 0; }
    .row__name {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-ink);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .row__cat { font-size: 0.78rem; color: var(--color-muted); }
    .row__price { font-weight: 800; color: var(--color-primary-dark); font-size: 0.9rem; }
    .row--recent { color: var(--color-ink-soft); }
    .row--recent svg { color: var(--color-muted); flex-shrink: 0; }

    .panel__all {
      width: 100%;
      border: 0;
      border-top: 1px solid var(--color-border);
      margin-top: 0.3rem;
      background: transparent;
      color: var(--color-primary-dark);
      font-family: inherit;
      font-weight: 600;
      font-size: 0.88rem;
      padding: 0.65rem;
      cursor: pointer;
      text-align: center;
    }
    .panel__all:hover { background: var(--color-bg, #f4f5f6); }

    @media (max-width: 768px) {
      .search { display: none; }
    }
  `]
})
export class SearchBarComponent {
  private readonly products = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly control = new FormControl('', { nonNullable: true });
  readonly suggestions = signal<ProductSuggestion[]>([]);
  readonly recent = signal<string[]>(this.loadRecent());
  readonly open = signal(false);
  readonly loading = signal(false);

  constructor() {
    this.control.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) => {
          const t = term.trim();
          if (t.length === 0) {
            this.loading.set(false);
            return of<ProductSuggestion[]>([]);
          }
          this.loading.set(true);
          return this.products.search(t, 6);
        }),
        takeUntilDestroyed()
      )
      .subscribe((results) => {
        this.suggestions.set(results);
        this.loading.set(false);
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target)) {
      this.open.set(false);
    }
  }

  submit(): void {
    const term = this.control.value.trim();
    if (term.length === 0) {
      return;
    }
    this.saveRecent(term);
    this.open.set(false);
    this.router.navigate(['/'], { queryParams: { q: term } });
  }

  select(suggestion: ProductSuggestion): void {
    this.saveRecent(this.control.value.trim() || suggestion.name);
    this.open.set(false);
    this.router.navigate(['/products', suggestion.id]);
  }

  useRecent(term: string): void {
    this.control.setValue(term);
    this.submit();
  }

  clearInput(): void {
    this.control.setValue('');
    this.suggestions.set([]);
  }

  price(s: ProductSuggestion): number {
    return s.salePrice ?? s.price;
  }

  clearRecent(): void {
    this.recent.set([]);
    localStorage.removeItem(RECENT_KEY);
  }

  private saveRecent(term: string): void {
    const next = [term, ...this.recent().filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, RECENT_MAX);
    this.recent.set(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  }

  private loadRecent(): string[] {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  }
}
