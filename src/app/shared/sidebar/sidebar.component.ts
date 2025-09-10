/**
 * @fileoverview Sidebar component with main navigation menu
 */

import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SVGInlineService } from '../services/svg-inline.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoginService } from '../services/app-login-service.service';
import { Subscription } from 'rxjs';

/**
 * Application sidebar navigation component
 * @component
 */
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: [SVGInlineService],
})
export class SidebarComponent implements OnDestroy {
  svgContents: { [key: string]: SafeHtml } = {};
  loggedIn = false;

  icons = [
    { name: 'contacts', src: './assets/icons/contacts.svg' },
    { name: 'summary', src: './assets/icons/summary.svg' },
    { name: 'addTask', src: './assets/icons/add-task.svg' },
    { name: 'board', src: './assets/icons/board.svg' },
    { name: 'login', src: './assets/icons/login.svg' },
  ];

  loginService = inject(LoginService);
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private svgService: SVGInlineService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.icons.forEach((icon) => {
      this.convertIcon(icon.name, icon.src);
    });

    const loginSub = this.loginService.actualLogin$.subscribe(isLoggedIn => {
      this.loggedIn = isLoggedIn;
    });

    this.subscriptions.add(loginSub);
  }

  convertIcon(iconName: string, iconSrc: string): void {
    const svgSub = this.svgService.getInlineSVG(iconSrc).subscribe({
      next: (svg: string) => {
        this.svgContents[iconName] = this.sanitizer.bypassSecurityTrustHtml(svg);
      },
      error: (err) => console.error('SVG load error:', err),
    });

    this.subscriptions.add(svgSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
