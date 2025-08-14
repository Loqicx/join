import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {
    this.taskService.tasks$.subscribe((data) => {
      this.tasks = data;
    });
  }
}

