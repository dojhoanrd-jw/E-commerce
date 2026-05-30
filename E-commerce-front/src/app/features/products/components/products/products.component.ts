import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '@features/products/services/products.service';
import { Product } from '@features/products/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productsService.getProduct().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error getting products', error);
      }
    });
  }
}
