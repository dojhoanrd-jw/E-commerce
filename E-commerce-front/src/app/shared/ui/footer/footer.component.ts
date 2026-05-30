import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="footer__logo"><span class="dot">●</span> E-commerce</span>
          <p>Tu tienda online de tecnología, hogar, ropa y más — con envío rápido y pago seguro.</p>
        </div>

        <div class="footer__col">
          <h4>Comprar</h4>
          <a routerLink="/">Productos</a>
          <a routerLink="/wishlist">Favoritos</a>
          <a routerLink="/cart">Carrito</a>
        </div>

        <div class="footer__col">
          <h4>Mi cuenta</h4>
          <a routerLink="/orders">Mis compras</a>
          <a routerLink="/profile">Perfil</a>
          <a routerLink="/auth/login">Iniciar sesión</a>
        </div>

        <div class="footer__col">
          <h4>Ayuda</h4>
          <a href="#">Centro de ayuda</a>
          <a href="#">Envíos y devoluciones</a>
          <a href="#">Términos y privacidad</a>
        </div>

        <div class="footer__col">
          <h4>Síguenos</h4>
          <a href="#">Instagram</a>
          <a href="#">Twitter / X</a>
          <a href="#">YouTube</a>
        </div>
      </div>

      <div class="footer__bottom">
        <span>© {{ year }} E-commerce. Todos los derechos reservados.</span>
        <span>Hecho con Angular + .NET</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-ink);
      color: rgba(255, 255, 255, 0.82);
      margin-top: 3rem;
    }
    .footer__top {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 2rem 2rem;
      display: grid;
      grid-template-columns: 1.6fr repeat(4, 1fr);
      gap: 2rem;
    }
    .footer__logo {
      font-weight: 800;
      font-size: 1.2rem;
      color: #fff;
    }
    .footer__logo .dot { color: var(--color-accent); }
    .footer__brand p {
      margin-top: 0.75rem;
      font-size: 0.9rem;
      line-height: 1.6;
      max-width: 320px;
    }
    .footer__col h4 {
      color: #fff;
      font-size: 0.95rem;
      margin: 0 0 0.85rem;
    }
    .footer__col a {
      display: block;
      color: rgba(255, 255, 255, 0.78);
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    .footer__col a:hover { color: var(--color-accent); text-decoration: none; }
    .footer__bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.25rem 2rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.82rem;
      color: rgba(255, 255, 255, 0.6);
    }
    @media (max-width: 760px) {
      .footer__top {
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
    }
  `]
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
