import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from "../ui/button/button.component";
import { ContactsService } from '../services/firebase/contacts.service';
import { InitialLettersService } from '../services/get-initial-letters.service';
import { AssignContactInputComponent } from "../ui/assign-contact-input/assign-contact-input.component";
import { AssignSubtaskInputComponent } from "../ui/assign-subtask-input/assign-subtask-input.component";
import { TaskService } from '../../services/task.service';
import { Task } from '../interfaces/task';
@Component({
  selector: 'app-add-task',
  imports: [CommonModule, FormsModule, MatSelectModule, ButtonComponent, AssignContactInputComponent, AssignSubtaskInputComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  selectedSubTasks: string[] = [];

  categoryDummy = ['Nutzlos', 'Sinnlos', 'ABM']
  @Input() selectedContacts: any;

  taskTitle: any;
  taskDescription: any;
  taskDueDate: any;
  taskAssigned: any;
  taskCategory: any = '';
  taskAssignedInput: any;

  buttonState: { urgent: boolean; medium: boolean; low: boolean } = {
    urgent: false,
    medium: false,
    low: false
  };

  task: Task = {
  priority: 0,
  title: '',
  category: 1,
  subtasks: [{title: '', done: false}],
  dueDate: new Date(),
  assignedTo: [''],
  description: '',
  status: 0,
  id: '',
}

contactsService: ContactsService = inject(ContactsService);
initialLetterService: InitialLettersService = inject(InitialLettersService);

taskService = inject(TaskService)

saveTask(taskForm: NgForm) {
  console.log('task Saved!' + taskForm)
}

activateButton(btnName: 'urgent' | 'medium' | 'low') {
  if (btnName === 'low') {
    this.buttonState['urgent'] = false
    this.buttonState['medium'] = false
  } else if (btnName === 'medium') {
    this.buttonState['urgent'] = false
    this.buttonState['low'] = false
  } else if (btnName === 'urgent') {
    this.buttonState['low'] = false
    this.buttonState['medium'] = false
  }
  if (this.buttonState[btnName]) {
    this.buttonState[btnName] = false
  } else {
    this.buttonState[btnName] = true
  }
}

selectContacts(contacts: any) {
  this.selectedContacts = contacts[0];
}

selectSubTasks(subtasks: any) {
  this.selectedSubTasks = subtasks[0];
}
}