import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectToArray',
})
export class ObjectToArrayPipe implements PipeTransform {
  transform(value: any): any[] {
    if (!value) return [];

    return Object.keys(value).map((key) => {
      return { key: key, value: value[key] };
    });
  }
}
