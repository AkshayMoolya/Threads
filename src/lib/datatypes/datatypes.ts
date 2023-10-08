// dataTypes.ts

export interface ObjectId {
  _id: string;
}

export interface Author {
  _id: ObjectId;
  id: string;
  image: string;
  isAdmin: boolean;
  name: string;
}

export interface Content {
  text: string;
  images: string[];
}

export interface Comment {
  _id: ObjectId;
  id: string;
  content: Content;
  author: Author;
  parentId: ObjectId;
  children: Comment[];
  likes: ObjectId[];
  createdAt: Date;
  __v: number;
}

export interface Post {
  _id: ObjectId;
  id: string;
  content?: Content; // Making content optional
  author?: Author; // Making author optional
  children?: Comment[]; // Making children optional
  likes?: ObjectId[]; // Making likes optional
  createdAt?: Date; // Making createdAt optional
  __v?: number; // Making __v optional
}
