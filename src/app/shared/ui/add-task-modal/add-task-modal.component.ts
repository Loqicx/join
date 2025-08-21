import { Component, Input, Renderer2 } from '@angular/core';
import { AddTaskComponent } from "../../add-task/add-task.component";

@Component({
  selector: 'app-add-task-modal',
  imports: [AddTaskComponent],
  templateUrl: './add-task-modal.component.html',
  styleUrl: './add-task-modal.component.scss'
})
export class AddTaskModalComponent {
  @Input() selectedContacts: any[] = [];
  @Input() taskStatus: number = 1;

  isOpen: boolean = false;
  isSlide: boolean = false;

  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'pointerdown', (event) => {
      const modal = document.querySelector('.modal-content');
      if (this.isOpen && modal && !modal.contains(event.target as Node)) {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.isOpen = true;
    setTimeout(() => {
      this.isSlide = true;
    }, 25);
  }

  closeModal() {
    this.isSlide = false;
    setTimeout(() => {
      this.isOpen = false;
    }, 600);
  }
}
