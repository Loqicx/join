import { inject, Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/firebase/user.service';
import { map } from 'rxjs';
import { LoginService } from '../services/app-login-service.service';

export const authGuard: CanActivateFn = (route, state) => {
    const userService = inject(UserService);
    const logIn = inject(LoginService);

    return userService.user$.pipe(
        map((user) => {
            if (user) {
                return true;
            } else {
                // trigger 'not logged in' notification
                logIn.resetState();
                logIn.verifyLogIn();
                return false;
            }
        })
    );
};
