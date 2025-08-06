import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SVGInlineService {
  private cache = new Map<string, Observable<SVGElement>>();

  constructor(private http: HttpClient) { }

  convertInlineSVG(path: string): Observable<SVGElement> {
    if (this.cache.has(path)) {
      return this.cache.get(path)!;
    }

    const svg$ = this.http.get(path, { responseType: 'text' }).pipe(
      map(svgText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svg = doc.querySelector('svg');

        if (!svg) {
          throw new Error(`Error! No SVG found under given path: ${path}`);
        }

        return svg as SVGElement;
      }),
      shareReplay(1)
    );

    this.cache.set(path, svg$);
    return svg$;
  }

  cloneSvg(svg: SVGSVGElement): SVGSVGElement {
    return svg.cloneNode(true) as SVGSVGElement;
  }
}
