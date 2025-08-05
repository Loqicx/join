import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { ContactsListComponent } from './components/contacts-list/contacts-list.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-contacts-page',
  imports: [HeaderComponent, ContactsListComponent, ContactDetailsComponent, ButtonComponent],
  templateUrl: './contacts-page.component.html',
  styleUrl: './contacts-page.component.scss',
})
export class ContactsPageComponent {}
