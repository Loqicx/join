import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './firebase/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  actualLoginSubject = new BehaviorSubject<boolean>(false);
  actualLogin$ = this.actualLoginSubject.asObservable();

  loginPageSubject = new BehaviorSubject<boolean>(true);
  loginPage$ = this.loginPageSubject.asObservable();

  animateSubject = new BehaviorSubject<boolean>(false);
  animate$ = this.animateSubject.asObservable();

  constructor(private userService: UserService) {}

  resetState(): void {
    this.actualLoginSubject.next(false);
    this.loginPageSubject.next(true);
    this.animateSubject.next(false); 
  }

  showRouter() {
    this.loginPageSubject.next(false);
    this.animateSubject.next(false)
  }

  verifyLogIn(): void {
    this.userService.user$.subscribe((user) => {
      const isLoggedIn = !!user;
      this.actualLoginSubject.next(isLoggedIn);
      this.animateSubject.next(!isLoggedIn);
    });
  }
}
