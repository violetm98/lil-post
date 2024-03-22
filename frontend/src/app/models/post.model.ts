export class Post {
  _id: string;
  title: string;
  content: string;
  imgURL: string[];
  likes: object[];
  bookmarks: object[];
  comments: object[];
  postedBy: string;
}
