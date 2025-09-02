import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasksService, TaskStatus } from '../../shared/services/firebase/tasks.service'; 
import { Task } from '../../shared/services/firebase/tasks.service'; 
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  imports: [RouterLink],
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {
  todoCount: number = 0;
  doneCount: number = 0;

  private tasksSub: Subscription | undefined;

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasksSub = this.tasksService.tasks$.subscribe((tasks: Task[]) => {
      this.todoCount = tasks.filter(task => task.status === TaskStatus.TODO).length;
      this.doneCount = tasks.filter(task => task.status === TaskStatus.DONE).length;
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSub) {
      this.tasksSub.unsubscribe();
    }
  }
}