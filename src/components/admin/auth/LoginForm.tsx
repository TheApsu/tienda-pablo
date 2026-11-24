import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/general/Button'
import { Input } from '@/components/general/Input'
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema'

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void
  isLoading?: boolean
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input
        label="Correo"
        type="email"
        autoComplete="email"
        placeholder="admin@tienda.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" size="lg" isLoading={isLoading} className="mt-2 w-full">
        Iniciar sesión
      </Button>
    </form>
  )
}
