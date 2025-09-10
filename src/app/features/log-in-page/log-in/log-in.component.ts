/**
 * @fileoverview log in.component
 */

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

/**
     * Logs in a user with provided email and password.
     * 
     * @param {string} mail - The user's email address.
     * @param {string} pw - The user's password.
     * @throws {Error} If log-in fails or invalid input is provided.
     */
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

    /**
     * Closes the sign-up form.
     */
    closeSignUp() {
        this.signUpClose.emit();
    }

    /**
     * Toggles the privacy checkbox state for sign-up.
     */
    toggleCheckBox() {
        this.privacyCheckbox = !this.privacyCheckbox;
    }

    /**
     * Signs up a new user with provided email, password, and name.
     * 
     * @param {NgForm} form - The form used for validation.
     * @throws {Error} If sign-up fails or privacy policy is not accepted or passwords do not match.
     */
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

    /**
     * Creates and adds a contact to the database.
     * @throws {Error} If Contact creation Fails.
     */
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

    /**
     * Logs in a user using guest credentials.
     * @throws {Error} If Guest Account creation Fails.
     */
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