import { Component, inject } from '@angular/core';
import { ContactsListComponent } from './components/contacts-list/contacts-list.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { AddContactModalComponent } from './components/add-contact-modal/add-contact-modal.component';

import { ContactsService } from '../../shared/services/firebase/contacts.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts-page',
  imports: [
    ContactsListComponent,
    ContactDetailsComponent,
    ButtonComponent,
    CommonModule,
    AddContactModalComponent,
    FormsModule,
  ],
  templateUrl: './contacts-page.component.html',
  styleUrl: './contacts-page.component.scss',
})
export class ContactsPageComponent {
  contact = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  isAddModalOpen = false;
  isDetailOpen = false;

  contactsService: ContactsService = inject(ContactsService);

  submitContact() {
    let tempContact = this.generatePersonData(
      this.contact.firstName,
      this.contact.lastName
    );
    this.contactsService.addContactToDatabase({ id: '', ...tempContact });
    this.contact.firstName = '';
    this.contact.lastName = '';
  }

  // temp function
  generatePersonData(fN: string, lN: string) {
    const email = `${fN.toLowerCase()}.${lN.toLowerCase()}@mail.com`;

    // random but real looking phone number
    const mobilePrefixes = [
      '0151',
      '0160',
      '0170',
      '0171',
      '0175',
      '0176',
      '0177',
      '0178',
      '0179',
      '0162',
      '0163',
      '0157',
      '0159',
    ];
    const randomPrefix =
      mobilePrefixes[Math.floor(Math.random() * mobilePrefixes.length)];
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // random 8 digit number
    const phoneNumber = `${randomPrefix}${randomNumber}`;

    return {
      firstName: fN,
      lastName: lN,
      email: email,
      phoneNumber: phoneNumber,
    };
  }

  addContact() {
    this.isAddModalOpen = true;
  }

  closeModal() {
    this.isAddModalOpen = false;
  }
}
