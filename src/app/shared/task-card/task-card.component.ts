import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../interfaces/task';
import { TaskCategory } from '../services/firebase/tasks.service';
import { Contact } from '../interfaces/contact';
import { ContactsService } from '../services/firebase/contacts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit, OnDestroy {
  @Input() task!: Task;
  taskTechnical: boolean = false;
  taskUserStory: boolean = false;
  taskCategory: string = '';

  assignedInitials: string[] = [];

  contactsService: ContactsService = inject(ContactsService);

  private contactSub: Subscription | null = null;

  constructor() {}

  ngOnInit(): void {
    this.taskCategory = this.getTaskCategory();
    this.updateAssignedInitials();
  }

  ngOnDestroy(): void {
    if (this.contactSub) this.contactSub.unsubscribe();
  }

  updateAssignedInitials(): void {
    this.assignedInitials = this.task.assignedTo.map((id: string) => {
      const contact: Contact | undefined = this.contactsService.getContactById(id);
      if (contact) {
        return (contact.firstName.charAt(0) + contact.lastName.charAt(0)).toUpperCase();
      } else {
        return '??';
      }
    });
  }

  subtasksDone(): number {
    return this.task.subtasks.filter((s) => s.done).length;
  }

  subtasksTotal(): number {
    return this.task.subtasks.length;
  }

  getTaskCategory() {
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
        return 'Default Task';
    }
  }
}
