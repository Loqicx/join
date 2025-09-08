import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ContactsService } from './shared/services/firebase/contacts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LogInPageComponent } from './features/log-in-page/log-in-page.component';
import { UserService } from './shared/services/firebase/user.service';
import { LoginService } from './shared/services/app-login-service.service';
@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        CommonModule,
        FormsModule,
        HeaderComponent,
        SidebarComponent,
        FooterComponent,
        LogInPageComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
/**
 * The main application component for the Join MMC project.
 *
 * @remarks
 * - Manages application state such as login status and page view.
 * - Injects {@link ContactsService} to actualize (refresh) all contacts on page load.
 */
export class AppComponent {
    title = 'join-mmc';

    contactsService: ContactsService = inject(ContactsService);
    userService: UserService = inject(UserService);
    LoginService: LoginService = inject(LoginService);
    router: Router = inject(Router);

    showRouter: boolean = false;
    loginPage: boolean = true;
    actualLogin: boolean = false;
    animate: boolean = false;
    fade: boolean = false;
    show: boolean = false;

    ngOnInit() {
        this.LoginService.verifyLogIn();
        this.LoginService.showRouter$.subscribe(val => this.showRouter = val);
        this.LoginService.loginPage$.subscribe(val => this.loginPage = val);
        this.LoginService.show$.subscribe(val => this.fade = val)
        this.LoginService.actualLogin$.subscribe(val => this.actualLogin = val);
        setTimeout(() => {
            this.LoginService.animate$.subscribe(val => {
                if (val) {
                    setTimeout(() => {
                        this.animate = true;
                    }, 300);
                    console.log(this.actualLogin);
                } else {
                    this.fade = true;
                    this.showRouter = true;
                    setTimeout(() => {
                        this.loginPage = !this.actualLogin;
                        this.show = true;
                    }, 280);
                    console.log(this.actualLogin);
                }
            });
        }, 500);
    }

    /*     setAnimations() {
            if (!this.actualLogin) {
                setTimeout(() => {
                    this.animate = true;
                }, 200);
                console.log(this.actualLogin);
            } else {
                this.fade = true;
                setTimeout(() => {
                    this.loginPage = !this.actualLogin;
                    this.show = true;
                }, 300);
                console.log(this.actualLogin);
            }
        } */
}
