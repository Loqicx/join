import { Component, inject, OnInit } from '@angular/core';
import { ContactsCommunicationService } from '../../services/contacts-communication.service';
import { ContactsService } from '../../../../services/firebase/contacts.service';
import { Contact } from '../../../../shared/interfaces/contact';
import { ColoredProfilePipe } from '../../../../shared/pipes/colored-profile.pipe';
import { InitialLettersService } from '../../../../shared/services/get-initial-letters.service';

@Component({
  selector: 'app-contact-details',
  imports: [ColoredProfilePipe],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit {
  contactComService = inject(ContactsCommunicationService);
  contactsService = inject(ContactsService);
  contactId$: string = '';
  currentContact?: Contact;

  initialLettersService: InitialLettersService = inject(InitialLettersService);

  ngOnInit(): void {
    this.contactComService.currentContactId$.subscribe((id) =>
      this.updateDetailDisplay(id)
    );
  }

  updateDetailDisplay(id: string): void {
    this.currentContact = this.contactsService.getContactById(id);
    console.log(this.currentContact);
  }
}
