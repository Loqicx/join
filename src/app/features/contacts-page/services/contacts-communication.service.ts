import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsCommunicationService {
  contactId = new BehaviorSubject('');
  currentContactId$ = this.contactId.asObservable();

  setContactId(value: string) {
    this.contactId.next(value);
  }
  constructor() {}
}
