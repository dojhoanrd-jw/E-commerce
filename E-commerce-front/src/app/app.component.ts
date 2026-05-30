import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '@shared/ui/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <h1>{{ title }}</h1>
    <app-toast />
    <router-outlet />
  `
})
export class AppComponent {
  title = 'E-commerce';
}
