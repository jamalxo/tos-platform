import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'file-progress',
  templateUrl: './file-progress.component.html',
  styleUrls: ['./file-progress.component.scss'],
})
export class FileProgressComponent implements OnInit {
  @Input() progress = 0;

  ngOnInit(): void {
  }
}
