import { RecorderDisplay } from '@app/components/time/time-recorder-display'
import { title } from '@app/components/ui/primitives/typography'
import { Time } from '@common/utils/time'
import {
  $createTimeEntry,
  $getTimeEntriesByDay,
  $updateTimeEntry,
} from '@server/functions/time-entry'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/_authed/time_/$day')({
  loader: async ({ params: { day } }) => {
    const time = Time.from(day)
    const entries = await $getTimeEntriesByDay({
      data: { date: time.getDate() },
    })
    entries.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
    return { entries, date: time.getDate() }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { entries, date } = Route.useLoaderData()
  const time = Time.from(date)

  return (
    <div>
      <h2 className={title({ h: 1 })}>Time recorder</h2>
      <RecorderDisplay time={time} entries={entries} />
    </div>
  )
}
