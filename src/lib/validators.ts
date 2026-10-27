import { PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH } from '@/config/constants';
import type { LoginPayload, RegisterPayload } from '@/types/auth';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = new RegExp(`^[A-Za-z0-9_]{1,${USERNAME_MAX_LENGTH}}$`);

export function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value.trim());
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateLogin(values: LoginPayload): FieldErrors<LoginPayload> {
  const errors: FieldErrors<LoginPayload> = {};
  if (!EMAIL_RE.test(values.email)) errors.email = 'Enter a valid email address.';
  if (!values.password) errors.password = 'Enter your password.';
  return errors;
}

export function validateRegister(values: RegisterPayload): FieldErrors<RegisterPayload> {
  const errors: FieldErrors<RegisterPayload> = {};
  if (!values.display_name.trim()) errors.display_name = 'Enter your name.';
  else if (values.display_name.length > 50) errors.display_name = 'Name can be at most 50 characters.';
  if (!USERNAME_RE.test(values.username)) {
    errors.username = `Use 1–${USERNAME_MAX_LENGTH} letters, numbers or underscores.`;
  }
  if (!EMAIL_RE.test(values.email)) errors.email = 'Enter a valid email address.';
  if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  return errors;
}
