import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../interfaces/task';
import { TaskCategory } from '../services/firebase/tasks.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input() task!: Task;

  constructor() {}

  subtasksDone(): number {
    let count = 0;
    this.task.subtasks.forEach((subtask) => {
      if (subtask.done) count++;
    });
    return count;
  }

  subtasksTotal(): number {
    return this.task.subtasks.length;
  }

  getTaskCategory() {
    switch (this.task.category) {
      case TaskCategory.TECHNICAL_TASK:
        return 'Technical Task';
        break;
      case TaskCategory.USER_STORY:
        return 'User Story';
        break;

      default:
        return 'Default Task';
        break;
    }
  }
}
