import { Button } from '@app/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card'
import { FormInput } from '@app/components/ui/form-input'
import { title } from '@app/components/ui/primitives/typography'
import { SignInSchema } from '@common/forms/user'
import { $signIn } from '@server/functions/user'
import { type FieldApi, useForm } from '@tanstack/react-form'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { zodValidator } from '@tanstack/zod-form-adapter'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const signIn = useServerFn($signIn)

  const form = useForm({
    defaultValues: { username: '', password: '' },
    onSubmit: async ({ value: data }) => {
      await signIn({ data })
    },
    validatorAdapter: zodValidator(),
    validators: {
      onBlur: SignInSchema,
    },
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h1 className={title({ h: 1 })}>Login</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              form.handleSubmit()
            }}
            className="flex flex-col gap-4"
          >
            <FormInput
              type="text"
              form={form}
              name="username"
              label="Username"
            />
            <FormInput
              type="password"
              form={form}
              name="password"
              label="Password"
            />
            <form.Subscribe selector={(state) => state.canSubmit}>
              {(canSubmit) => (
                <Button type="submit" disabled={!canSubmit} className="mt-6">
                  Log in
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
        <CardFooter>
          <p className="mt-4 text-sm">
            Don't have an account?{' '}
            <Link
              to="/sign-up"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
