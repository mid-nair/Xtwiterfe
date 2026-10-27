import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useLogin } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/apiError';
import { validateLogin, type FieldErrors } from '@/lib/validators';
import type { LoginPayload } from '@/types/auth';

export function LoginPage() {
  const { mutate, isPending, error } = useLogin();
  const [values, setValues] = useState<LoginPayload>({ email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors<LoginPayload>>({});

  const handleChange = (field: keyof LoginPayload) => (event: ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateLogin(values);
    setErrors(found);
    if (Object.keys(found).length === 0) mutate(values); // GuestRoute redirects once the session is set
  };

  return (
    <AuthLayout
      title="Sign in to X"
      footer={<>Don’t have an account? <Link to="/register" className="text-brand hover:underline">Sign up</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField label="Email" type="email" autoComplete="email" value={values.email} onChange={handleChange('email')} error={errors.email} />
        <TextField label="Password" type="password" autoComplete="current-password" value={values.password} onChange={handleChange('password')} error={errors.password} />
        {error && <p role="alert" className="text-sm text-red-500">{getErrorMessage(error, 'Incorrect email or password.')}</p>}
        <Button type="submit" variant="inverse" size="lg" fullWidth loading={isPending}>Sign in</Button>
      </form>
    </AuthLayout>
  );
}
