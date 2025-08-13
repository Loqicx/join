import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from "../ui/button/button.component";
import { ContactsService } from '../services/firebase/contacts.service';
import { ObjectToArrayPipe } from '../pipes/object-to-array.pipe';
import { ColoredProfilePipe } from "../pipes/colored-profile.pipe";
import { InitialLettersService } from '../services/get-initial-letters.service';

@Component({
  selector: 'app-add-task',
  imports: [CommonModule, FormsModule, MatSelectModule, ButtonComponent, ObjectToArrayPipe, ColoredProfilePipe],
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

  contactsService: ContactsService = inject(ContactsService);
  initialLetterService: InitialLettersService = inject(InitialLettersService);
taskAssignedInput: any;


  saveTask(taskForm: NgForm) {
    console.log('task Saved!' + taskForm)
  }
}
