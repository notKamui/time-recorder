import { Button } from '@app/components/ui/button'
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
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-6 font-bold text-3xl">Login</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
          className="w-full max-w-sm rounded bg-white p-6 shadow-md"
        >
          <div className="mb-4">
            <form.Field name="username">
              {(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block font-medium text-gray-700 text-sm"
                  >
                    Username:
                  </label>
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
          </div>

          <div className="mb-6">
            <form.Field name="password">
              {(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block font-medium text-gray-700 text-sm"
                  >
                    Password:
                  </label>
                  <input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
          </div>
          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Log in
              </Button>
            )}
          </form.Subscribe>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </>
  )
}

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
