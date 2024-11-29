import { Button } from '@app/components/ui/button'
import { $signUp } from '@server/functions/user'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  const signUp = useServerFn($signUp)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget)) as {
      username: string
      password: string
      confirmPassword: string
    }
    await signUp({ data })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-6 font-bold text-3xl">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded bg-white p-6 shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block font-medium text-gray-700 text-sm"
          >
            Username:
          </label>
          <input
            type="username"
            id="username"
            name="username"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block font-medium text-gray-700 text-sm"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="password"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block font-medium text-gray-700 text-sm"
          >
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            autoComplete="password"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <Button
          type="submit"
          className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Sign Up
        </Button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
          Login
        </Link>
      </p>
    </div>
  )
}
