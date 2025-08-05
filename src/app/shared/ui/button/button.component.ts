import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() iconSrc!: string;
  @Input() altText: string = 'Button icon';
  @Input() type: string = 'button';
  @Input() fontSize: string = '26px'; 


  @Output() btnClick = new EventEmitter<void>();

  handleClick() {
    this.btnClick.emit();
  }
}
