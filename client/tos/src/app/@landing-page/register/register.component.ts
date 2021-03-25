import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../@core/service/auth/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tos-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required),
  });

  error = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const user = {
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      email: this.f.email.value,
      password: this.f.password.value,
    };

    this.userService.userSignUp(user).subscribe(
      () => {
        this.router.navigate(['overview']);
      },
      (error) => {
        this.error = true;
      }
    );
  }
}
