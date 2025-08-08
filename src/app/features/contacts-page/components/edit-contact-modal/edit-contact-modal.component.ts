import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Contact } from '../../../../shared/interfaces/contact';
import { ContactsService } from '../../../../shared/services/firebase/contacts.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-contact-modal',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './edit-contact-modal.component.html',
  styleUrls: ['./edit-contact-modal.component.scss'],
})
export class EditContactModalComponent {
  @Input() contactToEdit!: Contact;
  @Output() close = new EventEmitter<void>();

  isOpen = false;
  contactsService = inject(ContactsService);
  fullName = '';

  contact: Contact | null = null;

  ngOnInit() {
    if (this.contactToEdit) {
      this.fullName = `${this.contactToEdit.firstName} ${this.contactToEdit.lastName}`;
    }
  }

  openModal(contactData: Contact) {
    this.contact = { ...contactData };
    this.fullName = `${contactData.firstName} ${contactData.lastName}`;
    this.isOpen = true;
  }

  async saveContact() {
    if (!this.contact) {
      console.error('No contact loaded');
      return;
    }

    const nameParts = this.fullName.trim().split(' ');
    this.contact.firstName = nameParts[0];
    this.contact.lastName = nameParts.slice(1).join(' ');

    try {
      await this.contactsService.updateContact(this.contact, this.contact.id);
      this.close.emit();
    } catch (error) {
      console.error('Update failed:', error);
    }
  }

  async deleteContact() {
  if (!this.contact?.id) {
    console.error('No contact to delete or missing id');
    return;
  }
  try {
    await this.contactsService.deleteContact(this.contact.id);
    this.close.emit();
  } catch (error) {
    console.error('Delete failed:', error);
  }
}

  closeModal() {
    this.isOpen = false;
  }
}