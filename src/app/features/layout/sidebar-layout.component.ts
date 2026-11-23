import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

const NAV_ITEMS = [
  { to: '/mesas', label: 'Mesas', icon: '🪑' },
  { to: '/cocina', label: 'Cocina', icon: '👨‍🍳' },
  { to: '/inventario', label: 'Inventario', icon: '📦' },
  { to: '/inventario/nuevo', label: 'Nuevo producto', icon: '➕' },
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-sidebar-layout',
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="brand-logo">POS</span>
          <span class="brand-name">POSWEB</span>
        </div>

        <nav class="sidebar-nav">
          @for (item of NAV_ITEMS; track item.to) {
            <a
              [routerLink]="item.to"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.to === '/mesas' }"
              class="nav-link"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
      </aside>

      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrls: ['./sidebar-layout.component.css'],
})
export class SidebarLayoutComponent {
  protected readonly NAV_ITEMS = NAV_ITEMS;
}
