import { DataTable } from '@app/components/data/data-table'
import { Button } from '@app/components/ui/button'
import { title } from '@app/components/ui/primitives/typography'
import { cn } from '@app/utils/cn'
import type { Time } from '@common/utils/time'
import type { TimeEntry } from '@server/db/schema'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'

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
  currentEntryId: string | null
  entries: TimeTableData[]
  start: () => void
  end: () => void
}

export function RecorderDisplay({
  time,
  entries,
  currentEntryId,
  end,
  start,
}: RecorderDisplayProps) {
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
      {currentEntryId ? (
        <Button onClick={end}>End</Button>
      ) : (
        <Button onClick={start}>Start</Button>
      )}
      <div className="container mx-auto py-10">
        <DataTable columns={timeTableColumns} data={entries} />
      </div>
    </>
  )
}
