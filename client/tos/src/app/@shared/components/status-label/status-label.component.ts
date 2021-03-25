import { Component, Input } from '@angular/core';

@Component({
  selector: 'status-label',
  templateUrl: './status-label.component.html',
  styleUrls: ['./status-label.component.scss'],
})
export class StatusLabelComponent {
  @Input()
  status: string;

  labelTransform(value: string): string {
    return value
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toUpperCase();
  }

  style(): string {
    return this.status.toUpperCase() === 'OPEN'
      ? 'open'
      : this.status.toUpperCase() === 'INPROGRESS'
      ? 'in-progress'
      : this.status.toUpperCase() === 'REVIEW'
      ? 'review'
      : this.status.toUpperCase() === 'DONE'
      ? 'done'
      : 'primary';
  }
}
