import { DataTable } from '@app/components/data/data-table'
import { TimeRecorderControls } from '@app/components/time/time-recorder-controls'
import { Button } from '@app/components/ui/button'
import { CalendarInput } from '@app/components/ui/calendar-input'
import { cn } from '@app/utils/cn'
import { Time } from '@common/utils/time'
import type { TimeEntry } from '@server/db/schema'
import { useRouter } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

export type TimeTableData = Omit<TimeEntry, 'startedAt' | 'endedAt'> & {
  startedAt: string
  endedAt?: string
}

type RecorderDisplayProps = {
  time: Time
  entries: TimeEntry[]
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
      row.endedAt ? Time.from(row.endedAt).formatTime() : null,
    header: 'Ended at',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
]

export function RecorderDisplay({ time, entries }: RecorderDisplayProps) {
  const dayBefore = time.shift('days', -1)
  const dayAfter = time.shift('days', 1)
  const isToday = time.isToday()

  const router = useRouter()
  function onDateChange(time: Time) {
    if (time.isToday()) return router.navigate({ to: '/time' })
    router.navigate({
      to: '/time/$day',
      params: { day: time.toISOString() },
    })
  }

  return (
    <div className="flex size-full flex-col gap-4">
      <div className="flex flex-row items-center">
        <Button
          size="icon"
          className="h-[36px] rounded-r-none"
          onClick={() => onDateChange(dayBefore)}
        >
          <ChevronLeftIcon />
        </Button>
        <CalendarInput
          value={time.getDate()}
          onChange={(date) => onDateChange(Time.from(date))}
          className={cn(isToday ? 'rounded-l-none' : 'rounded-none')}
        />
        <h3 className="sr-only">{time.formatDay()}</h3>
        <Button
          size="icon"
          onClick={() => onDateChange(dayAfter)}
          disabled={isToday}
          className={cn('h-[36px] rounded-l-none', isToday && 'hidden')}
        >
          <ChevronRightIcon />
        </Button>
      </div>
      <div className="flex flex-col-reverse gap-4 lg:flex-row">
        <DataTable
          className="flex-grow"
          columns={timeTableColumns}
          data={entries}
        />

        {isToday && (
          <TimeRecorderControls
            className="max-h-96 min-h-96 max-w-full lg:max-w-md"
            entries={entries}
          />
        )}
      </div>
    </div>
  )
}
