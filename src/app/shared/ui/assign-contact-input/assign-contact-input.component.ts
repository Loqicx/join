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
  providers: [ObjectToArrayPipe]
})
export class AssignContactInputComponent {
  taskAssignInput: any;
  contacts: {} | Contact = {};
  contactsArray: [] | any = [];
  searchArray: [] | any = [];

  contactsService: ContactsService = inject(ContactsService);

  constructor(private contactPipe: ObjectToArrayPipe) {

  }

  ngAfterViewInit() {
    this.findContact('An');
  }

  findContact(name: string) {
    this.contacts = 
    this.contactsArray = [];
    this.contactsArray = this.contactPipe.transform(this.contactsService.contacts)

    this.contactsArray.forEach((key: any)=> {
      console.log(key)
    });
    console.log(this.contactsArray)
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