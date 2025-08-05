import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsCommunicationService {
  currentContactId$ = new BehaviorSubject('');

  setContactId(value: string) {
    this.currentContactId$.next(value);
  }
  constructor() {}
}
