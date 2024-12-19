import { crumbs } from '@app/hooks/use-crumbs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/time/calendar')({
  loader: () => {
    return {
      crumbs: crumbs({ title: 'Time recorder', to: '/time' }, { title: 'Calendar' }),
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/time/calendar"!</div>
}
