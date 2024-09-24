import { MakeOptionalFields } from "./utility";

interface QueryParamsBase {
  status: string;
  lastChangeDatePeriodBegin: string;
  lastChangeDatePeriodEnd: string;
  etaClass: string;
  author: string;
  owner: string;
  gosreestrNumber: number;
  documentTitle: string;
  applicability: boolean;
  verificationDateBegin: string;
  verificationDateEnd: string;
  factoryNum: number;
  nameOfSIType: string;
  year: number;
  sortBy: string;
  limit: number;
  offset: number;
}

export type QueryParams = Partial<QueryParamsBase>;

export type QueryParamsWithAuthor = MakeOptionalFields<
  QueryParamsBase,
  "author"
>;
