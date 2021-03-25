import { Component } from '@angular/core';
import { UserService } from '../../../@core/service/auth/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tos-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(public userService: UserService, private router: Router) {}

  logout(): void {
    this.userService.logout();
    this.router.navigate(['login']);
  }

  goToOverView(): void {
    this.router.navigate(['overview']);
  }

  goToDocuments(): void {
    this.router.navigate(['documents']);
  }

  goToTasks(): void {
    this.router.navigate(['tasks']);
  }

  goToAboutUs() {
    this.router.navigate(['about-us']);
  }

  goToProfile() {
    this.router.navigate(['profile']);
  }
}
