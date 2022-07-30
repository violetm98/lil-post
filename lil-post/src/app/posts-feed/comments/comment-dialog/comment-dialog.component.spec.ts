import { ComponentFixture, TestBed } from '@angular/core/testing';

import { commentDialogComponent } from './comment-dialog.component';

describe('CommentDialogComponent', () => {
  let component: commentDialogComponent;
  let fixture: ComponentFixture<commentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [commentDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(commentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
