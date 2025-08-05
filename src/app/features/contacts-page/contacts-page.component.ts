import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { ContactsListComponent } from './components/contacts-list/contacts-list.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';

@Component({
  selector: 'app-contacts-page',
  imports: [HeaderComponent, ContactsListComponent, ContactDetailsComponent],
  templateUrl: './contacts-page.component.html',
  styleUrl: './contacts-page.component.scss',
})
export class ContactsPageComponent {}
