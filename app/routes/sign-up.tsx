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
import { SignUpSchema } from '@common/forms/user'
import { $signUp } from '@server/functions/user'
import { useForm } from '@tanstack/react-form'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { zodValidator } from '@tanstack/zod-form-adapter'

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  const signUp = useServerFn($signUp)

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value: data }) => {
      await signUp({ data })
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChangeAsync: SignUpSchema,
      onChangeAsyncDebounceMs: 500,
    },
  })

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <h1 className={title({ h: 1 })}>Sign Up</h1>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <FormInput type="text" form={form} name="username" label="Username" />
          <FormInput
            type="password"
            form={form}
            name="password"
            label="Password"
          />
          <FormInput
            type="password"
            form={form}
            name="confirmPassword"
            label="Confirm Password"
          />

          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <Button className="mt-6" type="submit" disabled={!canSubmit}>
                Sign Up
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter>
        <p className="mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
