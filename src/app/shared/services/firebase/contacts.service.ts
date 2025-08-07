import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Contact } from '../../interfaces/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactsService implements OnDestroy {
  unsubContacts;

  contacts: { [initial: string]: Contact[] } = {};

  firestore: Firestore = inject(Firestore);
  firstName: any;

  constructor() {
    this.unsubContacts = this.subContactsList();
  }
  ngOnDestroy(): void {
    this.unsubContacts();
  }

  subContactsList() {
    return onSnapshot(this.getContactsRef(), (list) => {
      this.contacts = {};

      let initials: string[] = [];

      list.forEach((el) => {
        const tmpContact = this.setContactObject(el.data(), el.id);
        const initial: string = tmpContact.firstName.charAt(0).toUpperCase();
        if (!initials.includes(initial)) {
          initials.push(initial);
        }
      });

      initials.sort();

      initials.forEach((initial) => {
        this.contacts[initial] = [];
      });

      list.forEach((el) => {
        const contact = this.setContactObject(el.data(), el.id);
        const initial: string = contact.firstName.charAt(0).toUpperCase();

        this.contacts[initial].push(contact);
        // this.contacts.push(this.setContactObject(el.data(), el.id));
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

  getContactById(id: string) {
    for (const [initial, contacts] of Object.entries(this.contacts)) {
      let result = contacts.find((contact) => contact.id === id);
      if (result) return result;
    }
    return undefined;
  }

  async deleteContact(contactId: string) {
    await deleteDoc(doc(this.firestore, 'contacts', contactId));
  }

  async updateContact(contact: {}, id: string) {
    if (!id) {
      throw new Error('Contact ID is required');
    }
    const contactRef = doc(this.firestore, 'contacts', id);
    await updateDoc(contactRef, contact);
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
