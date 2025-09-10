/**
 * @fileoverview contact details.component
 */

import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ContactsCommunicationService } from '../../services/contacts-communication.service';
import { ContactsService } from '../../../../shared/services/firebase/contacts.service';
import { Contact } from '../../../../shared/interfaces/contact';
import { ColoredProfilePipe } from '../../../../shared/pipes/colored-profile.pipe';
import { InitialLettersService } from '../../../../shared/services/get-initial-letters.service';
import { EditContactModalComponent } from '../edit-contact-modal/edit-contact-modal.component';
import { DeleteModalComponent } from '../../../../shared/delete-modal/delete-modal.component';
import { SVGInlineService } from '../../../../shared/services/svg-inline.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-contact-details',
  imports: [
    ColoredProfilePipe,
    EditContactModalComponent,
    DeleteModalComponent,
    ButtonComponent,
  ],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
  providers: [SVGInlineService],
})
export class ContactDetailsComponent implements OnInit {
  svgContents: { [key: string]: SafeHtml } = {};
  contactComService = inject(ContactsCommunicationService);
  contactsService = inject(ContactsService);
  contactId$: string = '';
  currentContact?: Contact | null;

  actionMenuOpen: boolean = false;
  animateActionMenu: boolean = false;

  @Output() close = new EventEmitter<void>();

  icons = [
    { name: 'edit', src: './assets/icons/edit.svg' },
    { name: 'delete', src: './assets/icons/delete.svg' },
  ];

  @ViewChild(EditContactModalComponent) editModal!: EditContactModalComponent;
  @ViewChild(DeleteModalComponent) deleteModal!: DeleteModalComponent;

  initialLettersService: InitialLettersService = inject(InitialLettersService);

  constructor(
    private svgService: SVGInlineService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.contactComService.currentContactId$.subscribe((id) => {
      if (this.currentContact) {
        this.updateDetailDisplay(id, true);
        return;
      }
      this.updateDetailDisplay(id, false);
    });

    this.icons.forEach((icon) => {
      this.convertIcon(icon.name, icon.src);
    });
  }

  onClose() {
    this.close.emit();
  }

  updateDetailDisplay(id: string, refresh: boolean): void {
    if (id === '') {
      this.currentContact = null;
      return;
    }
    if (refresh) {
      this.currentContact = this.contactsService.getContactById(id);
      return;
    }
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

  openActionMenu() {
    this.actionMenuOpen = true;
    setTimeout(() => {
      this.animateActionMenu = true;
    }, 10);
  }

  closeActionMenu() {
    this.animateActionMenu = false;
    setTimeout(() => {
      this.actionMenuOpen = false;
    }, 300);
  }

  toggleActionMenu() {
    if (!this.actionMenuOpen) {
      this.openActionMenu();
    } else {
      this.closeActionMenu();
    }
  }

  openEditModal() {
    if (this.currentContact) {
      this.editModal.openModal(this.currentContact);
    }
  }

  openDeleteModal() {
    if (this.currentContact) {
      this.deleteModal.deleteContactModal(this.currentContact);
    }
  }

  convertIcon(iconName: string, iconSrc: string): void {
    this.svgService.getInlineSVG(iconSrc).subscribe({
      next: (svg: string) => {
        this.svgContents[iconName] =
          this.sanitizer.bypassSecurityTrustHtml(svg);
      },
      error: (err) => console.error('SVG load error:', err),
    });
  }
}
