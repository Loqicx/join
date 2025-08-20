import {
  Component,
  inject,
  Input,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../interfaces/task';
import { TaskCategory } from '../services/firebase/tasks.service';
import { Contact } from '../interfaces/contact';
import { ContactsService } from '../services/firebase/contacts.service';
import { InitialLettersService } from '../services/get-initial-letters.service';
import { ColoredProfilePipe } from '../pipes/colored-profile.pipe';
import { TruncateStringPipe } from '../pipes/truncate-string.pipe';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, TruncateStringPipe],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  providers: [ColoredProfilePipe, TruncateStringPipe],
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;

  @Output() open = new EventEmitter<Task>();

  taskTechnical: boolean = false;
  taskUserStory: boolean = false;
  taskCategory: string = '';

  assignedInitials: { initials: String; color: String }[] = [];

  contactsService: ContactsService = inject(ContactsService);
  initialLetterService: InitialLettersService = inject(InitialLettersService);
  coloredProfilePipe: ColoredProfilePipe = inject(ColoredProfilePipe);

  constructor() {}

  ngOnInit(): void {
    this.taskCategory = this.getTaskCategory();
    this.updateAssignedInitials();
  }

  openModal() {
    this.open.emit(this.task);
  }

  updateAssignedInitials(): void {
    this.assignedInitials = [];

    if (!this.task || !this.task.assignedTo) {
      return;
    }

    for (let i = 0; i < this.task.assignedTo.length; i++) {
      const id = this.task.assignedTo[i];
      const contact: Contact | undefined =
        this.contactsService.getContactById(id);

      if (contact) {
        const initials: String =
          this.initialLetterService.getInitialLetters(contact);
        const color: String = this.coloredProfilePipe.transform(contact.id);
        this.assignedInitials.push({ initials: initials, color: color });
      } else {
        this.assignedInitials.push({ initials: '??', color: '#999' });
      }
    }
  }

  subtasksDone(): number {
    let count = 0;
    if (!this.task || !this.task.subtasks) return 0;
    for (let i = 0; i < this.task.subtasks.length; i++) {
      if (this.task.subtasks[i].done) count++;
    }
    return count;
  }

  subtasksTotal(): number {
    if (!this.task || !this.task.subtasks) return 0;
    return this.task.subtasks.length;
  }

  getTaskCategory(): string {
    switch (this.task.category) {
      case TaskCategory.TECHNICAL_TASK:
        this.taskTechnical = true;
        this.taskUserStory = false;
        return 'Technical Task';
      case TaskCategory.USER_STORY:
        this.taskTechnical = false;
        this.taskUserStory = true;
        return 'User Story';
      default:
        this.taskTechnical = false;
        this.taskUserStory = false;
        return 'Default Task';
    }
  }
}
