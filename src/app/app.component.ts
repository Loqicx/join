import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactsService } from './services/firebase/contacts.service';
import { Contact } from './shared/interfaces/contact';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'join-mmc';

  contact = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  contactsService: ContactsService = inject(ContactsService);
  constructor() {}

  submitContact() {
    this.contactsService.addContactToDatabase({ id: '', ...this.contact });
  }
}
