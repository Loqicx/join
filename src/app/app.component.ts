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

    loggedIn = false;
    loginPage = true;
    actualLogin = false;
    animate = false;
    fade = false;
    show = false;

    contactsService: ContactsService = inject(ContactsService);
    userService: UserService = inject(UserService);

    async ngOnInit() {
        this.userService.user$.subscribe((user) => {
            this.actualLogin = !!user;
            console.log('User logged in:', this.actualLogin);
            this.setAnimations();
            this.loggedIn = this.actualLogin;
            if (this.actualLogin) {
                setTimeout(() => {
                    this.loginPage = !this.actualLogin;
                    this.show = true;
                }, 300);
            }
        });
    }

    setAnimations() {
        if (!this.actualLogin) {
            this.animate = true;
            console.log(this.actualLogin);
        } else {
            this.fade = true;
            setTimeout(() => {
                this.loginPage = !this.actualLogin;
            }, 300);
            console.log(this.actualLogin);
        }
    }
}
