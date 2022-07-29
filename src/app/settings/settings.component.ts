import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  settingForm: FormGroup;
  user: any;
  username: string;
  email: string;
  profileImg: any;
  userId: string;
  message: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private postService: PostService
  ) {
    this.settingForm = this.fb.group({
      username: [this.username, [Validators.maxLength(50)]],
      email: [this.email, Validators.email],
      profileImgURL: [this.profileImg],
    });
  }

  ngOnInit() {
    this.getUser().subscribe({
      next: (res: any) => {
        // console.log(res);
        this.user = res;
        this.user = this.user.userRes;
        this.profileImg = this.user.profileImgURL;
        this.username = this.user.username;
        this.email = this.user.email;
        this.userId = this.user._id;
      },
    });
  }

  getUser() {
    return this.userService.getUser();
  }

  onChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      //console.log(event.target.files);
      let file = event.target.files[0];
      //console.log(file);
      this.postService.uploadImg(file).subscribe({
        next: (res) => {
          //console.log(res);

          this.profileImg = res;
          this.profileImg = this.profileImg.url;
          this.settingForm.patchValue({
            profileImgURL: this.profileImg,
          });
        },
      });
    }
  }
  // onNameChange(event: any) {
  //   console.log(this.settingForm?.get('username')?.value);
  // }

  onSubmit() {
    const saveData = this.settingForm.value;
    // console.log(saveData);
    if (saveData.username) {
      localStorage.setItem('username', saveData.username);
    }
    if (saveData.profileImgURL) {
      localStorage.setItem('profileImg', saveData.profileImgURL);
    }
    this.userService.updateUser(this.userId, saveData).subscribe({
      next: (res: any) => {
        console.log(res);

        alert('new information saved');
        window.location.reload();
      },
      error: (err) => {
        //console.log(err);

        if (err.status === 500 || err.status === 422) {
          alert(err.error);
        } else {
          alert('Server Error');
        }
        this.settingForm.reset({ username: this.username, email: this.email });
      },
    });
  }
}
