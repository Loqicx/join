import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../interfaces/task';
import { Contact } from '../interfaces/contact';
import { ContactsService } from '../services/firebase/contacts.service';
import { InitialLettersService } from '../services/get-initial-letters.service';
import { ColoredProfilePipe } from '../pipes/colored-profile.pipe';
import { TaskCategory, TasksService } from '../services/firebase/tasks.service';
import { SVGInlineService } from '../services/svg-inline.service';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-task-card-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card-modal.component.html',
  styleUrls: ['./task-card-modal.component.scss'],
  providers: [ColoredProfilePipe, SVGInlineService],
})
export class TaskCardModalComponent implements OnInit {
  svgContents: { [key: string]: SafeHtml } = {};
  icons = [
    { name: 'edit', src: './assets/icons/edit.svg' },
    { name: 'delete', src: './assets/icons/delete.svg' },
  ];

  constructor(
    private svgService: SVGInlineService,
    private sanitizer: DomSanitizer
  ) {}

  @Input() task!: Task;

  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<Task>();
  @Output() edit = new EventEmitter<Task>();

  assignedContacts: { initials: String; color: String; name: String }[] = [];

  contactsService: ContactsService = inject(ContactsService);
  initialLetterService: InitialLettersService = inject(InitialLettersService);
  coloredProfilePipe: ColoredProfilePipe = inject(ColoredProfilePipe);
  taskTechnical: boolean = false;
  taskUserStory: boolean = false;
  taskCategory: string = '';
  tasksService: TasksService = inject(TasksService);


  ngOnInit(): void {
    this.updateAssignedContacts();
    this.taskCategory = this.getTaskCategory();

    this.icons.forEach((icon) => {
      this.convertIcon(icon.name, icon.src);
    });
  }

  updateAssignedContacts(): void {
    this.assignedContacts = [];

    if (!this.task || !this.task.assignedTo) return;

    for (let i = 0; i < this.task.assignedTo.length; i++) {
      const id = this.task.assignedTo[i];
      const contact: Contact | undefined =
        this.contactsService.getContactById(id);

      if (contact) {
        const initials: String =
          this.initialLetterService.getInitialLetters(contact);
        const color: String = this.coloredProfilePipe.transform(contact.id);
        this.assignedContacts.push({
          initials,
          color,
          name: `${contact.firstName} ${contact.lastName}`,
        });
      } else {
        this.assignedContacts.push({
          initials: '??',
          color: '#999',
          name: 'Unknown',
        });
      }
    }
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

  convertIcon(iconName: string, iconSrc: string): void {
    this.svgService.getInlineSVG(iconSrc).subscribe({
      next: (svg: string) => {
        this.svgContents[iconName] =
          this.sanitizer.bypassSecurityTrustHtml(svg);
      },
      error: (err) => console.error('SVG load error:', err),
    });
  }

  onClose() {
    this.close.emit();
  }

  async openDeleteModal() {
  if (this.task) {
    try {
      await this.tasksService.deleteTask(this.task.id);

      console.log(`Task with ID ${this.task.id} deleted from DB.`);

      this.close.emit();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
}
}
