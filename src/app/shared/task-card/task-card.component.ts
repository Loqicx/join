import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../interfaces/task';
import { TaskCategory } from '../services/firebase/tasks.service';
import { Contact } from '../interfaces/contact';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;
  taskTechnical: boolean = false;
  taskUserStory: boolean = false;
  taskCategory: string = '';

  assignedContacts: Contact[] = [];


  constructor() {}

  async ngOnInit(): Promise<void> {
    this.taskCategory = this.getTaskCategory();
  }

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
        this.taskTechnical = true;
        this.taskUserStory = false;
        return 'Technical Task';
        break;
      case TaskCategory.USER_STORY:
        this.taskTechnical = false;
        this.taskUserStory = true;
        return 'User Story';
        break;

      default:
        return 'Default Task';
        break;
    }
  }
}
