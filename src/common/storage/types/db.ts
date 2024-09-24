import { VerificationOfMeasuringInstrument } from "./verificationOfMeasuringInstrument";

export type AuthorName = string;

// verificationResultsByAuthor
export type VerificationResultsByAuthor = {
  authorName: AuthorName;
  verificationResults: VerificationOfMeasuringInstrument[];
};

export type Author = {
  authorName: AuthorName;
  dateOfCreation: string;
  dateOfUpdate: string;
  resultsCount: number;
};
