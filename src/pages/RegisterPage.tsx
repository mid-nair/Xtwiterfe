import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { USERNAME_MAX_LENGTH } from '@/config/constants';
import { useRegister } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/apiError';
import { validateRegister, type FieldErrors } from '@/lib/validators';
import type { RegisterPayload } from '@/types/auth';

export function RegisterPage() {
  const { mutate, isPending, error } = useRegister();
  const [values, setValues] = useState<RegisterPayload>({ display_name: '', username: '', email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors<RegisterPayload>>({});

  const handleChange = (field: keyof RegisterPayload) => (event: ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateRegister(values);
    setErrors(found);
    if (Object.keys(found).length === 0) mutate(values);
  };

  return (
    <AuthLayout
      title="Create your account"
      footer={<>Already have an account? <Link to="/login" className="text-brand hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField label="Name" autoComplete="name" maxLength={50} value={values.display_name} onChange={handleChange('display_name')} error={errors.display_name} />
        <TextField label="Username" autoComplete="username" maxLength={USERNAME_MAX_LENGTH} value={values.username} onChange={handleChange('username')} error={errors.username} />
        <TextField label="Email" type="email" autoComplete="email" value={values.email} onChange={handleChange('email')} error={errors.email} />
        <TextField label="Password" type="password" autoComplete="new-password" value={values.password} onChange={handleChange('password')} error={errors.password} />
        {error && <p role="alert" className="text-sm text-red-500">{getErrorMessage(error)}</p>}
        <Button type="submit" variant="inverse" size="lg" fullWidth loading={isPending}>Create account</Button>
      </form>
    </AuthLayout>
  );
}
