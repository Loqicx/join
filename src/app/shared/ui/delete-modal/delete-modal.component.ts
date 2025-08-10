import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../interfaces/contact';
import { ContactsService } from '../../services/firebase/contacts.service';
import { InitialLettersService } from '../../services/get-initial-letters.service';
import { ColoredProfilePipe } from '../../pipes/colored-profile.pipe';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-delete-modal',
  imports: [ButtonComponent, CommonModule, FormsModule, ColoredProfilePipe],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {
  @Input() contactToDelete!: Contact;

  isOpen = false;
  fullName = '';
  delete: string = 'nothing';

  contactsService = inject(ContactsService);
  contact: Contact | null = null;

  constructor(public initialLettersService: InitialLettersService) { }

  ngOnInit() {
    if (this.contactToDelete) {
      this.fullName = `${this.contactToDelete.firstName} ${this.contactToDelete.lastName}`;
    }
  }

  deleteContactModal(contactData: Contact) {
    this.delete = 'Contact';
    this.contact = { ...contactData };
    this.fullName = `${contactData.firstName} ${contactData.lastName}`;
    this.isOpen = true;
  }

  async deleteContact() {
    if (!this.contact?.id) {
      console.error('No contact to delete or missing id');
      return;
    }

    try {
      await this.contactsService.deleteContact(this.contact.id);
      this.isOpen = false; // Close the modal after deletion
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }

  closeModal() {
    this.isOpen = false;
  }
}
