import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '@features/products/services/products.service';
import { PRODUCT_CATEGORIES, ProductPayload, Variant } from '@features/products/models/product.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly notification = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly categories = PRODUCT_CATEGORIES;
  readonly saving = signal(false);
  readonly editId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    salePrice: [0, [Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: ['Electrónica', [Validators.required]],
    imageurl: ['', [Validators.required]],
    imagesText: ['']
  });

  readonly variants = this.fb.array<FormGroup>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    const idNum = Number(id);
    this.editId.set(idNum);
    this.productsService.getById(idNum).subscribe({
      next: (p) => {
        this.form.patchValue({
          name: p.name,
          description: p.description ?? '',
          price: p.price,
          salePrice: p.salePrice ?? 0,
          stock: p.stock,
          category: p.category,
          imageurl: p.imageurl,
          imagesText: (p.images ?? []).join('\n')
        });
        this.variants.clear();
        (p.variants ?? []).forEach((v) => this.variants.push(this.variantGroup(v)));
      }
    });
  }

  private variantGroup(v?: Partial<Variant>): FormGroup {
    return this.fb.group({
      size: [v?.size ?? ''],
      color: [v?.color ?? ''],
      stock: [v?.stock ?? 0, [Validators.min(0)]]
    });
  }

  addVariant(): void {
    this.variants.push(this.variantGroup());
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const raw = this.form.getRawValue();

    const images = raw.imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const variants = this.variants.controls
      .map((c) => c.value)
      .filter((v) => (v.size && v.size.trim()) || (v.color && v.color.trim()))
      .map((v) => ({
        size: v.size?.trim() || null,
        color: v.color?.trim() || null,
        stock: Number(v.stock) || 0
      }));

    const payload: ProductPayload = {
      name: raw.name,
      description: raw.description,
      price: raw.price,
      salePrice: raw.salePrice && raw.salePrice > 0 ? raw.salePrice : null,
      stock: raw.stock,
      category: raw.category,
      imageurl: raw.imageurl,
      images,
      variants
    };

    const id = this.editId();
    const request$: Observable<unknown> = id
      ? this.productsService.update(id, payload)
      : this.productsService.create(payload);

    request$.subscribe({
      next: () => {
        this.notification.success(id ? 'Producto actualizado' : 'Producto creado');
        this.router.navigate(['/seller/products']);
      },
      error: () => this.saving.set(false)
    });
  }
}
