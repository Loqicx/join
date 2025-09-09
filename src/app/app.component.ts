import { Component, inject, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';

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
export class AppComponent implements OnDestroy {
    title = 'join-mmc';

    contactsService: ContactsService = inject(ContactsService);
    router: Router = inject(Router);
    private LoginService: LoginService = inject(LoginService);

    showRouter: boolean = false;
    loginPage: boolean = true;
    actualLogin: boolean = false;
    animate: boolean = false;
    fade: boolean = false;
    show: boolean = false;

    private subscriptions = new Subscription();

    ngOnInit() {
        this.LoginService.verifyLogIn();

        const loginPageSub = this.LoginService.loginPage$.subscribe((val) => (this.loginPage = val));
        this.subscriptions.add(loginPageSub);

        this.animateLogIn();
    }

    animateLogIn() {
        setTimeout(() => {
            const animateSub = this.LoginService.animate$.subscribe((val) => {
                if (val) {
                    this.fade = false;
                    this.showRouter = false;
                    setTimeout(() => {
                        this.LoginService.loginPageSubject.next(true);
                        this.animate = true;
                    }, 300);
                } else {
                    this.fade = true;
                    this.animate = false;
                    this.showRouter = true;
                    setTimeout(() => {
                        this.show = true;
                        this.LoginService.loginPageSubject.next(false);
                    }, 280);
                }
            });
            this.subscriptions.add(animateSub);
        }, 500);
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
