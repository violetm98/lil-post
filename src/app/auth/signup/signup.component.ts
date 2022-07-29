import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  message: String;
  emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(50)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailRegex),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    const signupData = this.signupForm.value;

    this.userService.signupUser(signupData).subscribe({
      next: (res) => {
        //this.signupForm.reset();
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        console.log(err);

        if (err.status === 500 || err.status === 422) {
          this.message = err.error;
        } else {
          this.message = 'Server Error';
        }
      },
    });
  }
}
