import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from "../ui/button/button.component";

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

  logIn() {
    console.log('Here should be a login Logic mady by Loqicx')
  }
}
