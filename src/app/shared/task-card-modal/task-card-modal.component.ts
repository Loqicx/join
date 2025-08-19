import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../interfaces/task';

@Component({
  selector: 'app-task-card-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card-modal.component.html',
  styleUrls: ['./task-card-modal.component.scss'],
})
export class TaskCardModalComponent {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
