import { Component } from '@angular/core';
import { ProductsComponent } from './components/products/products.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductsComponent],
  template: `
    <h1>{{ title }}</h1>
    <app-products></app-products>
  `
})
export class AppComponent {
  title = 'E-commerce';
}
