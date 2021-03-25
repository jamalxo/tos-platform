import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabelText',
})
export class StatusLabelTextPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toUpperCase();
  }
}
