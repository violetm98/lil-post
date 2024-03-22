import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginValid: Boolean = true;
  loginError: string | null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    const loginData = this.loginForm.value;

    this.userService.loginUser(loginData).subscribe({
      next: () => {
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        console.log(err);
        this.loginError = err.error.message;
        console.log(this.loginError);
        this.loginValid = false;
      },
    });
  }
}
