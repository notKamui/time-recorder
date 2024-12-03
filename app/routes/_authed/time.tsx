import { DataTable } from '@app/components/data/data-table'
import { Button } from '@app/components/ui/button'
import { title } from '@app/components/ui/primitives/typography'
import type { TimeEntry } from '@server/db/schema'
import {
  $createTimeEntry,
  $getTimeEntriesByDay,
  $updateTimeEntry,
} from '@server/functions/time-entry'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useServerFn } from '@tanstack/start'
import { useMemo, useState } from 'react'

const timeTableColumns: ColumnDef<
  Omit<TimeEntry, 'startedAt' | 'endedAt'> & {
    startedAt: string
    endedAt?: string
  }
>[] = [
  {
    accessorKey: 'startedAt',
    header: 'Started at',
  },
  {
    accessorKey: 'endedAt',
    header: 'Ended at',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
]

export const Route = createFileRoute('/_authed/time')({
  loader: async () => {
    const entries = await $getTimeEntriesByDay({ data: { date: new Date() } })
    entries.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
    return { entries }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { entries } = Route.useLoaderData()
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
        : undefined
    }))
  }, [entries])

  return (
    <div>
      <h2 className={title({ h: 1 })}>Time recorder</h2>
      {currentEntryId ? (
        <Button onClick={end}>End</Button>
      ) : (
        <Button onClick={start}>Start</Button>
      )}
      <div className="container mx-auto py-10">
        <DataTable columns={timeTableColumns} data={mappedEntries} />
      </div>
    </div>
  )
}
