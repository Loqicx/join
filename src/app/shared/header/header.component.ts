/**
 * @fileoverview Header component with navigation and user profile functionality
 */

import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/app-login-service.service';
import { UserService } from '../services/firebase/user.service';

/**
 * Application header component with help navigation and user profile
 * @component
 */
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {

  activeFlex = false;
  helpActive = false;
  loggedIn = false;
  NameInitial: string | null = null;

  loginService = inject(LoginService);
  userService = inject(UserService);

  private subscriptions = new Subscription();

  constructor(private router: Router) {
    const navEndSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.resetActives();
        const currentUrl = event.urlAfterRedirects;
        if (currentUrl.startsWith('/help')) {
          this.helpActive = true;
        }
      });

    this.subscriptions.add(navEndSub);
  }

  ngOnInit() {
    const loginSub = this.loginService.actualLogin$.subscribe(isLoggedIn => {
      this.loggedIn = isLoggedIn;
    });

    const userSub = this.userService.user$.subscribe(user => {
      const nameArray = user?.displayName ? user.displayName.split(' ') : [];
      this.NameInitial = nameArray.length > 1
        ? `${nameArray[0][0]}${nameArray[1][0]}`
        : nameArray[0]?.charAt(0);
    });

    this.subscriptions.add(loginSub);
    this.subscriptions.add(userSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  resetActives() {
    this.helpActive = false;
  }

  toggleMenu() {
    this.activeFlex = !this.activeFlex;
  }
}
