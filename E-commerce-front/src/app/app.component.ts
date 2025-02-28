import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductsComponent],
  template: `
    <h1>{{ title }}</h1>
    <app-products></app-products>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'E-commerce';
}
