import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from "../ui/button/button.component";
import { ContactsService } from '../services/firebase/contacts.service';
import { InitialLettersService } from '../services/get-initial-letters.service';
import { AssignContactInputComponent } from "../ui/assign-contact-input/assign-contact-input.component";
import { AssignSubtaskInputComponent } from "../ui/assign-subtask-input/assign-subtask-input.component";
import { TasksService } from '../services/firebase/tasks.service';
import { Task } from '../interfaces/task';
import { DatePickerInputComponent } from "../ui/date-picker-input/date-picker-input.component";

/**
 * Component responsible for adding a new task.
 * 
 * @param {boolean} asModal - Indicates if the component is being used in a modal context.
 * @param {AssignContactInputComponent} AssignContactInputComponent - ViewChild for handling contact input.
 * @param {DatePickerInputComponent} DatePickerInputComponent - ViewChild for handling date picker input.
 * @param {Task[]} task - The task object containing all task details.
 * @throws {Error} If any input validation fails or the task cannot be saved to the database.
 */
@Component({
  selector: 'app-add-task',
  imports: [CommonModule, FormsModule, MatSelectModule, ButtonComponent, AssignContactInputComponent, AssignSubtaskInputComponent, DatePickerInputComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  selectedSubTasks: { id: number, title: string, done: boolean }[] = [];

  @Input() selectedContacts: any[] = [];
  @Input() taskStatus: number = 1;
  @Input() asModal: boolean = false;

  taskTitle: string = '';
  taskDescription: string = '';
  taskDueDate: string = new Date().toISOString().split('T')[0];
  taskCategory: string = '';
  priority: number | null = 2;
  showTitleWarning: boolean = false;
  showCategoryWarning: boolean = false;

  @ViewChild(AssignContactInputComponent) AssignContactInputComponent!: AssignContactInputComponent;
  @ViewChild(DatePickerInputComponent) DatePickerInputComponent!: DatePickerInputComponent;

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

  setTaskDueDate(date: string) {
    this.taskDueDate = date;
  }

  /**
     * Sets the task category based on input value.
     * 
     * @returns {number} The numerical representation of the task category (0, 1, or 2).
     */
  setTaskCategory(): number {
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

  /**
   * Updates the task data based on current input values.
   */
  setData() {
    this.task.priority = this.priority;
    this.task.category = this.setTaskCategory();
    this.task.title = this.taskTitle;
    this.task.description = this.taskDescription;
    this.task.dueDate = this.taskDueDate;
    this.task.assignedTo = this.selectedContacts?.map((contact: { id: any; }) => contact.id)
    this.task.subtasks = this.selectedSubTasks;
  }

  /**
   * Saves the task to the database.
   * 
   * @param {NgForm} taskForm - The NgForm instance representing the task form.
   * @returns {Promise<void>} A promise that resolves once the task is saved successfully or an error occurs.
   */
  async saveTask(taskForm: NgForm): Promise<void> {
    if (!this.taskTitle || !this.taskCategory || !this.DatePickerInputComponent.checkValidDate()) {
      if (!this.DatePickerInputComponent.checkValidDate()) {
        this.DatePickerInputComponent.showWarning = true;
      }
      if (!this.taskTitle) {
        this.showTitleWarning = true;
      }
      if (!this.taskCategory) {
        this.showCategoryWarning = true;
      }
      this.setData();
      return
    }
    this.setData();
    try {
      await this.tasksService.addTaskToDatabase(this.task);
      this.resetForm(taskForm);
    } catch (error) {
      console.error('Failed to Save Task!')
    }
  }

  /**
   * Activates the button corresponding to the specified priority level.
   * 
   * @param {string} btnName - The name of the button ('urgent', 'medium', or 'low').
   */
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

  /**
   * Gets the selected contacts from the assign contact Input's Output.
   * 
   * @param {any[]} contacts - The selected contacts to assign to the task.
   */
  selectContacts(contacts: any) {
    this.selectedContacts = contacts;
  }

  /**
   * Gets the selected subtasks from the assign subtask Input's Output.
   * 
   * @param {any[]} subtasks - The selected subtasks to add to the task.
   */
  selectSubTasks(subtasks: any) {
    this.selectedSubTasks = subtasks;
  }

  /**
   * Resets warning messages according to input type.
   * 
   * @param {string} warn - The type of warning message ('title', 'date', or 'category').
   */
  resetWarning(warn: string) {
    if (warn === 'title') {
      this.showTitleWarning = false;
    } else if (warn === 'date') {
      this.DatePickerInputComponent.showWarning = false;
    } else if (warn === 'category') {
      this.showCategoryWarning = false;
    }
  }

  /**
   * Resets the form and clears task data.
   * 
   * @param {NgForm} form - The NgForm instance representing the task form.
   */
  resetForm(form: NgForm) {
    this.AssignContactInputComponent.performReset();
    this.DatePickerInputComponent.resetCalendar();
    form.resetForm();
    this.selectedContacts = [];
    this.selectedSubTasks = [];
    this.taskTitle = '';
    this.taskDescription = '';
    this.taskDueDate = '';
    this.taskCategory = '0';
    this.priority = 2;
    this.buttonState = {
      urgent: false,
      medium: false,
      low: false
    };
    this.activateButton('medium');
  }
}