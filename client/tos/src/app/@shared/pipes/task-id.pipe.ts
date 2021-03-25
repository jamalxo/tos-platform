import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskId',
})
export class TaskIdPipe implements PipeTransform {
  transform(value: string): string {
    return `T${value}`;
  }
}
