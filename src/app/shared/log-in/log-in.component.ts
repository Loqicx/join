import { Component, inject, Input } from '@angular/core';
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
    signUpForm: boolean = false;

    signUpName: string = '';
    signUpEmail: string = '';
    signUpPassword1: string = '';
    signUpPassword2: string = '';

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

    signUp(name: string, mail: string, pw1: string, pw2: string) {
      console.log('signup currently not possible')
    }
}
