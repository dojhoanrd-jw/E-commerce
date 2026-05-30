import { Injectable, signal } from '@angular/core';
import { Product } from '@features/products/models/product.model';

const KEY = 'ecommerce_recent';
const MAX = 8;

export interface RecentProduct {
  id: number;
  name: string;
  imageurl: string;
  price: number;
  salePrice?: number | null;
}

@Injectable({ providedIn: 'root' })
export class RecentlyViewedService {
  private readonly _items = signal<RecentProduct[]>(this.load());
  readonly items = this._items.asReadonly();

  add(product: Product): void {
    const item: RecentProduct = {
      id: product.id,
      name: product.name,
      imageurl: product.imageurl,
      price: product.price,
      salePrice: product.salePrice
    };
    this._items.update((list) => {
      const withoutCurrent = list.filter((x) => x.id !== product.id);
      return [item, ...withoutCurrent].slice(0, MAX);
    });
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(KEY, JSON.stringify(this._items()));
  }

  private load(): RecentProduct[] {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RecentProduct[]) : [];
  }
}
