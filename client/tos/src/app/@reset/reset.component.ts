import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../@core/service/auth/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tos-reset',
  templateUrl: './reset.component.html',
  styleUrls: [
    './reset.component.scss',
    '../@landing-page/login/login.component.scss',
  ],
})
export class ResetComponent {
  token = this.activatedRoute.snapshot.params.token;

  resetForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });
  showPasswordReset = false;
  passwordResetMessage = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  get f() {
    return this.resetForm.controls;
  }

  resetPassword() {
    if (
      !this.f.password.hasError('required') &&
      !this.f.confirmPassword.hasError('required') &&
      this.f.password.value === this.f.confirmPassword.value
    ) {
      this.userService
        .resetPassword(this.f.password.value, this.token)
        .subscribe((result: any) => {
          this.showPasswordReset = true;
          const { message } = result;
          this.passwordResetMessage = message || '';
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1000);
        });
    }
  }
}
