import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasksService, TaskStatus, TaskPriority } from '../../shared/services/firebase/tasks.service'; 
import { Task } from '../../shared/services/firebase/tasks.service'; 
import { RouterLink } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  imports: [RouterLink, DatePipe],
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {
  todoCount: number = 0;
  doneCount: number = 0;
  urgentCount: number = 0;
  upcomingDate: Date | null = null;
  greeting: string = '';

  private tasksSub: Subscription | undefined;

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasksSub = this.tasksService.tasks$.subscribe(tasks => {
      this.todoCount = this.countByStatus(tasks, TaskStatus.TODO);
      this.doneCount = this.countByStatus(tasks, TaskStatus.DONE);
      this.urgentCount = this.countByPriority(tasks, TaskPriority.HIGH);
      this.upcomingDate = this.getNextUrgentDate(tasks);
      this.setGreeting();
    });
  }

  ngOnDestroy(): void {
    this.tasksSub?.unsubscribe();
  }

  private countByStatus(tasks: Task[], status: TaskStatus): number {
    return tasks.filter(t => t.status === status).length;
  }

  private countByPriority(tasks: Task[], priority: TaskPriority): number {
    return tasks.filter(t => t.priority === priority).length;
  }

  private getNextUrgentDate(tasks: Task[]): Date | null {
  const urgentDates: number[] = tasks
    .filter(t => t.priority === TaskPriority.HIGH && t.dueDate)
    .map(t => {
      const due: any = t.dueDate;

      if (due instanceof Timestamp) {
        return due.toDate().getTime();
      }

      if (due instanceof Date) {
        return due.getTime();
      }

      if (typeof due === 'string') {
        const parsed = new Date(due);
        if (!isNaN(parsed.getTime())) return parsed.getTime();
      }

      return NaN;
    })
    .filter(time => !isNaN(time));

  return urgentDates.length ? new Date(Math.min(...urgentDates)) : null;
  }

  private setGreeting(): void {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      this.greeting = 'Good morning';
    } else if (hours >= 12 && hours < 18) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }
}
