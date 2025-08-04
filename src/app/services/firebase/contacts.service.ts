import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  onSnapshot,
} from '@angular/fire/firestore';
import { Contact } from '../../shared/interfaces/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactsService implements OnDestroy {
  unsubContacts;

  contacts: Contact[] = [];

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubContacts = this.subContactsList();
  }
  ngOnDestroy(): void {
    this.unsubContacts();
  }

  subContactsList() {
    return onSnapshot(this.getContactsRef(), (list) => {
      this.contacts = [];

      list.forEach((el) => {
        console.log(el.data());
        this.contacts.push(this.setContactObject(el.data(), el.id));
      });
    });
  }

  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }

  setContactObject(obj: any, id: string): Contact {
    return {
      id: id,
      firstName: obj.firstName || '',
      lastName: obj.lastName || '',
      email: obj.email || '',
      phoneNumber: obj.phoneNumber || '',
    };
  }

  async addContactToDatabase(contact: Contact) {
    let contactWithoutId = {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
    };
    await addDoc(this.getContactsRef(), contactWithoutId);
  }
}
