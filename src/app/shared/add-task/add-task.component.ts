import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from "../ui/button/button.component";
import { ContactsService } from '../services/firebase/contacts.service';
import { InitialLettersService } from '../services/get-initial-letters.service';
import { AssignContactInputComponent } from "../ui/assign-contact-input/assign-contact-input.component";

@Component({
  selector: 'app-add-task',
  imports: [CommonModule, FormsModule, MatSelectModule, ButtonComponent, AssignContactInputComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {

  categoryDummy = ['Nutzlos', 'Sinnlos', 'ABM']
  subtasks: { id: number, title: string }[] = [];

  taskTitle: any;
  taskDescription: any;
  taskDueDate: any;
  taskAssigned: any;
  taskCategory: any;
  taskSubtask: any;
  taskAssignedInput: any;

  buttonState: { urgent: boolean; medium: boolean; low: boolean } = {
    urgent: false,
    medium: false,
    low: false
  };

  contactsService: ContactsService = inject(ContactsService);
  initialLetterService: InitialLettersService = inject(InitialLettersService);

  saveTask(taskForm: NgForm) {
    console.log('task Saved!' + taskForm)
  }

  activateButton(btnName: 'urgent' | 'medium' | 'low') {
    if (this.buttonState[btnName]) {
      this.buttonState[btnName] = false
    } else {
      this.buttonState[btnName] = true
    }
  }
}