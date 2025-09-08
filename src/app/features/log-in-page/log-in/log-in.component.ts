import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { UserService } from '../../../shared/services/firebase/user.service';
import { AppComponent } from '../../../app.component';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../shared/services/app-login-service.service';
@Component({
    selector: 'app-log-in',
    imports: [FormsModule, ButtonComponent, RouterLink],
    templateUrl: './log-in.component.html',
    styleUrl: './log-in.component.scss',
})
export class LogInComponent {
    logInEmail: any;
    logInPassword: any;
    
    @Input() signUpShow: boolean = false;
    signUpName: string = '';
    signUpEmail: string = '';
    signUpPassword1: string = '';
    signUpPassword2: string = '';
    @Output() signUpClose = new EventEmitter<void>();

    warn: boolean = false;
    warnSignUpPrivacy: boolean = false;
    privacyCheckbox: boolean = false;

    userService = inject(UserService);
    appComponent = inject(AppComponent);
    logInService = inject(LoginService);
    router = inject(Router);

    logIn(mail: string, pw: string) {
        if (!mail || !pw && new FormControl('logInForm')) {
            this.warn = true;
            return;
        }
        this.userService.login(mail, pw).subscribe({
            next: () => {
                this.logInService.verifyLogIn();
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

    signUp(form: NgForm) {
        if (form.invalid || !this.privacyCheckbox) {
            if (!this.privacyCheckbox) {
                this.warnSignUpPrivacy = true;
            }
            console.error('Form Validation failed');
            return;
        }
        this.userService.signUp(this.signUpEmail, this.signUpPassword1).subscribe({
            next: () => {
                this.appComponent.loginPage = false;
                this.appComponent.show = true;
                this.appComponent.showRouter = true;
                this.router.navigateByUrl('/');
            },
            error: (error) => {
                console.error('Database Error', error);
            },
        });
    }
}
