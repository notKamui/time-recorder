import { DataTable } from '@app/components/data/data-table'
import { TimeRecorderControls } from '@app/components/time/time-recorder-controls'
import { Button } from '@app/components/ui/button'
import { title } from '@app/components/ui/primitives/typography'
import { cn } from '@app/utils/cn'
import { Time } from '@common/utils/time'
import type { TimeEntry } from '@server/db/schema'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import { motion } from 'motion/react'

export type TimeTableData = Omit<TimeEntry, 'startedAt' | 'endedAt'> & {
  startedAt: string
  endedAt?: string
}

const timeTableColumns: ColumnDef<TimeEntry>[] = [
  {
    accessorKey: 'startedAt',
    accessorFn: (row) => Time.from(row.startedAt).formatTime(),
    header: 'Started at',
  },
  {
    accessorKey: 'endedAt',
    accessorFn: (row) =>
      row.endedAt ? Time.from(row.endedAt).formatTime() : 'Now',
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
  const dayBefore = time.shift('days', -1)
  const dayAfter = time.shift('days', 1)
  const isToday = time.isToday()

  const MotionTimeRecorderControls = motion.create(TimeRecorderControls)

  return (
    <div className="flex size-full flex-col gap-4">
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
            to={dayAfter.isToday() ? '/time' : '/time/$day'}
            params={{ day: dayAfter.toISOString() }}
            disabled={isToday}
          >
            <ChevronsRightIcon />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col-reverse gap-4 lg:flex-row">
        <div className="container flex-grow">
          <DataTable columns={timeTableColumns} data={entries} />
        </div>
        {isToday && (
          <TimeRecorderControls className="h-min max-w-md" entries={entries} />
        )}
      </div>
    </div>
  )
}
