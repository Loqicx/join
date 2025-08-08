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

  isOpen = true;
  contactsService = inject(ContactsService);
  fullName = '';

  ngOnInit() {
    if (this.contactToEdit) {
      this.fullName = `${this.contactToEdit.firstName} ${this.contactToEdit.lastName}`;
    }
  }

  // async saveContact() {
  //   const nameParts = this.fullName.trim().split(' ');
  //   this.contactToEdit.firstName = nameParts[0];
  //   this.contactToEdit.lastName = nameParts.slice(1).join(' ');

  //   try {
  //     await this.contactsService.updateContactInDatabase(this.contactToEdit);
  //     this.close.emit();
  //   } catch (error) {
  //     console.error('Update failed:', error);
  //   }
  // }

  // async deleteContact() {
  //   try {
  //     await this.contactsService.deleteContactFromDatabase(this.contactToEdit.id);
  //     this.close.emit();
  //   } catch (error) {
  //     console.error('Delete failed:', error);
  //   }
  // }

  closeModal() {
    this.close.emit();
  }
}
