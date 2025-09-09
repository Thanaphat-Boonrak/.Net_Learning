export type User = {
  id: string;
  displayName: string;
  email: string;
  token: string;
  imageUrl?: string;
};

export type creds = {
  email: string;
  password: string;
};

export type RegisterCreds = {
  email: string;
  password: string;
};
