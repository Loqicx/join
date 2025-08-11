import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Contact } from '../../../../shared/interfaces/contact';
import { ContactsService } from '../../../../shared/services/firebase/contacts.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColoredProfilePipe } from '../../../../shared/pipes/colored-profile.pipe';
import { InitialLettersService } from '../../../../shared/services/get-initial-letters.service';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';

@Component({
  selector: 'app-edit-contact-modal',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule, ColoredProfilePipe,],
  templateUrl: './edit-contact-modal.component.html',
  styleUrls: ['./edit-contact-modal.component.scss'],
})
export class EditContactModalComponent {
  constructor(public initialLettersService: InitialLettersService) { }
  @Input() contactToEdit!: Contact;
  @Output() close = new EventEmitter<void>();
  @Output() deleteModal = new EventEmitter<void>();

  isOpen = false;
  isSlide = false
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
    setTimeout(() => {
      this.isSlide = true;
    }, 25);
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
      window.location.reload()
    } catch (error) {
      console.error('Update failed:', error);
    }
  }

  deleteContact() {
    this.deleteModal.emit();
    this.closeModal();
  }

  closeModal() {
    this.isSlide = false;
    setTimeout(() => {
      this.isOpen = false;
    }, 600);
  }
}