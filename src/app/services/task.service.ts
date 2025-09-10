/**
 * @fileoverview Task service for managing task data in the Join application
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Interface representing a task (legacy - consider using the main Task interface)
 * @interface Task
 */
export interface Task {
  /** Task type/category */
  type: string;
  /** Task title */
  title: string;
  /** Task description */
  description: string;
  /** Number of completed subtasks */
  subtasksDone: number;
  /** Total number of subtasks */
  subtasksTotal: number;
  /** Array of assignee identifiers */
  assignees: string[];
}

/**
 * Service for managing task data and state
 * @injectable
 */
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  /** BehaviorSubject holding the current tasks array */
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

  /** Observable stream of tasks */
  tasks$ = this.tasksSubject.asObservable();

  /**
   * Creates an instance of TaskService
   */
  constructor() {}

  /**
   * Updates the tasks array with new data
   * @param {Task[]} tasks - Array of tasks to set
   */
  setTasks(tasks: Task[]) {
    this.tasksSubject.next(tasks);
  }
}
