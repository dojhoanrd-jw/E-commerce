import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '@core/models/cart.model';
import { Product } from '@features/products/models/product.model';

const CART_KEY = 'ecommerce_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>(this.load());
  readonly items = this._items.asReadonly();

  readonly count = computed(() => this._items().reduce((n, i) => n + i.quantity, 0));
  readonly total = computed(() => this._items().reduce((sum, i) => sum + i.price * i.quantity, 0));

  add(product: Product, quantity = 1): void {
    this._items.update((items) => {
      const existing = items.find((i) => i.productId === product.id);
      if (existing) {
        return items.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...items,
        {
          productId: product.id,
          name: product.name,
          price: product.salePrice ?? product.price,
          imageurl: product.imageurl,
          quantity
        }
      ];
    });
    this.persist();
  }

  setQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    this._items.update((items) =>
      items.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
    this.persist();
  }

  remove(productId: number): void {
    this._items.update((items) => items.filter((i) => i.productId !== productId));
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
