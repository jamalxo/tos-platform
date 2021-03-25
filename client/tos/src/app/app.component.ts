import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UserService } from './@core/service/auth/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tos';
  constructor(
    translate: TranslateService,
    private router: Router,
    public userService: UserService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  //Todo: move this to a seperate component
  goToDocuments(): void {
    this.router.navigate(['documents']);
  }

  goToTasks(): void {
    this.router.navigate(['tasks']);
  }
}
