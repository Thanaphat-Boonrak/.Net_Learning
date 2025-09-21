export type User = {
  id: string;
  displayName: string;
  email: string;
  token: string;
  imageUrl?: string;
};

export type Logincreds = {
  email: string;
  password: string;
};

export type RegisterCreds = {
  email: string;
  password: string;
  displayName: string;
  gender: string;
  dateofBirth: string;
  city: string;
  country: string;
};
