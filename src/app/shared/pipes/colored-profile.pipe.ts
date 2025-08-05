import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coloredProfile',
})
export class ColoredProfilePipe implements PipeTransform {
  private colorPalette = [
    '#0038FF',
    '#00BEE8',
    '#1FD7C1',
    '#6E52FF',
    '#9327FF',
    '#C3FF2B',
    '#FC71FF',
    '#FF4646',
    '#FF5EB3',
    '#FF745E',
    '#FF7A00',
    '#FFA35E',
    '#FFBB2B',
    '#FFC701',
    '#FFE62B',
  ];

  transform(value: any) {
    if (!value) return '';

    let hash = 0;

    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }

    const positiveHash = Math.abs(hash);

    const colorIndex = positiveHash % this.colorPalette.length;

    return this.colorPalette[colorIndex];
  }
}
