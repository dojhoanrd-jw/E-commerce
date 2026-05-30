import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { UserRole } from '@core/models/auth.model';
import { GoogleButtonComponent } from '@shared/ui/google-button/google-button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, GoogleButtonComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['Buyer' as UserRole, [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.notification.success('Cuenta creada con éxito');
        this.router.navigate(['/products']);
      },
      error: () => this.loading.set(false)
    });
  }

  googleLogin(credential: string): void {
    this.loading.set(true);
    this.auth.firebaseLogin(credential).subscribe({
      next: () => {
        this.notification.success('Cuenta creada con éxito');
        this.router.navigate(['/products']);
      },
      error: () => this.loading.set(false)
    });
  }
}
