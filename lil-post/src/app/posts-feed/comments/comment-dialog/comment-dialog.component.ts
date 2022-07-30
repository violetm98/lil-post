import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css'],
})
export class commentDialogComponent implements OnInit {
  commentForm: FormGroup;
  hasCancelButton: boolean;
  description: any = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<commentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.description = data.description;
  }

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      body: [
        this.description,
        [Validators.required, Validators.maxLength(200)],
      ],
    });
  }

  onSubmit() {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
  onSendClick() {
    this.dialogRef.close(this.commentForm.value);
  }
}
