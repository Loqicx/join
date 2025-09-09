import { Component, Input,inject } from '@angular/core';
import { LogInComponent } from "./log-in/log-in.component";
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../shared/ui/button/button.component";
import { RouterLink } from '@angular/router';
import { LoginService } from '../../shared/services/app-login-service.service';

@Component({
  selector: 'app-log-in-page',
  imports: [LogInComponent, CommonModule, ButtonComponent, RouterLink],
  templateUrl: './log-in-page.component.html',
  styleUrl: './log-in-page.component.scss'
})
export class LogInPageComponent {
  @Input() animate: boolean = false;
  @Input() fade: boolean = false;
  signUpShow: boolean = false;
  logInService = inject(LoginService);

  closeLogIn() {
    this.logInService.showRouter();
  }
}
