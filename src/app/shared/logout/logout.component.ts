import { Component, inject } from '@angular/core';
import { UserService } from '../services/firebase/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/app-login-service.service';
import { NotificationService } from '../services/notification.service';
import { NotificationPosition, NotificationType } from '../interfaces/notification';

@Component({
    selector: 'app-logout',
    imports: [CommonModule],
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss',
})
export class LogoutComponent {
    userService = inject(UserService);
    loginService = inject(LoginService);
    notificationService = inject(NotificationService);
    router = inject(Router);
    loggedOut: boolean = false;

    ngOnInit() {
        this.router.navigateByUrl('/');
        this.userService.logout().subscribe({
            next: () => {
                this.loggedOut = true;
                this.loginService.resetState();
                this.loginService.verifyLogIn();
                this.notificationService.pushNotification('Successfully logged out!', NotificationType.SUCCESS, NotificationPosition.BOTTOM_RIGHT);
            },
        });
    }
}
