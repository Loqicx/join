import {
  Component,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ContactsService } from '../../../../services/firebase/contacts.service';
import { ContactsCommunicationService } from '../../services/contacts-communication.service';
import { ObjectToArrayPipe } from '../../../../shared/pipes/object-to-array.pipe';
import { ColoredProfilePipe } from '../../../../shared/pipes/colored-profile.pipe';
import { InitialLettersService } from '../../../../shared/services/get-initial-letters.service';

@Component({
  selector: 'app-contacts-list',
  imports: [ObjectToArrayPipe, ColoredProfilePipe],
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
  }
}
