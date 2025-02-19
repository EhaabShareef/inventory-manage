export enum Role {
  VIEW = "VIEW",
  MANAGE = "MANAGE",
}

export interface User {
  id: number;
  username: string;
  email: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  username: string;
  email?: string | null;
  password: string;
  role?: Role;
}
