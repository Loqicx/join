import { Component, Input, Renderer2, inject } from '@angular/core';
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
  slideIn = false;
  fullName = '';
  delete: string = 'nothing';

  contactsService = inject(ContactsService);
  contact = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  constructor(public initialLettersService: InitialLettersService, private renderer: Renderer2) { 
    this.renderer.listen('window', 'click', (event) => {
      const modal = document.querySelector('.modal');
      if (this.isOpen && modal && !modal.contains(event.target as Node)) {
        this.closeModal();
      }
    });
  }

  deleteContactModal(contactData: Contact) {
    this.delete = 'Contact';
    this.contact = { ...contactData };
    this.fullName = `${contactData.firstName} ${contactData.lastName}`;
    this.isOpen = true;
    setTimeout(() => {
      this.slideIn = true;
    }, 25);
  }

  async deleteContact() {
    if (!this.contact?.id) {
      console.error('No contact to delete or missing id');
      return;
    }

    try {
      await this.contactsService.deleteContact(this.contact.id);
      this.isOpen = false; // Close the modal after deletion
      window.location.reload()
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }

  closeModal() {
    this.slideIn = false;
    setTimeout(() => {
      this.isOpen = false;
    }, 250);
  }
}
