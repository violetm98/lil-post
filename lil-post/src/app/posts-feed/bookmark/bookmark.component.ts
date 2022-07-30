import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookmark-button',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css'],
})
export class BookmarkComponent implements OnInit {
  public isBookmarked: boolean = false;
  public iconName: string = 'bookmark_outlined';
  constructor() {}

  ngOnInit(): void {}

  toggleBookmarkState() {
    if (this.isBookmarked == false) {
      this.isBookmarked = true;
      this.iconName = 'bookmark';
    } else {
      this.isBookmarked = false;
      this.iconName = 'bookmark_outlined';
    }
  }
}
