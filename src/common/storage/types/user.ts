export interface User {
  last_name: string;
  first_name: string;
  middle_name: string;
  email: string;
}

export type UserFormInputs = {
  id: keyof User;
  label: string;
  type: string;
}[];
