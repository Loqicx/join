import { CommonModule } from '@angular/common';
import { Component, inject, Input, Output, ViewChild, EventEmitter } from '@angular/core';
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
  selectedSubTasks: { title: string, done: boolean }[] = [];

  @Input() selectedContacts: any = [];
  @Input() taskStatus: number = 1;
  @Input() asModal: boolean = false;
  @Input() asEdit: boolean = false;
  @Input() assignedContactsNames: string = '';
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  taskTitle: string = '';
  taskDescription: string = '';
  taskDueDate: string = '';
  cleanedTaskDueDate: string = '';
  taskCategory: string = '';
  priority: number | null = 2;
  showTitleWarning: boolean = false;
  showCategoryWarning: boolean = false;

  @Input() task: Task = {
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

  @ViewChild(AssignContactInputComponent) AssignContactInputComponent!: AssignContactInputComponent;
  @ViewChild(DatePickerInputComponent) DatePickerInputComponent!: DatePickerInputComponent;

  buttonState: { urgent: boolean; medium: boolean; low: boolean } = {
    urgent: false,
    medium: false,
    low: false
  };

  contactsService: ContactsService = inject(ContactsService);
  initialLetterService: InitialLettersService = inject(InitialLettersService);
  tasksService: TasksService = inject(TasksService)

  ngOnInit() {
    this.activateButton('medium');
    if (this.asEdit) {
      this.setTaskData()
    }
    this.task.status = this.taskStatus
  }

  setTaskData() {
    this.taskTitle = this.task.title;
    this.taskDescription = this.task.description;
    this.taskDueDate = this.task.dueDate;
    this.taskCategory = this.getTaskCategory(this.task.category)
    this.priority = this.task.priority;
    this.activateButton(this.getButtonName(this.task.priority));
    this.cleanedTaskDueDate = this.cleanTaskDueDate(this.task.dueDate)
    this.selectedSubTasks = this.task.subtasks
  }

  setTaskDueDate(date: string) {
    this.taskDueDate = date;
  }

  cleanTaskDueDate(dueDate: string): string {
    const [year, month, day] = dueDate.split('-');
    return `${day}/${month}/${year}`;
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

  getTaskCategory(catergory: number | null): string {
    let taskCategoryString = '0';
    if (catergory === 2) {
      taskCategoryString = '2';
    } else if (catergory === 1) {
      taskCategoryString = '1';
    } else {
      taskCategoryString = '0';
    }
    return taskCategoryString;
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
    
    if (this.asEdit) {
      this.saveExistingTask(taskForm);
    } else {
      this.saveNewTask(taskForm);
    }
  }

  async saveExistingTask(taskForm: NgForm) {
    try {
      await this.tasksService.updateTask(this.task, this.task.id);
      this.closeModal.emit();
    } catch (error) {
      console.error('Failed to Update Task!')
    }
  }

  async saveNewTask(taskForm: NgForm) {
    try {
      await this.tasksService.addTaskToDatabase(this.task);
      this.resetForm(taskForm);
    } catch (error) {
      console.error('Failed to Save Task!')
    }
  }

  getButtonName(btnNum: number | null): "urgent" | "medium" | "low" {
    if (btnNum === 1) {
      return 'low';
    } else if (btnNum === 2) {
      return 'medium';
    } else if (btnNum === 3) {
      return 'urgent';
    } else {
      return 'medium'
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