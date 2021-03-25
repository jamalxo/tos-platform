import { Component, OnInit, NgModule } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../@core/service/auth/user.service';
import { Router } from '@angular/router';
import { User } from '../@core/model/user.model';

@Component({
  selector: 'tos-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    location: new FormControl(''),
    company: new FormControl(''),
  });

  constructor(private userService: UserService, private router: Router) {}

  editMode = false;
  currentUser: User | undefined;

  // convenience getter for easy access to form fields
  get f() {
    return this.profileForm.controls;
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe((res) => {
      this.currentUser = res;
      if (!this.currentUser.hasOwnProperty('location')) {
        this.currentUser.location = '';
      }
      if (!this.currentUser.hasOwnProperty('company')) {
        this.currentUser.company = '';
      }
      console.log(this.currentUser);
      this.profileForm.get('firstName')?.setValue(this.currentUser.firstName);
      this.profileForm.get('lastName')?.setValue(this.currentUser.lastName);
      this.profileForm.get('email')?.setValue(this.currentUser.email);
      this.profileForm.get('location')?.setValue(this.currentUser.location);
      this.profileForm.get('company')?.setValue(this.currentUser.company);
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const user = {
        firstName: this.f.firstName.value,
        lastName: this.f.lastName.value,
        email: this.f.email.value,
        location: this.f.location.value,
        company: this.f.company.value,
      };
      console.log(this.f.location.value);
      this.userService.userEdit(user).subscribe((res) => {
        this.currentUser = res;
      });
    }
  }

  editModeOn() {
    this.editMode = true;
  }

  editModeOff() {
    this.editMode = false;
    // Test only
    //this.firstName = this.f.firstName.value;
  }
}
