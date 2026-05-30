import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  Output,
  ViewChild,
  inject
} from '@angular/core';
import { environment } from '@environments/environment';

// Google Identity Services is loaded at runtime; it attaches `google` to window.
declare const google: any;

const GSI_SRC = 'https://accounts.google.com/gsi/client';
const GSI_ID = 'google-gsi-script';

@Component({
  selector: 'app-google-button',
  standalone: true,
  template: `
    @if (clientId) {
      <div class="google-btn" #target></div>
    }
  `
})
export class GoogleButtonComponent implements AfterViewInit {
  private readonly zone = inject(NgZone);

  @ViewChild('target') target?: ElementRef<HTMLElement>;
  @Output() credential = new EventEmitter<string>();

  readonly clientId = environment.googleClientId;

  ngAfterViewInit(): void {
    if (!this.clientId || !this.target) {
      return;
    }

    this.loadScript().then(() => {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: { credential: string }) =>
          this.zone.run(() => this.credential.emit(response.credential))
      });

      google.accounts.id.renderButton(this.target!.nativeElement, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
        logo_alignment: 'center'
      });
    });
  }

  private loadScript(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).google?.accounts?.id) {
        resolve();
        return;
      }

      const existing = document.getElementById(GSI_ID) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }

      const script = document.createElement('script');
      script.id = GSI_ID;
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }
}
