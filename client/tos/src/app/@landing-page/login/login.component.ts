import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../@core/service/auth/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tos-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  showPasswordForgottenScreen = false;
  passwordForgottenMessage = '';

  loginForm = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.required),
  });

  error = false;

  constructor(private userService: UserService, private router: Router) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  passwordForgotten() {
    if (!this.f.email.hasError('required')) {
      this.userService
        .recoverPassword(this.f.email.value)
        .subscribe((result: any) => {
          this.showPasswordForgottenScreen = true;
          const { message } = result;
          this.passwordForgottenMessage = message || '';
        });
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const user = {
      email: this.f.email.value,
      password: this.f.password.value,
    };

    this.userService.userLogIn(user).subscribe(
      () => {
        this.router.navigate(['overview']);
      },
      (error) => {
        this.error = true;
      }
    );
  }
}
