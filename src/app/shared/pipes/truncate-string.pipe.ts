import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateString',
})
export class TruncateStringPipe implements PipeTransform {
  transform(value: string, maxLength: number): string {
    if (!value || value.length <= maxLength) return value;

    const previousSpace = value.lastIndexOf(' ', maxLength);
    const nextSpace = value.indexOf(' ', maxLength);

    let cutIndex: number;
    if (previousSpace === -1 && nextSpace === -1) {
      cutIndex = maxLength;
    } else if (previousSpace === -1) {
      cutIndex = nextSpace;
    } else if (nextSpace === -1) {
      cutIndex = previousSpace;
    } else {
      cutIndex =
        maxLength - previousSpace <= nextSpace - maxLength
          ? previousSpace
          : nextSpace;
    }

    return value.slice(0, cutIndex).trimEnd() + '...';
  }
}
