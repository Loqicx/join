import { Component, Input, Output, EventEmitter, Renderer2, inject } from '@angular/core';
import { Contact } from '../../../../shared/interfaces/contact';
import { ContactsService } from '../../../../shared/services/firebase/contacts.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ColoredProfilePipe } from '../../../../shared/pipes/colored-profile.pipe';
import { InitialLettersService } from '../../../../shared/services/get-initial-letters.service';
import { SVGInlineService } from '../../../../shared/services/svg-inline.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-edit-contact-modal',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule, ColoredProfilePipe],
  templateUrl: './edit-contact-modal.component.html',
  styleUrls: ['./edit-contact-modal.component.scss'],
})
export class EditContactModalComponent {
  svgContent!: SafeHtml;

  @Input() contactToEdit!: Contact;
  @Output() close = new EventEmitter<void>();
  @Output() deleteModal = new EventEmitter<void>();

  isOpen = false;
  isSlide = false;
  contactsService = inject(ContactsService);
  fullName = '';
  iconSrc = 'assets/icons/close.svg';

  contact: Contact | null = null;

  constructor(public initialLettersService: InitialLettersService, private svgService: SVGInlineService, private sanitizer: DomSanitizer, private renderer: Renderer2) { 
    this.renderer.listen('window', 'click', (event) => {
      const modal = document.querySelector('.modal');
      if (this.isOpen && modal && !modal.contains(event.target as Node)) {
        this.closeModal();
      }
    });
   }

  ngOnInit() {
    if (this.contactToEdit) {
      this.fullName = `${this.contactToEdit.firstName} ${this.contactToEdit.lastName}`;
    }

    if (this.iconSrc) {
      this.svgService.getInlineSVG(this.iconSrc).subscribe({
        next: (svg: string) => {
          this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
        },
        error: err => console.error('SVG load error:', err)
      });
    }
  }

  get liveInitials(): string {
    let [firstName = '', lastName = ''] = (this.fullName || '').split(' ');
    return String(this.initialLettersService.getInitialLetters({ firstName, lastName }));
  }


  openModal(contactData: Contact) {
    this.contact = { ...contactData };
    this.fullName = `${contactData.firstName} ${contactData.lastName}`;
    this.isOpen = true;
    setTimeout(() => {
      this.isSlide = true;
    }, 25);
  }

  async saveContact(form: NgForm) {
    if (!this.contact) {
      console.error('No contact loaded');
      return;
    }
    if (form.invalid) {
      return;
    }

    const nameParts = this.fullName.trim().split(' ');
    this.contact.firstName = nameParts[0];
    this.contact.lastName = nameParts.slice(1).join(' ');

    try {
      await this.contactsService.updateContact(this.contact, this.contact.id);
      window.location.reload();
    } catch (error) {
      console.error('Update failed:', error);
    }
  }

  deleteContact() {
    this.deleteModal.emit();
    this.closeModal();
  }

  closeModal() {
    this.isSlide = false;
    setTimeout(() => {
      this.isOpen = false;
    }, 600);
  }
}
