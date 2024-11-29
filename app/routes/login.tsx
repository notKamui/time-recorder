import { Button } from '@app/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Button>Sign in</Button>
    </>
  )
}
