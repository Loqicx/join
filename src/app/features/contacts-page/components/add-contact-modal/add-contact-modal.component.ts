import {
  Component,
  Output,
  EventEmitter,
  inject,
  Renderer2,
} from '@angular/core';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactsService } from '../../../../shared/services/firebase/contacts.service';
import { Contact } from '../../../../shared/interfaces/contact';
import { InitialLettersService } from '../../../../shared/services/get-initial-letters.service';

@Component({
  selector: 'app-add-contact-modal',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule],
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

  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'pointerdown', (event) => {
      const modal = document.querySelector('.modal');
      if (this.isOpen && modal && !modal.contains(event.target as Node)) {
        this.closeModal();
      }
    });
  }

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
      this.clearModalForm();
    }, 600);
  }

  formSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.contactName = form.controls['fullName'].value;
  }

  async createContact(form: NgForm) {
    if (!this.fullName || !this.contact.email || !this.contact.phoneNumber) {
      console.warn('Pflichtfelder fehlen');
      return;
    }
    if (!form.valid) return;

    const nameParts = this.fullName.trim().split(' ');
    this.contact.firstName = nameParts.slice(0, 1).join('');
    this.contact.lastName = nameParts.slice(1).join('');

    try {
      await this.contactsService.addContactToDatabase(this.contact);
      this.closeModal();
    } catch (error) {
      console.error('Fehler beim Speichern des Kontakts:', error);
    }
  }
  get liveInitials(): string {
    let [firstName = '', lastName = ''] = (this.fullName || '').split(' ');
    return String(
      this.initialLettersService.getInitialLetters({ firstName, lastName })
    );
  }

  onNameInput(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    let parts = value.split(' ').filter((p) => p.length > 0);

    parts = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1));

    this.fullName = parts.join(' ');
  }

  clearModalForm() {
    this.fullName = '';
    this.contact = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    };
  }
}
