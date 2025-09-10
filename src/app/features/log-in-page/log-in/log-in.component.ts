import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { UserService } from '../../../shared/services/firebase/user.service';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../shared/services/app-login-service.service';
import { ContactsService } from '../../../shared/services/firebase/contacts.service';
import { Contact } from '../../../shared/interfaces/contact';
import { NotificationService } from '../../../shared/services/notification.service';
import { NotificationType, NotificationPosition } from '../../../shared/interfaces/notification';
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

    contact: Contact = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    };

    userService = inject(UserService);
    logInService = inject(LoginService);
    contactsService = inject(ContactsService);
    notificationService = inject(NotificationService);
    router = inject(Router);

    logIn(mail: string, pw: string) {
        if (!mail || (!pw && new FormControl('logInForm'))) {
            this.warn = true;
            return;
        }
        this.userService.login(mail, pw).subscribe({
            next: () => {
                this.router.navigate(['/summary']);
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
        if (form.invalid || !this.privacyCheckbox || this.signUpPassword1 !== this.signUpPassword2) {
            if (!this.privacyCheckbox) {
                this.warnSignUpPrivacy = true;
            } else if (this.signUpPassword1 !== this.signUpPassword2) {
                this.warn = true;
            }
            console.error('Form Validation failed');
            return;
        }
        this.userService.signUp(this.signUpEmail, this.signUpPassword1, this.signUpName).subscribe({
            next: () => {
                this.createContact();
                this.logInService.verifyLogIn();
                this.router.navigate(['/summary']);
            },
            error: (error) => {
                console.error('Database Error', error);
            },
        });
    }

    async createContact() {
        const nameParts = this.signUpName.trim().split(' ');
        this.contact.firstName = nameParts.slice(0, 1).join('');
        this.contact.lastName = nameParts.slice(1).join('');
        
        this.contact.email = this.signUpEmail;
        this.contact.phoneNumber = 'No phone number added yet';
        this.contact.id = this.userService.user$.subscribe(user => user?.uid).toString();
        try {
            await this.contactsService.addContactToDatabase(this.contact);
            this.notificationService.pushNotification('Your account was created successfully!', NotificationType.SUCCESS, NotificationPosition.TOP_RIGHT);
        } catch (error) {
            console.error('Error adding contact:', error);
            this.notificationService.pushNotification('Error adding contact for your User Account!', NotificationType.ERROR, NotificationPosition.TOP_RIGHT);
        }
    }

    loginGuest() {
        this.userService.loginGuest().subscribe({
            next: () => {
                this.logInService.verifyLogIn();
                this.router.navigate(['/summary']);
            },
            error: (error) => {
                this.notificationService.pushNotification('Error adding Guest Account!', NotificationType.ERROR, NotificationPosition.TOP_RIGHT);
                console.error('Database Error', error);
            },
        });
    }
}
