import { Component, inject, ViewChild } from '@angular/core';
import { ContactsListComponent } from './components/contacts-list/contacts-list.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { AddContactModalComponent } from './components/add-contact-modal/add-contact-modal.component';

import { ContactsService } from '../../shared/services/firebase/contacts.service';
import { FormsModule } from '@angular/forms';
import { EditContactModalComponent } from './components/edit-contact-modal/edit-contact-modal.component';

@Component({
  selector: 'app-contacts-page',
  imports: [
    ContactsListComponent,
    ContactDetailsComponent,
    ButtonComponent,
    CommonModule,
    AddContactModalComponent,
    FormsModule,
  ],
  templateUrl: './contacts-page.component.html',
  styleUrl: './contacts-page.component.scss',
})
export class ContactsPageComponent {
  contact = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  @ViewChild(AddContactModalComponent) addModal!: AddContactModalComponent

  isDetailOpen = false;

  contactsService: ContactsService = inject(ContactsService);

  constructor() {}

  closeDetails() {
    this.isDetailOpen = false;
  }

  openDetails() {
    if (window.innerWidth < 993) {
      this.isDetailOpen = true;
    }
  }

  openAddContactModal(){
    console.log('openAddContactModal called');
    this.addModal.openModal();
    
    
  }
}
