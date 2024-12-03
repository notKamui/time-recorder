import { RecorderDisplay } from '@app/components/time/recorder-display'
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
  const router = useRouter()
  const { entries, date } = Route.useLoaderData()
  const time = Time.from(date)
  const createTimeEntry = useServerFn($createTimeEntry)
  const updateTimeEntry = useServerFn($updateTimeEntry)

  const [currentEntryId, setCurrentEntryId] = useState<string | null>(() => {
    const currentEntry = entries[0]
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

  const mappedEntries = useMemo(() => {
    return entries.map((entry) => ({
      ...entry,
      startedAt: entry.startedAt.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      endedAt: entry.endedAt
        ? entry.endedAt.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        : undefined,
    }))
  }, [entries])

  return (
    <div>
      <h2 className={title({ h: 1 })}>Time recorder</h2>
      <RecorderDisplay
        time={time}
        entries={mappedEntries}
        start={start}
        end={end}
        currentEntryId={currentEntryId}
      />
    </div>
  )
}
