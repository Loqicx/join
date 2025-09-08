import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
    
    showRouter!: boolean;
    loginPage!: boolean;
    actualLogin!: boolean;
    animate!: boolean;
    fade!: boolean;
    show!: boolean;

    ngOnInit() {
        this.LoginService.verifyLogIn();

        this.LoginService.showRouter$.subscribe(val => this.showRouter = val);
        this.LoginService.loginPage$.subscribe(val => this.loginPage = val);
        this.LoginService.actualLogin$.subscribe(val => this.actualLogin = val);
        this.LoginService.animate$.subscribe(val => this.animate = val);
        this.LoginService.fade$.subscribe(val => this.fade = val);
        this.LoginService.show$.subscribe(val => this.show = val);
    }
}
