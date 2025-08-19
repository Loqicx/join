import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from "../ui/button/button.component";
import { ContactsService } from '../services/firebase/contacts.service';
import { InitialLettersService } from '../services/get-initial-letters.service';
import { AssignContactInputComponent } from "../ui/assign-contact-input/assign-contact-input.component";
import { AssignSubtaskInputComponent } from "../ui/assign-subtask-input/assign-subtask-input.component";
import { TasksService } from '../services/firebase/tasks.service';
import { Task } from '../interfaces/task';
@Component({
  selector: 'app-add-task',
  imports: [CommonModule, FormsModule, MatSelectModule, ButtonComponent, AssignContactInputComponent, AssignSubtaskInputComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  selectedSubTasks: { id: string, title: string, done: boolean }[] = [];

  @Input() selectedContacts: any;
  @Input() taskStatus: number = 1;

  taskTitle: string = '';
  taskDescription: string = '';
  taskDueDate: Date = new Date;
  taskAssigned: any;
  taskCategory: string = '';
  priority: number | null = 2;

  buttonState: { urgent: boolean; medium: boolean; low: boolean } = {
    urgent: false,
    medium: false,
    low: false
  };

  task: Task = {
    priority: this.priority,
    title: this.taskTitle,
    category: this.setTaskCategory(),
    subtasks: [],
    dueDate: this.taskDueDate,
    assignedTo: [],
    description: this.taskDescription,
    status: this.taskStatus,
    id: '',
  }

  contactsService: ContactsService = inject(ContactsService);
  initialLetterService: InitialLettersService = inject(InitialLettersService);
  tasksService: TasksService = inject(TasksService)

  ngOnInit() {
    this.activateButton('medium');
  }

  setTaskCategory() {
    let taskCategoryNumber = 0;
    if (this.taskCategory === '2') {
      taskCategoryNumber = 2;
    } else if (this.taskCategory === '1') {
      taskCategoryNumber = 1;
    } else {
      taskCategoryNumber = 0;
    }
    return taskCategoryNumber;
  }

  setData() {
    this.task.priority = this.priority;
    this.task.category = this.setTaskCategory()
    this.task.title = this.taskTitle;
    this.task.description = this.taskDescription;
    this.task.dueDate = this.taskDueDate;
    this.task.assignedTo = this.selectedContacts?.map((contact: { id: any; }) => contact.id)
    this.task.subtasks = this.selectedSubTasks;
  }

  async saveTask(taskForm: NgForm) {
    if (!this.taskTitle || !this.taskDueDate || !this.taskCategory) {
      this.setData();
      console.error('Insufficient / Invalid Data in task Form!')
      console.log('task Data', this.task)
      console.log('assigned to:', this.task.assignedTo)
      console.log('subtasks', this.task.subtasks)
      console.log('priority', this.priority)
      console.log('category', this.taskCategory)
      return
    }
    this.setData();

    try {
      await this.tasksService.addTaskToDatabase(this.task);
    } catch (error) {
      console.error('Failed to Save Task!')
    }
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
    this.buttonState[btnName] = true
  }

  selectContacts(contacts: any) {
    this.selectedContacts = contacts[0];
  }

  selectSubTasks(subtasks: any) {
    this.selectedSubTasks = subtasks;
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.selectedContacts = [];
    this.selectedSubTasks = [];
    this.taskTitle = '';
    this.taskDescription = '';
    this.taskDueDate = new Date();
    this.taskCategory = '';
    this.priority = 2;
    this.buttonState = {
      urgent: false,
      medium: true,
      low: false
    };
  }
  }