import { Section } from './section.model';
import { ILegalAssessment } from './legalAssessment.model';
import { ITopicLabel } from './topicLabel.model';
import { DocumentStatus } from './DocumentStatus';

export interface Document {
  _id: string;

  title: string;
  content: string;
  sections: Section[];
  createdAt: Date;
  uploadedBy: {
    firstName: string;
    _id: string;
  };
  status: DocumentStatus;
}

export interface IDocumentMeta extends Document {
  createdAt: Date;
  status: DocumentStatus;
  annotations: (ILegalAssessment | ITopicLabel)[];
}
