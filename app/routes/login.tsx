import { Button } from '@/components/ui/button'
import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <h1>Sign in</h1>
      <Button asChild>
        <a href="/api/login/google">Sign in with Google</a>
      </Button>
    </>
  )
}
