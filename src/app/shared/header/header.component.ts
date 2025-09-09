import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoginService } from '../services/app-login-service.service';
import { UserService } from '../services/firebase/user.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  activeFlex = false;
  helpActive = false;
  loggedIn = false;
  NameInitial: string | null = null;

  loginService = inject(LoginService);
  userService = inject(UserService);

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

  ngOnInit() {
    this.loginService.actualLogin$.subscribe(isLoggedIn => {
      this.loggedIn = isLoggedIn;
    });
    this.userService.user$.subscribe(user => {
      const nameArray = user?.displayName ? user.displayName.split(' ') : [];
      this.NameInitial = nameArray.length > 1 ? `${nameArray[0][0]}${nameArray[1][0]}` : nameArray[0]?.charAt(0);
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
