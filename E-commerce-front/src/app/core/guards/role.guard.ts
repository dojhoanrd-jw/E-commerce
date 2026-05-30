import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { UserRole } from '@core/models/auth.model';

/**
 * Restricts a route to users with one of the given roles.
 * Usage: { path: 'admin', canActivate: [roleGuard('Admin')] }
 */
export const roleGuard = (...roles: UserRole[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const notification = inject(NotificationService);

    const user = auth.currentUser();

    if (!user) {
      return router.createUrlTree(['/auth/login']);
    }

    if (roles.includes(user.role)) {
      return true;
    }

    notification.error('No tienes permiso para acceder a esta sección.');
    return router.createUrlTree(['/products']);
  };
};
