import { TopicLabel } from './topicLabel.model';
import { LegalAssessment } from './legalAssessment.model';
import { User } from './user.model';

export interface Section {
  _id: string;

  content: string;
  from: number;
  to: number;
  userId: string;
  topicLabels: TopicLabel[];
  legalAssessments: LegalAssessment[];
  createdBy: User;
}
