import { Component, Output, EventEmitter, inject } from '@angular/core';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactsService } from '../../../../services/firebase/contacts.service';
import { Contact } from '../../../../shared/interfaces/contact';

@Component({
  selector: 'app-add-contact-modal',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './add-contact-modal.component.html',
  styleUrls: ['./add-contact-modal.component.scss'],
})
export class AddContactModalComponent {
  @Output() close = new EventEmitter<void>();

  isOpen = true;
  contactsService = inject(ContactsService);
  
  contact: Contact = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  closeModal() {
    this.close.emit();
  }

   async createContact() {
    if (!this.contact.firstName || !this.contact.email || !this.contact.phoneNumber) {
      console.warn('Pflichtfelder fehlen');
      return;
    }

    try {
      await this.contactsService.addContactToDatabase(this.contact);
      this.closeModal();
    } catch (error) {
      console.error('Fehler beim Speichern des Kontakts:', error);
    }
  }
}
