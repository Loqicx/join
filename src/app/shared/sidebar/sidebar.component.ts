import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SVGInlineService } from '../services/svg-inline.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: [SVGInlineService],
})
export class SidebarComponent {
  svgContents: { [key: string]: SafeHtml } = {};

  contactsActive = false;
  summaryActive = false;
  addTaskActive = false;
  boardActive = false;
  privacyActive = false;
  legalActive = false;

  icons = [
    { name: 'contacts', src: './assets/icons/contacts.svg' },
    { name: 'summary', src: './assets/icons/summary.svg' },
    { name: 'addTask', src: './assets/icons/add-task.svg' },
    { name: 'board', src: './assets/icons/board.svg' },
  ];

  /**
   * Constructor for the Sidebar component that initializes routing events and sets active Button based on current URL.
   *
   * @param {Router} router - The Angular Router instance used to listen for navigation events.
   */
  constructor(
    private router: Router,
    private svgService: SVGInlineService,
    private sanitizer: DomSanitizer
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;
        this.resetAllActives();
        if (currentUrl.startsWith('/contacts')) {
          this.contactsActive = true;
        } else if (currentUrl.startsWith('/summary')) {
          this.summaryActive = true;
        } else if (currentUrl.startsWith('/addTask')) {
          this.addTaskActive = true;
        } else if (currentUrl.startsWith('/board')) {
          this.boardActive = true;
        } else if (currentUrl.startsWith('/legal')) {
          this.legalActive = true;
        } else if (currentUrl.startsWith('/privacy')) {
          this.privacyActive = true;
        }
      });
  }

  /**
   * Resets all active tabs to false.
   */
  private resetAllActives() {
    this.contactsActive = false;
    this.summaryActive = false;
    this.addTaskActive = false;
    this.boardActive = false;
    this.privacyActive = false;
    this.legalActive = false;
  }

  ngOnInit(): void {
    this.icons.forEach((icon) => {
      this.convertIcon(icon.name, icon.src);
    });
  }

  convertIcon(iconName: string, iconSrc: string): void {
    this.svgService.getInlineSVG(iconSrc).subscribe({
      next: (svg: string) => {
        this.svgContents[iconName] =
          this.sanitizer.bypassSecurityTrustHtml(svg);
      },
      error: (err) => console.error('SVG load error:', err),
    });
  }
}
