export interface VerificationOfMeasuringInstrumentOrigin {
  id: number;
  verificationDate: string;
  mitypeTitle: string;
  mitypeNumber: string;
  factoryNum: string;
  count: number;
  documentTitle: string;
  applicability: boolean;
  status: string;
  lastChanged: string;
  author: string;
  lastAuthor: string;
  owner: string;
  appId: number;
  globalId: number;
}

export type VerificationOfMeasuringInstrument = Pick<
  VerificationOfMeasuringInstrumentOrigin,
  | "mitypeNumber"
  | "mitypeTitle"
  | "verificationDate"
  | "documentTitle"
  | "author"
>;
