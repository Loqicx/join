import { Component, inject,Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactsService } from '../../services/firebase/contacts.service';
import { Contact } from '../../interfaces/contact';
import { CommonModule } from '@angular/common';
import { ColoredProfilePipe } from '../../pipes/colored-profile.pipe';
import { InitialLettersService } from '../../services/get-initial-letters.service';

@Component({
  selector: 'app-assign-contact-input',
  imports: [FormsModule, CommonModule, ColoredProfilePipe],
  templateUrl: './assign-contact-input.component.html',
  styleUrl: './assign-contact-input.component.scss',
})
export class AssignContactInputComponent {
  taskAssignInput: any;
  contacts: Contact[] = [];
  contactsArray: [] | any = [];
  searchArray: [] | any = [];
  filteredContacts: Contact[] = [];

  show = false
  dNone: boolean = true;

  constructor(private renderer: Renderer2) {
    this.renderer.listen('document', 'pointerdown', (event) => {
      const wrapper = document.querySelector('.assing-wrapper');
      if (this.show && wrapper && !wrapper.contains(event.target as Node)) {
        this.visibleFalse();
      }
    });
  }

  private contactsService: ContactsService = inject(ContactsService)
  public initialLettersService: InitialLettersService = inject(InitialLettersService);

  ngAfterViewInit() {
    this.loadContacts();
  }

  async loadContacts() {
    this.contacts = await this.contactsService.getContacts();
  }

  filterContacts(searchValue?: string) {
    if (!searchValue || searchValue.length < 1) {
      this.searchArray = this.contacts

      return this.contacts;
    }

    this.filteredContacts = this.contacts.filter((contact) => {
      const fullName =
        `${contact.firstName} ${contact.lastName}`.toLocaleLowerCase();

      return fullName.match(searchValue.toLocaleLowerCase());
    });
    this.searchArray = this.filteredContacts;

    return this.filteredContacts;
  }

  toggleContactStyle(contact: Contact) {
    document.getElementById(`contactCard${contact.id}`)?.classList.toggle('active');
    document.getElementById(`contactSelectBox${contact.id}`)?.classList.toggle('active');
    document.getElementById(`contactSelectCheckWrap${contact.id}`)?.classList.toggle('active');
  }

  toggleVisibility() {
    this.show ? this.visibleFalse() : this.visibleTrue();
  }

  visibleTrue() {
    this.dNone = false;
    setTimeout(() => {
      this.show = true;
    }, 50);
  }

  visibleFalse() {
    this.show = false;
    setTimeout(() => {
      this.dNone = true;
    }, 300);
  }

}