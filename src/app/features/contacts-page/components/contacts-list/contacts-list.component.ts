import {
  Component,
  EventEmitter,
  inject,
  OnChanges,
  OnInit,
  ViewChild,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ContactsService } from '../../../../shared/services/firebase/contacts.service';
import { ContactsCommunicationService } from '../../services/contacts-communication.service';
import { ObjectToArrayPipe } from '../../../../shared/pipes/object-to-array.pipe';
import { ColoredProfilePipe } from '../../../../shared/pipes/colored-profile.pipe';
import { InitialLettersService } from '../../../../shared/services/get-initial-letters.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { AddContactModalComponent } from '../add-contact-modal/add-contact-modal.component';

@Component({
  selector: 'app-contacts-list',
  imports: [ObjectToArrayPipe, ColoredProfilePipe, ButtonComponent, AddContactModalComponent],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss',
})
export class ContactsListComponent {
  contact = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  @Output() selectContact = new EventEmitter<void>();

  @ViewChild(AddContactModalComponent) addModal!: AddContactModalComponent


  activeContactId: string | null = null;
  initialLetterService: InitialLettersService = inject(InitialLettersService);

  constructor() {}

  groupedContacts: any = {};

  contactsService: ContactsService = inject(ContactsService);
  contactsComService: ContactsCommunicationService = inject(
    ContactsCommunicationService
  );

  openContactDetails(id: string) {
    this.activeContactId = id;
    this.contactsComService.setContactId(id);
    this.selectContact.emit();
  }

  openAddContactModal(){
    this.addModal.openModal();
  }
}
