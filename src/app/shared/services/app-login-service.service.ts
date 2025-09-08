import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './firebase/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private showRouterSubject = new BehaviorSubject<boolean>(false);
  showRouter$ = this.showRouterSubject.asObservable();

  private loginPageSubject = new BehaviorSubject<boolean>(true);
  loginPage$ = this.loginPageSubject.asObservable();

  private actualLoginSubject = new BehaviorSubject<boolean>(false);
  actualLogin$ = this.actualLoginSubject.asObservable();

  private animateSubject = new BehaviorSubject<boolean>(false);
  animate$ = this.animateSubject.asObservable();

  /* private fadeSubject = new BehaviorSubject<boolean>(false);
  fade$ = this.fadeSubject.asObservable(); */

  private showSubject = new BehaviorSubject<boolean>(false);
  show$ = this.showSubject.asObservable();

  constructor(private userService: UserService) {}

  resetState(): void {
    this.showRouterSubject.next(false);
    this.loginPageSubject.next(true);
    this.actualLoginSubject.next(false);
    this.animateSubject.next(false); 
   /* this.fadeSubject.next(false); */
    this.showSubject.next(false);
  }

  verifyLogIn(): void {
    this.userService.user$.subscribe((user) => {
      const isLoggedIn = !!user;
      this.actualLoginSubject.next(isLoggedIn);
      console.log('User logged in:', isLoggedIn);

      /* this.setAnimations(isLoggedIn); */
      this.animateSubject.next(!isLoggedIn);
      this.showRouterSubject.next(isLoggedIn);

      if (isLoggedIn) {
        setTimeout(() => {
          this.loginPageSubject.next(false);
          this.showSubject.next(true);
        }, 400);
      }
    });
  }

/*   private setAnimations(isLoggedIn: boolean): void {
    if (!isLoggedIn) {
      setTimeout(() => {
        this.animateSubject.next(true);
      }, 200);
      console.log(isLoggedIn);
    } else {
      this.fadeSubject.next(true);
      setTimeout(() => {
        this.loginPageSubject.next(false);
      }, 300);
      console.log(isLoggedIn);
    }
  } */
}
