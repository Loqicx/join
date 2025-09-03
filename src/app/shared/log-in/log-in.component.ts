import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from "../ui/button/button.component";
import { UserService } from '../services/firebase/user.service';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  imports: [FormsModule, ButtonComponent],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  warn: boolean = false;
  logInEmail: any;
  logInPassword: any;

  userService = inject(UserService)
  appComponent = inject(AppComponent)
  router = inject(Router)

  logIn() {
    this.userService.login(this.logInEmail, this.logInPassword).subscribe({
      next: () => {
        this.appComponent.loggedIn = true;
        this.appComponent.loginPage = false;
        this.router.navigateByUrl('/')
      },
      error: (error) => {
        console.error("something went wrong", error)
      }
    })
  }
}
