import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  createPostForm: FormGroup;
  file: File;
  img: any;
  imagesPreview: any[] = [];
  fileLength: number = 0;
  loading: boolean = false;
  result: any;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {
    this.createPostForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      content: ['', Validators.required],
      imgURL: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  async onSubmit() {
    this.loading = true;
    const postData = this.createPostForm.value;

    await this.getImgURL(postData);
    //console.log(postData);

    this.postService.addNewPost(postData).subscribe({
      next: (res) => {
        //console.log(res);

        this.result = res;
        this.createPostForm.reset();
        this.imagesPreview = [];
        this.fileLength = 0;
        this.router.navigate(['./home']).then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  async getImgURL(postData: any) {
    if (postData.imgURL) {
      for (let i = 0; i < postData.imgURL.length; i++) {
        let data = await lastValueFrom(
          this.postService.uploadImg(postData.imgURL[i])
        );

        //console.log(data);
        this.img = data;
        postData.imgURL[i] = this.img.url;

        // console.log(postData.imgURL[i]);
      }
    }
  }

  async onChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files);
      const count = event.target.files.length;
      this.fileLength += count;
      console.log(this.fileLength);
      if (this.fileLength > 4) {
        return alert('Please choose up to 4 photos.');
      }
      for (let i = 0; i < count; i++) {
        let file = event.target.files[i];
        let data = await this.previewFile(file);
        this.imagesPreview.push(data);
        this.createPostForm.patchValue({
          imgURL: this.imagesPreview,
        });
        //console.log(this.createPostForm.value);
      }
      console.log(this.imagesPreview);
    }
  }

  previewFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
      reader.onerror = (err) => {
        reader.abort();
        reject(err);
      };
      reader.onloadend = () => {
        resolve(reader.result);

        //console.log(this.imagesPreview);
      };
    });
  }

  deletePreview(file: any) {
    this.imagesPreview.splice(file, 1);
    //console.log(this.imagesPreview);
    this.createPostForm.patchValue({
      imgURL: this.imagesPreview,
    });
    this.fileLength = this.fileLength - 1;
    //console.log(this.createPostForm.value);
    // this.createPostForm.patchValue({
    //   imgURL: this.imagesPreview,
    // });
  }
}
