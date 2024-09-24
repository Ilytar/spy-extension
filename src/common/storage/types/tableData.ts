import { CompanyName } from "./company";

export type TableData = {
  date_of_verification: string;
  modification_of_mi: string;
  name_of_mi: string;
  registration_number_of_mi: string;
  type_of_mi: string;
  valid_until: string;
  verification_number: string;
};
export type TableDataWithId = TableData & {
  id: CompanyName;
};

export type RecordCompanyData = Record<CompanyName, TableData>;

export type RecordChangedCompanyData = Record<CompanyName, Partial<TableData>>;

export type TableStoredData = Record<number | string, TableData>;
