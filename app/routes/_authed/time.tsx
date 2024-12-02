import { Button } from '@app/components/ui/button'
import { title } from '@app/components/ui/primitives/typography'
import type { TimeEntry } from '@server/db/schema'
import {
  $createTimeEntry,
  $getTimeEntriesByDay,
  $updateTimeEntry,
} from '@server/functions/time-entry'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { useState } from 'react'

export const Route = createFileRoute('/_authed/time')({
  loader: async () => {
    const entries = await $getTimeEntriesByDay({ data: { date: new Date() } })
    return { entries }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { entries } = Route.useLoaderData()
  const createTimeEntry = useServerFn($createTimeEntry)
  const updateTimeEntry = useServerFn($updateTimeEntry)

  const sortedEntries = entries.toSorted(
    (a, b) => b.startedAt.getTime() - a.startedAt.getTime(),
  )

  const [currentEntryId, setCurrentEntryId] = useState<string | null>(() => {
    const currentEntry = sortedEntries[0]
    if (currentEntry?.endedAt) return null
    return currentEntry?.id ?? null
  })

  async function start() {
    const entryId = await createTimeEntry({ data: {} })
    setCurrentEntryId(entryId)
    router.invalidate()
  }

  async function end() {
    if (!currentEntryId) return
    await updateTimeEntry({ data: { id: currentEntryId, endedAt: new Date() } })
    setCurrentEntryId(null)
    router.invalidate()
  }

  return (
    <div>
      <h2 className={title({ h: 1 })}>Time</h2>
      {!currentEntryId && <Button onClick={start}>Start</Button>}
      {currentEntryId && <Button onClick={end}>End</Button>}
      <ul>
        {sortedEntries.map((entry: TimeEntry) => (
          <li key={entry.id}>
            {entry.description} ({entry.startedAt.toISOString()} -{' '}
            {entry.endedAt?.toISOString() ?? 'now'})
          </li>
        ))}
      </ul>
    </div>
  )
}
