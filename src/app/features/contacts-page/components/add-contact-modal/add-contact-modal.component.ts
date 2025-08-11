import { Component, Output, EventEmitter, inject } from '@angular/core';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactsService } from '../../../../shared/services/firebase/contacts.service';
import { Contact } from '../../../../shared/interfaces/contact';
import { ColoredProfilePipe } from '../../../../shared/pipes/colored-profile.pipe';
import { InitialLettersService } from '../../../../shared/services/get-initial-letters.service';

@Component({
  selector: 'app-add-contact-modal',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule, ColoredProfilePipe],
  templateUrl: './add-contact-modal.component.html',
  styleUrls: ['./add-contact-modal.component.scss'],
})
export class AddContactModalComponent {
  initialLettersService = inject(InitialLettersService);
  @Output() close = new EventEmitter<void>();

  isOpen = false;
  isSlide = false;
  contactsService = inject(ContactsService);
  fullName = '';
  contactName = '';

  contact: Contact = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  // closeModal() {
  //   this.close.emit();
  // }
  openModal() {
    this.isOpen = true;
    setTimeout(() => {
      this.isSlide = true;
    }, 25);
  }

  closeModal() {
    this.isSlide = false;
    setTimeout(() => {
      this.isOpen = false;
    }, 600);
  }

  formSubmit(form: NgForm) {
    console.log('form clicked');
    if (!form.valid) {
      console.log('form invalid');
      return;
    }
    this.contactName = form.controls['fullName'].value;
  }

  async createContact() {
    if (!this.fullName || !this.contact.email || !this.contact.phoneNumber) {
      console.warn('Pflichtfelder fehlen');
      return;
    }

    const nameParts = this.fullName.trim().split(' ');
    this.contact.firstName = nameParts[0].toUpperCase();
    this.contact.lastName = nameParts.slice(1).join(' ').toUpperCase();

    try {
      await this.contactsService.addContactToDatabase(this.contact);
      this.closeModal();
    } catch (error) {
      console.error('Fehler beim Speichern des Kontakts:', error);
    }
  }
  get liveInitials(): string {
    let [firstName = '', lastName = ''] = (this.fullName || '').split(' ');
    return String(this.initialLettersService.getInitialLetters({ firstName, lastName }));
  }
}
