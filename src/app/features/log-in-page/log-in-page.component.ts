import { Component, Input } from '@angular/core';
import { LogInComponent } from "../../shared/log-in/log-in.component";
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../shared/ui/button/button.component";

@Component({
  selector: 'app-log-in-page',
  imports: [LogInComponent, CommonModule, ButtonComponent],
  templateUrl: './log-in-page.component.html',
  styleUrl: './log-in-page.component.scss'
})
export class LogInPageComponent {
  @Input() animate: boolean = false;
  @Input() fade: boolean = false;
  signUpShow: boolean = false;
}
