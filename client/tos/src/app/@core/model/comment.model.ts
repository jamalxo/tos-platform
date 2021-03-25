import { User } from './user.model';
import { Upvote } from './upvote.model';

export interface Comment {
  _id: string;

  content: string;
  createdBy: User;
  createdAt: Date;
  upvotes: Upvote[];
}
