import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { TaskCardComponent } from '../../shared/task-card/task-card.component';
import { TasksService } from '../../shared/services/firebase/tasks.service';
import { Task } from '../../shared/interfaces/task';
import { TaskCardModalComponent } from '../../shared/task-card-modal/task-card-modal.component';
import { AddTaskModalComponent } from '../../shared/add-task-modal/add-task-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board-page',
  imports: [
    ButtonComponent,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    TaskCardComponent,
    TaskCardModalComponent,
    AddTaskModalComponent,
    FormsModule,
  ],
  templateUrl: './board-page.component.html',
  styleUrl: './board-page.component.scss',
})
export class BoardPageComponent implements OnInit {
  tasks: Task[] = [];
  board: { lists: { name: string; listIndex: number; items: Task[] }[] } = {
    lists: [
      {
        name: 'To do',
        listIndex: 1,
        items: [],
      },
      {
        name: 'In progress',
        listIndex: 2,
        items: [],
      },
      {
        name: 'Await feedback',
        listIndex: 3,
        items: [],
      },
      {
        name: 'Done',
        listIndex: 4,
        items: [],
      },
    ],
  };

  tasksService: TasksService = inject(TasksService);

  selectedTask: Task | null = null;

  isModalOpen = false;

  @ViewChild (AddTaskModalComponent) AddTaskModal!: AddTaskModalComponent;

  constructor() {}

  ngOnInit(): void {
    this.tasksService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.handleTaskUpdate();
    });
  }

  openTask(task: Task) {
    this.selectedTask = task;
    this.isModalOpen = true;
  }

  closeTask() {
    this.isModalOpen = false;
    this.selectedTask = null;
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log(event.container.data);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      console.log(event.previousContainer.data);
      console.log(event.container.data);

      const targetListId = event.container.id;
      const targetListIndex = parseInt(targetListId.replace('list-', ''));
      const updateData = {
        status: targetListIndex + 1,
      };
      this.tasksService.updateTask(
        updateData,
        event.container.data[event.currentIndex].id
      );
    }
  }
  handleTaskUpdate() {
    this.clearList();
    this.tasks.forEach((task) => {
      this.board.lists[task.status! - 1].items.push(task);
    });
  }

  clearList() {
    this.board.lists.forEach((list) => {
      list.items = [];
    });
  }

  others(currentListName: string) {
    let otherLists: string[] = [];
    this.board.lists.forEach((list) => {
      if (list.name !== currentListName) {
        otherLists.push(list.name);
      }
    });
    return otherLists;
  }

  addTaskModal() {
    this.AddTaskModal.openModal()
  }
}
