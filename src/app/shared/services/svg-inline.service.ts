import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SVGInlineService {
  private cache = new Map<string, Observable<string>>();

  constructor(private http: HttpClient) { }

  getInlineSVG(path: string): Observable<string> {
    if (this.cache.has(path)) {
      return this.cache.get(path)!;
    }

    const svg$ = this.http.get(path, { responseType: 'text' }).pipe(
      map(svgText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svg = doc.querySelector('svg');

        if (!svg) {
          throw new Error(`Error! No <svg> element found at path: ${path}`);
        }

        const serializer = new XMLSerializer();
        return serializer.serializeToString(svg);
      }),
      shareReplay(1)
    );

    this.cache.set(path, svg$);
    return svg$;
  }
}
