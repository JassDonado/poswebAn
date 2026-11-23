import { Component } from '@angular/core';
import { SidebarLayoutComponent } from './features/layout/sidebar-layout.component';

@Component({
  imports: [SidebarLayoutComponent],
  selector: 'app-root',
  template: `<app-sidebar-layout />`,
})
export class App {}
