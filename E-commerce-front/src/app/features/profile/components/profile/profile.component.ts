import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AddressService, Address } from '@core/services/address.service';
import { NotificationService } from '@core/services/notification.service';
import { UserRole } from '@core/models/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly addressService = inject(AddressService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly user = this.auth.currentUser;

  readonly initials = computed(() => {
    const name = this.user()?.name ?? '';
    return name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  });

  readonly editingName = signal(false);
  readonly savingProfile = signal(false);
  readonly changingPassword = signal(false);
  readonly addresses = signal<Address[]>([]);
  readonly showAddressForm = signal(false);
  readonly savingAddress = signal(false);

  readonly profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]]
  });

  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly addressForm = this.fb.nonNullable.group({
    label: [''],
    recipient: ['', [Validators.required]],
    line1: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: [''],
    zip: [''],
    country: ['', [Validators.required]],
    phone: ['']
  });

  ngOnInit(): void {
    this.profileForm.patchValue({ name: this.user()?.name ?? '' });
    this.loadAddresses();
  }

  private loadAddresses(): void {
    this.addressService.getMine().subscribe({ next: (data) => this.addresses.set(data) });
  }

  startEditName(): void {
    this.profileForm.patchValue({ name: this.user()?.name ?? '' });
    this.editingName.set(true);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }
    this.savingProfile.set(true);
    this.auth.updateProfile(this.profileForm.getRawValue().name).subscribe({
      next: () => {
        this.notification.success('Perfil actualizado');
        this.editingName.set(false);
        this.savingProfile.set(false);
      },
      error: () => this.savingProfile.set(false)
    });
  }

  changePasswordSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.changingPassword.set(true);
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.notification.success('Contraseña actualizada');
        this.passwordForm.reset();
        this.changingPassword.set(false);
      },
      error: () => this.changingPassword.set(false)
    });
  }

  addAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.savingAddress.set(true);
    this.addressService.create(this.addressForm.getRawValue()).subscribe({
      next: (a) => {
        this.addresses.update((list) => [...list, a]);
        this.notification.success('Dirección agregada');
        this.addressForm.reset();
        this.showAddressForm.set(false);
        this.savingAddress.set(false);
      },
      error: () => this.savingAddress.set(false)
    });
  }

  deleteAddress(address: Address): void {
    if (!confirm('¿Eliminar esta dirección?')) {
      return;
    }
    this.addressService.delete(address.id).subscribe({
      next: () => {
        this.addresses.update((list) => list.filter((x) => x.id !== address.id));
        this.notification.success('Dirección eliminada');
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  roleLabel(role: UserRole | undefined): string {
    switch (role) {
      case 'Admin':
        return 'Administrador';
      case 'Seller':
        return 'Vendedor';
      case 'Buyer':
        return 'Comprador';
      default:
        return '';
    }
  }
}
