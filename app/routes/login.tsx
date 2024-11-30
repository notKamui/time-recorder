import { Button } from '@app/components/ui/button'
import { $signIn } from '@server/functions/user'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const signIn = useServerFn($signIn)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget)) as {
      username: string
      password: string
    }
    await signIn({ data })
  }

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-6 font-bold text-3xl">Login</h1>
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
              type="text"
              id="username"
              name="username"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-6">
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
              autoComplete="password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Login
          </Button>
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
