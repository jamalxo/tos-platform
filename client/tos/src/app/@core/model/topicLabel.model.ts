import { User } from './user.model';
import { Comment } from './comment.model';
import { Upvote } from './upvote.model';

export interface TopicLabel {
  _id: string;

  label: string;
  createdBy: User;
  comments: Comment[];
  upvotes: Upvote[];
}

export interface ITopicLabel {
  createdBy: string;
}

export interface ITopicLabel {
  createdBy: string;
}
