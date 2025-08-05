import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { ContactsListComponent } from './components/contacts-list/contacts-list.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { AddContactModalComponent } from './components/add-contact-modal/add-contact-modal.component';


@Component({
  selector: 'app-contacts-page',
  imports: [HeaderComponent, ContactsListComponent, ContactDetailsComponent, ButtonComponent, CommonModule, AddContactModalComponent],
  templateUrl: './contacts-page.component.html',
  styleUrl: './contacts-page.component.scss',
})
export class ContactsPageComponent {
     isModalOpen = false;

  addContact() {
    console.log('Button wurde geklickt!');
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

 
}



