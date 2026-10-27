import type { User } from './user';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  username: string;
  display_name: string;
}

export interface AuthSession {
  token: string;
  user: User;
}
