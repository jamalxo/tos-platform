import { User } from './user.model';
import { Comment } from './comment.model';
import { Upvote } from './upvote.model';

export interface LegalAssessment {
  _id: string;

  legal: boolean;
  createdBy: User;
  comments: Comment[];
  upvotes: Upvote[];
}

export interface ILegalAssessment {
  createdBy: string;
}

export interface ILegalAssessment {
  createdBy: string;
}
