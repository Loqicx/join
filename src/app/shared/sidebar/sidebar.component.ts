import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  contactsActive = false;
  summaryActive = false;
  addTaskActive = false;
  boardActive = false;

/**
 * Constructor for the Sidebar component that initializes routing events and sets active Button based on current URL.
 * 
 * @param {Router} router - The Angular Router instance used to listen for navigation events.
 */
constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
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
}
}
