/**
 * @fileoverview Logout component handling user logout functionality
 */

import { Component, inject, OnDestroy } from '@angular/core';
import { UserService } from '../services/firebase/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/app-login-service.service';
import { NotificationService } from '../services/notification.service';
import { NotificationPosition, NotificationType } from '../interfaces/notification';
import { Subscription } from 'rxjs';

/**
 * Component handling user logout process and navigation
 * @component
 */
@Component({
    selector: 'app-logout',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss',
})
export class LogoutComponent implements OnDestroy {
    private userService = inject(UserService);
    private loginService = inject(LoginService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

    private logoutSubscription?: Subscription;
    loggedOut: boolean = false;

    ngOnInit(): void {
        this.router.navigateByUrl('/');
        this.logoutSubscription = this.userService.logout().subscribe({
            next: () => {
                this.loggedOut = true;
                this.loginService.resetState();
                this.loginService.verifyLogIn();
                this.notificationService.pushNotification(
                    'Successfully logged out!',
                    NotificationType.SUCCESS,
                    NotificationPosition.BOTTOM_RIGHT
                );
            },
        });
    }

    /**
     * Cleans up subscriptions on component destruction.
     *
     * @returns {void}
     */
    ngOnDestroy(): void {
        this.logoutSubscription?.unsubscribe();
    }
}
