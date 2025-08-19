import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-subtask-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-subtask-input.component.html',
  styleUrl: './assign-subtask-input.component.scss'
})
export class AssignSubtaskInputComponent {

  subtasks: { id: number, title: string, hover: boolean, edit: boolean}[] = [];
  taskSubtask: any;

  subtaskActive: boolean = false;
  subtaskInput: boolean = false;
  subtaskEditInput: string = '';

  addSubtask() {
    if (this.taskSubtask) {
      this.subtasks.push({ id: this.subtasks.length + 1, title: this.taskSubtask, hover: false, edit: false});
      this.taskSubtask = '';
      this.subtaskInput = false;
    }
    this.subtaskActive = false;
  }

  clearCreateInput() {
    this.taskSubtask = '';
    this.subtaskActive = false;
  }

  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  editSubtask(index: number) {
    this.subtasks[index].title = this.subtaskEditInput;
  }

  reloadInput(index: number) {
    this.subtaskEditInput = this.subtasks[index].title;
}
}
