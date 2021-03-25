import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tos-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  constructor(private router: Router) {}

  goToUpload(): void {
    this.router.navigate(['upload']);
  }
  
  goToDocuments(): void {
    this.router.navigate(['documents']);
  }
}
