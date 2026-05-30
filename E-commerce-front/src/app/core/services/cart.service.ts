import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '@core/models/cart.model';
import { Product, Variant, variantLabel } from '@features/products/models/product.model';

const CART_KEY = 'ecommerce_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>(this.load());
  readonly items = this._items.asReadonly();

  readonly count = computed(() => this._items().reduce((n, i) => n + i.quantity, 0));
  readonly total = computed(() => this._items().reduce((sum, i) => sum + i.price * i.quantity, 0));

  add(product: Product, quantity = 1, variant?: Variant | null): void {
    const variantId = variant?.id ?? null;

    this._items.update((items) => {
      const existing = items.find(
        (i) => i.productId === product.id && (i.variantId ?? null) === variantId
      );
      if (existing) {
        return items.map((i) =>
          i.productId === product.id && (i.variantId ?? null) === variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...items,
        {
          productId: product.id,
          variantId,
          variantLabel: variant ? variantLabel(variant) : undefined,
          name: product.name,
          price: product.salePrice ?? product.price,
          imageurl: product.imageurl,
          quantity
        }
      ];
    });
    this.persist();
  }

  setQuantity(productId: number, variantId: number | null, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId, variantId);
      return;
    }
    this._items.update((items) =>
      items.map((i) =>
        i.productId === productId && (i.variantId ?? null) === variantId ? { ...i, quantity } : i
      )
    );
    this.persist();
  }

  remove(productId: number, variantId: number | null): void {
    this._items.update((items) =>
      items.filter((i) => !(i.productId === productId && (i.variantId ?? null) === variantId))
    );
    this.persist();
  }

  clear(): void {
    this._items.set([]);
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this._items()));
  }

  private load(): CartItem[] {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  }
}
