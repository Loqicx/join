import { Component, Input, Renderer2 } from '@angular/core';
import { AddTaskComponent } from "../add-task/add-task.component";
import { SVGInlineService } from '../services/svg-inline.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-add-task-modal',
  imports: [AddTaskComponent],
  templateUrl: './add-task-modal.component.html',
  styleUrl: './add-task-modal.component.scss'
})
export class AddTaskModalComponent {
  @Input() selectedContacts: any[] = [];
  @Input() taskStatus: number = 1;

  isOpen: boolean = false;
  isSlide: boolean = false;
  svgContent!: SafeHtml;
  iconSrc = 'assets/icons/close.svg';

  constructor(private renderer: Renderer2, private svgService: SVGInlineService,
    private sanitizer: DomSanitizer) {
    this.renderer.listen('window', 'pointerdown', (event) => {
      const modal = document.querySelector('.modal-content');
      if (this.isOpen && modal && !modal.contains(event.target as Node)) {
        this.closeModal();
      }
    });
  }

  ngOnInit() {
    if (this.iconSrc) {
      this.svgService.getInlineSVG(this.iconSrc).subscribe({
        next: (svg: string) => {
          this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
        },
        error: (err) => console.error('SVG load error:', err),
      });
    }
  }

  openModal() {
    this.isOpen = true;
    setTimeout(() => {
      this.isSlide = true;
    }, 25);
  }

  closeModal() {
    this.isSlide = false;
    setTimeout(() => {
      this.isOpen = false;
    }, 600);
  }
}
