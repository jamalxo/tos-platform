import { User } from './user.model';

export interface Upvote {
  _id: string;
  createdBy: User;
}
