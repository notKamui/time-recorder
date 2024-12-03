import { DataTable } from '@app/components/data/data-table'
import { Button } from '@app/components/ui/button'
import { title } from '@app/components/ui/primitives/typography'
import { cn } from '@app/utils/cn'
import { Time } from '@common/utils/time'
import type { TimeEntry } from '@server/db/schema'
import {
  $createTimeEntry,
  $updateTimeEntry,
} from '@server/functions/time-entry'
import { Link, useRouter } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useServerFn } from '@tanstack/start'
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

export type TimeTableData = Omit<TimeEntry, 'startedAt' | 'endedAt'> & {
  startedAt: string
  endedAt?: string
}

const timeTableColumns: ColumnDef<TimeTableData>[] = [
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

type RecorderDisplayProps = {
  time: Time
  entries: TimeEntry[]
}

export function RecorderDisplay({ time, entries }: RecorderDisplayProps) {
  const { start, end, mappedEntries, currentEntryId } =
    useTimeTableControls(entries)

  const dayBefore = time.shiftDays(-1)
  const dayAfter = time.shiftDays(1)
  const isToday = time.isToday()

  return (
    <>
      <div className="flex flex-row gap-2">
        <Button asChild>
          <Link
            to={dayBefore.isToday() ? '/time' : '/time/$day'}
            params={{ day: dayBefore.toISOString() }}
          >
            <ChevronsLeftIcon />
          </Link>
        </Button>
        <h3 className={title({ h: 3 })}>{time.formatDay()}</h3>
        <Button asChild disabled={isToday} className={cn(isToday && 'hidden')}>
          <Link
            to="/time/$day"
            params={{ day: dayAfter.toISOString() }}
            disabled={isToday}
          >
            <ChevronsRightIcon />
          </Link>
        </Button>
      </div>
      {isToday &&
        (currentEntryId ? (
          <Button onClick={end}>End</Button>
        ) : (
          <Button onClick={start}>Start</Button>
        ))}
      <div className="container mx-auto py-10">
        <DataTable columns={timeTableColumns} data={mappedEntries} />
      </div>
    </>
  )
}

function useTimeTableControls(entries: TimeEntry[]) {
  const router = useRouter()
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
      startedAt: Time.from(entry.startedAt).toISOString(),
      endedAt: entry.endedAt
        ? Time.from(entry.endedAt).toISOString()
        : undefined,
    }))
  }, [entries])

  return {
    start,
    end,
    currentEntryId,
    mappedEntries,
  }
}
