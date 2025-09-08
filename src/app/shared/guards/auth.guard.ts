import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/firebase/user.service';
import { map } from 'rxjs';
import { AppComponent } from '../../app.component';

export const authGuard: CanActivateFn = (route, state) => {
    const userService = inject(UserService);
    const router = inject(Router);
    const appComponent = inject(AppComponent);

    return userService.user$.pipe(
        map((user) => {
            if (user) {
                appComponent.showRouter = true;
                appComponent.loginPage = false;
                appComponent.show = true;
                return true;
            } else {
                // trigger 'not logged in' notification

                appComponent.resetState();
                return false;
            }
        })
    );
};
