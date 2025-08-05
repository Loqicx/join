import { Component, inject } from '@angular/core';
import { ContactsService } from '../../../../services/firebase/contacts.service';
import { ContactsCommunicationService } from '../../services/contacts-communication.service';

@Component({
  selector: 'app-contacts-list',
  imports: [],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss',
})
export class ContactsListComponent {
  contact = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  contactsService: ContactsService = inject(ContactsService);
  contactsComService: ContactsCommunicationService = inject(
    ContactsCommunicationService
  );

  getInitialLetters(contact: any): String {
    let firstNameInitial = contact.firstName.charAt(0);
    let lastNameInitial = contact.lastName.charAt(0);

    return firstNameInitial + lastNameInitial;
  }

  openContactDetails(id: string) {
    this.contactsComService.setContactId(id);
  }
}
