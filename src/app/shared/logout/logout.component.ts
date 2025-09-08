import { Component, inject } from '@angular/core';
import { UserService } from '../services/firebase/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../app.component';

@Component({
    selector: 'app-logout',
    imports: [CommonModule],
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss',
})
export class LogoutComponent {
    userService = inject(UserService);
    appComponent = inject(AppComponent)
    router = inject(Router);
    loggedOut: boolean = false;

    ngOnInit() {
        this.userService.logout().subscribe({
            next: () => {
                this.loggedOut = true;
                this.router.navigateByUrl('/');
                  this.appComponent.resetState();
                  this.appComponent.verifyLogIn();
            },
        });
    }
}
