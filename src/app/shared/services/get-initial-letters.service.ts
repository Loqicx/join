import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InitialLettersService {
  constructor() {}
  getInitialLetters(contact: any): String {
    let firstNameInitial = contact.firstName.charAt(0);
    let lastNameInitial = contact.lastName.charAt(0);

    return firstNameInitial + lastNameInitial;
  }
}
