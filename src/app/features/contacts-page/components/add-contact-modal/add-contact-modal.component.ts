import { Component, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-contact-modal',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  templateUrl: './add-contact-modal.component.html',
  styleUrls: ['./add-contact-modal.component.scss'],
})
export class AddContactModalComponent {
  @Output() close = new EventEmitter<void>();

  isOpen = true;

  closeModal() {
    this.close.emit();
  }

  saveContact() {
    // hier kannst du das neue Kontaktobjekt speichern
    console.log('Kontakt gespeichert');
    this.closeModal();
  }

   createContact() {
    console.log('Kontakt wird erstellt');
    this.closeModal();
  }
}
