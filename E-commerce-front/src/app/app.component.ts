import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ToastComponent } from '@shared/ui/toast/toast.component';
import { HeaderComponent } from '@shared/ui/header/header.component';
import { FooterComponent } from '@shared/ui/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, HeaderComponent, FooterComponent],
  template: `
    <app-toast />
    @if (showChrome()) {
      <app-header />
    }
    <main class="app-main">
      <router-outlet />
    </main>
    @if (showChrome()) {
      <app-footer />
    }
  `,
  styles: [`
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    .app-main { flex: 1; }
  `]
})
export class AppComponent {
  private readonly router = inject(Router);
  readonly showChrome = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.showChrome.set(!event.urlAfterRedirects.startsWith('/auth'));
      });
  }
}
