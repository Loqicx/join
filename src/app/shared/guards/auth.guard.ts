import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/firebase/user.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const userService = inject(UserService);
    const router = inject(Router);

    return userService.user$.pipe(
        map((user) => {
            if (user) {
                return true;
            } else {
                // trigger 'not logged in' notification

                // navigate to login page
                router.navigate(['']);
                return false;
            }
        })
    );
};
