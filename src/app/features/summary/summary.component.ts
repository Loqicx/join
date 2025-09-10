import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasksService, TaskStatus, TaskPriority } from '../../shared/services/firebase/tasks.service';
import { Task } from '../../shared/services/firebase/tasks.service';
import { RouterLink } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { UserService } from '../../shared/services/firebase/user.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  imports: [RouterLink, DatePipe],
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {
  todoCount = 0;
  doneCount = 0;
  urgentCount = 0;
  inProgressCount = 0;
  feedbackCount = 0;
  upcomingDate: Date | null = null;
  boardCount = 0;
  greeting = '';
  userName = 'Guest';

  private tasksSub?: Subscription;
  private userSub?: Subscription;

  constructor(private tasksService: TasksService, private userService: UserService) { }

  /** Initialize subscriptions for tasks and user data */
  ngOnInit(): void {
    this.subscribeTasks();
    this.subscribeUser();
  }

  /** Clean up subscriptions on destroy */
  ngOnDestroy(): void {
    this.tasksSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }

  /** Subscribe to tasks observable and update counts and dates */
  private subscribeTasks(): void {
    this.tasksSub = this.tasksService.tasks$.subscribe(tasks => {
      this.updateCounts(tasks);
      this.upcomingDate = this.getNextUrgentDate(tasks);
      this.boardCount = tasks.length;
      this.setGreeting();
    });
  }

  /** Subscribe to user observable and set user name */
  private subscribeUser(): void {
    this.userSub = this.userService.user$.subscribe(user => {
      this.userName = user?.displayName || 'Guest';
    });
  }

  /** Update task counts by status and priority */
  private updateCounts(tasks: Task[]): void {
    this.todoCount = this.countByStatus(tasks, TaskStatus.TODO);
    this.doneCount = this.countByStatus(tasks, TaskStatus.DONE);
    this.inProgressCount = this.countByStatus(tasks, TaskStatus.DOING);
    this.feedbackCount = this.countByStatus(tasks, TaskStatus.AWAIT_FEEDBACK);
    this.urgentCount = this.countByPriority(tasks, TaskPriority.HIGH);
  }

  /** Count tasks by a given status */
  private countByStatus(tasks: Task[], status: TaskStatus): number {
    return tasks.filter(t => t.status === status).length;
  }

  /** Count tasks by a given priority */
  private countByPriority(tasks: Task[], priority: TaskPriority): number {
    return tasks.filter(t => t.priority === priority).length;
  }

  /**
   * Get the next urgent task date (highest priority)
   * @param tasks List of tasks
   * @returns Date of the next urgent task or null
   */
  private getNextUrgentDate(tasks: Task[]): Date | null {
    const times = tasks
      .filter(t => t.priority === TaskPriority.HIGH && t.dueDate)
      .map(t => this.getTime(t.dueDate))
      .filter(t => !isNaN(t));

    return times.length ? new Date(Math.min(...times)) : null;
  }

  /**
   * Convert various dueDate types to timestamp
   * @param due Due date in Timestamp, Date or string
   * @returns Milliseconds since epoch or NaN
   */
  private getTime(due: any): number {
    if (due instanceof Timestamp) return due.toDate().getTime();
    if (due instanceof Date) return due.getTime();
    if (typeof due === 'string') {
      const parsed = new Date(due);
      return isNaN(parsed.getTime()) ? NaN : parsed.getTime();
    }
    return NaN;
  }

  /** Set greeting message based on current hour */
  private setGreeting(): void {
    const h = new Date().getHours();
    this.greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }
}
