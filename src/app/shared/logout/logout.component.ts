import { Component, inject } from '@angular/core';
import { UserService } from '../services/firebase/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-logout',
    imports: [],
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss',
})
export class LogoutComponent {
    userService = inject(UserService);
    router = inject(Router);
    loggedOut: boolean = false;

    ngOnViewInit() {
        this.userService.logout().subscribe({
            next: () => {
                this.loggedOut = true;
                setTimeout(() => {
                  this.router.navigateByUrl('/');
                }, 2500);
            },
        });
    }
}
