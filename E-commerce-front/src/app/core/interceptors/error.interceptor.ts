import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '@core/services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error.status === 0
          ? 'No se pudo conectar con el servidor.'
          : error.error?.message ?? `Error ${error.status}: ${error.statusText}`;

      notification.error(message);
      return throwError(() => error);
    })
  );
};
