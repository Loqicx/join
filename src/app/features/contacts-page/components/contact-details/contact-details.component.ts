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
  currentContact?: Contact | null;

  initialLettersService: InitialLettersService = inject(InitialLettersService);

  ngOnInit(): void {
    this.contactComService.currentContactId$.subscribe((id) =>
      this.updateDetailDisplay(id)
    );
  }

  updateDetailDisplay(id: string): void {
    const detailsEl = document.querySelector('#contactDetails');
    if (detailsEl && this.currentContact) {
      detailsEl.classList.remove('slide-in');
      detailsEl.classList.add('fade-out');
      setTimeout(() => {
        detailsEl.classList.remove('fade-out');
        this.currentContact = this.contactsService.getContactById(id);
        detailsEl.classList.add('slide-in');
      }, 190);
    } else {
      this.currentContact = this.contactsService.getContactById(id);
      if (detailsEl) {
        detailsEl.classList.add('slide-in');
      }
    }
  }
}
