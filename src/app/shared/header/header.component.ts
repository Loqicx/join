import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  activeFlex = false;
  helpActive = false;
  

    /**
   * Constructor for the Sidebar component that initializes routing events and sets active Button based on current URL.
   * 
   * @param {Router} router - The Angular Router instance used to listen for navigation events.
   */
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.resetActives()
        const currentUrl = event.urlAfterRedirects;
        if (currentUrl.startsWith('/help')) {
          this.helpActive = true;
        } 
      });
  }

  resetActives() {
    this.helpActive = false;
  }

  toggleMenu() {
    if (this.activeFlex) {
      this.activeFlex = false;
    } else {
      this.activeFlex = true;
    }
  }
}
