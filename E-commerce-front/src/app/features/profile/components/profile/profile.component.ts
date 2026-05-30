import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/models/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.currentUser;

  readonly initials = computed(() => {
    const name = this.user()?.name ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });

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

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
