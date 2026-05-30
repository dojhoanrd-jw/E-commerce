import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ToastComponent } from '@shared/ui/toast/toast.component';
import { HeaderComponent } from '@shared/ui/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, HeaderComponent],
  template: `
    <app-toast />
    @if (showHeader()) {
      <app-header />
    }
    <router-outlet />
  `
})
export class AppComponent {
  private readonly router = inject(Router);
  readonly showHeader = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.showHeader.set(!event.urlAfterRedirects.startsWith('/auth'));
      });
  }
}
