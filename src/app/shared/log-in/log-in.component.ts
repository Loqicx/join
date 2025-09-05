import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../ui/button/button.component';
import { UserService } from '../services/firebase/user.service';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-log-in',
    imports: [FormsModule, ButtonComponent],
    templateUrl: './log-in.component.html',
    styleUrl: './log-in.component.scss',
})
export class LogInComponent {
    warn: boolean = false;
    logInEmail: any;
    logInPassword: any;

    userService = inject(UserService);
    appComponent = inject(AppComponent);
    router = inject(Router);

    logIn(mail: string, pw: string) {
        this.userService.login(mail, pw).subscribe({
            next: () => {
                this.router.navigateByUrl('/');
            },
            error: (error) => {
                this.warn = true;
                console.error('something went wrong', error);
            },
        });
    }
}
