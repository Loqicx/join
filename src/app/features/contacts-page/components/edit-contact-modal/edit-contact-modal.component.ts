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
import { ContactsCommunicationService } from '../../services/contacts-communication.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { NotificationPosition, NotificationType } from '../../../../shared/interfaces/notification';

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
    notificationService = inject(NotificationService);
    fullName = '';
    iconSrc = 'assets/icons/close.svg';

    contact: Contact | null = null;

    contactComService: ContactsCommunicationService = inject(ContactsCommunicationService);

    constructor(
        public initialLettersService: InitialLettersService,
        private svgService: SVGInlineService,
        private sanitizer: DomSanitizer,
        private renderer: Renderer2
    ) {
        this.renderer.listen('window', 'pointerdown', (event) => {
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
                error: (err) => console.error('SVG load error:', err),
            });
        }
    }

    get liveInitials(): string {
        let [firstName = '', lastName = ''] = (this.fullName || '').split(' ');
        return String(this.initialLettersService.getInitialLetters({ firstName, lastName }));
    }

    /**
     * Opens the contact modal with provided contact data.
     *
     * @param {Contact} contactData - The contact object to be displayed in the modal.
     */
    openModal(contactData: Contact) {
        this.contact = { ...contactData };
        this.fullName = `${contactData.firstName} ${contactData.lastName}`;
        this.isOpen = true;
        setTimeout(() => {
            this.isSlide = true;
        }, 25);
    }

    /**
     * First checks then,
     * Saves a contact by updating it in the Firebase.
     *
     * @param {NgForm} form - The Angular reactive form containing the contact data to be saved.
     */
    async checkSaveContact(form: NgForm) {
        if (!this.contact) {
            console.error('No contact loaded');
            this.notificationService.pushNotification(
                'Error loading Contact!',
                NotificationType.ERROR,
                NotificationPosition.TOP_RIGHT
            );
            return;
        }
        if (form.invalid) {
            return;
        }

        const nameParts = this.fullName.trim().split(' ');
        this.contact.firstName = nameParts[0];
        this.contact.lastName = nameParts.slice(1).join(' ');

        this.saveContact();
    }

    async saveContact() {
        if (this.contact) {
            try {
                await this.contactsService.updateContact(this.contact, this.contact.id);
                this.closeModal();
                this.contactComService.setContactId(this.contact.id);
                this.notificationService.pushNotification(
                    'Contact updated successfully!',
                    NotificationType.SUCCESS,
                    NotificationPosition.TOP_RIGHT
                );
            } catch (error) {
                console.error('Update failed:', error);
                this.notificationService.pushNotification(
                    'Error updating Contact!',
                    NotificationType.ERROR,
                    NotificationPosition.TOP_RIGHT
                );
            }
        }
    }

    /**
     * Opens Delete modal and closes edit Contact modal.
     */
    deleteContact() {
        this.deleteModal.emit();
        this.closeModal();
    }

    /**
     * Closes the edit contact modal with animation delay.
     */
    closeModal() {
        this.isSlide = false;
        setTimeout(() => {
            this.isOpen = false;
        }, 600);
    }
}
