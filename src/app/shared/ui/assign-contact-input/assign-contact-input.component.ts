import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactsService } from '../../services/firebase/contacts.service';
import { ObjectToArrayPipe } from '../../pipes/object-to-array.pipe';
import { Contact } from '../../interfaces/contact';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-contact-input',
  imports: [FormsModule, CommonModule],
  templateUrl: './assign-contact-input.component.html',
  styleUrl: './assign-contact-input.component.scss',
  providers: [ObjectToArrayPipe],
})
export class AssignContactInputComponent {
  taskAssignInput: any;
  contacts: Contact[] = [];
  contactsArray: [] | any = [];
  searchArray: [] | any = [];
  filteredContacts: Contact[] = [];

  constructor(
    private contactPipe: ObjectToArrayPipe,
    private contactsService: ContactsService
  ) {}

  ngAfterViewInit() {
    this.loadContacts();
  }

  async loadContacts() {
    this.contacts = await this.contactsService.getContacts();
  }

  filterContacts(searchValue: string) {
    if (!searchValue || searchValue.length < 3) {
      return this.contacts;
    }

    this.filteredContacts = this.contacts.filter((contact) => {
      const fullName =
        `${contact.firstName} ${contact.lastName}`.toLocaleLowerCase();

      return fullName.includes(searchValue.toLocaleLowerCase());
    });
    console.log(this.filteredContacts);

    return this.filteredContacts;
  }
}

/* findContact(name: string) {
    this.contactsArray = [];
    Object.values(this.contactsService.contacts).forEach((contact: Contact | any) => {
      let search = contact.firstName.toLowerCase().includes(name.toLowerCase()) || contact
      this.contactsArray.push = search;
    });
    console.log(this.contactsArray)
  } */
