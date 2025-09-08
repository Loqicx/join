import { Component, inject } from '@angular/core';
import { UserService } from '../services/firebase/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/app-login-service.service';

@Component({
    selector: 'app-logout',
    imports: [CommonModule],
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss',
})
export class LogoutComponent {
    userService = inject(UserService);
    LoginService = inject(LoginService);
    router = inject(Router);
    loggedOut: boolean = false;

    ngOnInit() {
        this.userService.logout().subscribe({
            next: () => {
                this.loggedOut = true;
                this.router.navigateByUrl('/');
                this.LoginService.resetState();
                this.LoginService.verifyLogIn();
            },
        });
    }
}
