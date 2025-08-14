import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Task {
  type: string;
  title: string;
  description: string;
  subtasksDone: number;
  subtasksTotal: number;
  assignees: string[];
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([
    {
      type: 'User Story',
      title: 'Add drag & drop',
      description: 'Implement drag and drop for the board',
      subtasksDone: 1,
      subtasksTotal: 2,
      assignees: ['MP', 'CH', 'MD'],
    },
  ]);

  tasks$ = this.tasksSubject.asObservable();

  constructor() {}

  setTasks(tasks: Task[]) {
    this.tasksSubject.next(tasks);
  }
}
