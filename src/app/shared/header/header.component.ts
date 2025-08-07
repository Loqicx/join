import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
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
