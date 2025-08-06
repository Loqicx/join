import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SVGInlineService } from '../../services/svg-inline.service';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  providers: [SVGInlineService]
})

export class ButtonComponent {
  svgContent!: SafeHtml;

  @Input() iconSrc!: string;
  @Input() altText: string = 'Button icon';
  @Input() type: string = 'button';
  @Input() fontSize: string = '26px';
  @Input() size: 'large' | 'medium' | 'small' | 'dynamic' = 'dynamic';
  @Input() invert: boolean = false;


  @Output() btnClick = new EventEmitter<void>();

  constructor(private svgService: SVGInlineService, private sanitizer: DomSanitizer) { }

  handleClick() {
    this.btnClick.emit();
  }

  ngOnInit(): void {
    this.svgService.getInlineSVG(this.iconSrc).subscribe({
      next: (svg: string) => {
        this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
      },
      error: err => console.error('SVG load error:', err)
    });
  }
}
