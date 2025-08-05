import {
  Component,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ContactsService } from '../../../../services/firebase/contacts.service';
import { ContactsCommunicationService } from '../../services/contacts-communication.service';

@Component({
  selector: 'app-contacts-list',
  imports: [],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss',
})
export class ContactsListComponent implements OnChanges, OnInit {
  contact = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  groupedContacts: any = {};

  contactsService: ContactsService = inject(ContactsService);
  contactsComService: ContactsCommunicationService = inject(
    ContactsCommunicationService
  );

  groupContacts() {
    this.contactsService.contacts.forEach((contact) => {
      console.log(contact);

      const initial = contact.firstName.charAt(0).toUpperCase();

      if (!this.groupedContacts[initial]) {
        this.groupedContacts[initial] = [];
      }

      this.groupedContacts[initial].push(contact);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.groupedContacts = {};
    this.groupContacts();
    console.log(this.groupedContacts);
  }

  ngOnInit(): void {
    this.groupedContacts = {};
    this.groupContacts();
    console.log(this.groupedContacts);
  }

  getInitialLetters(contact: any): String {
    let firstNameInitial = contact.firstName.charAt(0);
    let lastNameInitial = contact.lastName.charAt(0);

    return firstNameInitial + lastNameInitial;
  }

  openContactDetails(id: string) {
    this.contactsComService.setContactId(id);
  }
}
