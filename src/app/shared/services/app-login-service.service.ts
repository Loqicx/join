import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './firebase/user.service';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    actualLoginSubject = new BehaviorSubject<boolean>(false);
    actualLogin$ = this.actualLoginSubject.asObservable();

    loginPageSubject = new BehaviorSubject<boolean>(true);
    loginPage$ = this.loginPageSubject.asObservable();

    animateSubject = new BehaviorSubject<boolean>(false);
    animate$ = this.animateSubject.asObservable();

    constructor(private userService: UserService) {}

    /**
     * Resets the login and animation states to their default values.
     * Login Page will be shown and actual login will be set to false.
     */
    resetState(): void {
        this.actualLoginSubject.next(false);
        this.loginPageSubject.next(true);
        this.animateSubject.next(false);
    }

    /**
     * Shows the router by hiding login Page and trigger Animations
     */
    showRouter() {
        this.loginPageSubject.next(false);
        this.animateSubject.next(false);
    }

    /**
     * Verifies if the user is logged in and updates the state accordingly.
     * Subscribes to the user$ observable from UserService to get user data.
     * Updates actualLoginSubject and animateSubject based on whether a user is present.
     */
    verifyLogIn(): void {
        this.userService.user$.subscribe((user) => {
            const isLoggedIn = !!user;
            this.actualLoginSubject.next(isLoggedIn);
            this.animateSubject.next(!isLoggedIn);
        });
    }
}
