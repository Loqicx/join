import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  activeFlex = false;

  toggleMenu() {
    if (this.activeFlex) {
      this.activeFlex = false;
    } else {
      this.activeFlex = true;
    }
  }
}
