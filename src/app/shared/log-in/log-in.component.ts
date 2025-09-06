import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../ui/button/button.component';
import { UserService } from '../services/firebase/user.service';
import { AppComponent } from '../../app.component';
import { Router, RouterLink } from '@angular/router';
@Component({
    selector: 'app-log-in',
    imports: [FormsModule, ButtonComponent, RouterLink],
    templateUrl: './log-in.component.html',
    styleUrl: './log-in.component.scss',
})
export class LogInComponent {
    warn: boolean = false;
    logInEmail: any;
    logInPassword: any;
    
    @Input() signUpShow: boolean = false;
    signUpName: string = '';
    signUpEmail: string = '';
    signUpPassword1: string = '';
    signUpPassword2: string = '';
    @Output() signUpClose = new EventEmitter<void>();

    privacyCheckbox: boolean = false;

    userService = inject(UserService);
    appComponent = inject(AppComponent);
    router = inject(Router);

    logIn(mail: string, pw: string) {
        if (!mail || !pw) {
            this.warn = true;
            return;
        }
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

    closeSignUp() {
        this.signUpClose.emit();
    }

    toggleCheckBox() {
        this.privacyCheckbox = !this.privacyCheckbox;
    }

    signUp(name: string, mail: string, pw1: string, pw2: string) {
      console.log('signup currently not possible')
    }
}
