import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-subtask-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-subtask-input.component.html',
  styleUrl: './assign-subtask-input.component.scss'
})
export class AssignSubtaskInputComponent {

  subtasks: { id: number, title: string, done: boolean, hover: boolean, edit: boolean }[] = [];
  subtaskData: { title: string, done: boolean }[] = [{ title: '', done: false }];
  taskSubtask: any;

  subtaskActive: boolean = false;
  subtaskInput: boolean = false;
  subtaskEditInput: string = '';

  @Output() selectedSubTasks: EventEmitter<{ id: number, title: string, done: boolean }[]> =
    new EventEmitter<{ id: number, title: string, done: boolean }[]>();



  addSubtask() {
    if (this.taskSubtask) {
      this.subtasks.push({ id: this.subtasks.length + 1, title: this.taskSubtask, done: false, hover: false, edit: false });
      this.taskSubtask = '';
      this.emitSubtasks();
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
    this.emitSubtasks();
  }

  emitSubtasks() {
    this.selectedSubTasks.emit(this.subtasks.map(subtask => ({ id: subtask.id, title: subtask.title, done: subtask.done })));
  }

  reloadInput(index: number) {
    this.subtaskEditInput = this.subtasks[index].title;
  }
}
