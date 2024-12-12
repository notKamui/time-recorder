import { DataTable } from '@app/components/data/data-table'
import { EditEntryDialog } from '@app/components/time/edit-entry-dialog'
import { TimeRecorderControls } from '@app/components/time/time-recorder-controls'
import { Button } from '@app/components/ui/button'
import { CalendarSelect } from '@app/components/ui/calendar-select'
import {} from '@app/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@app/components/ui/dropdown-menu'
import { cn } from '@app/utils/cn'
import { Time } from '@common/utils/time'
import type { TimeEntry } from '@server/db/schema'
import {
  $deleteTimeEntry,
  $updateTimeEntry,
} from '@server/functions/time-entry'
import { Link, useRouter } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useServerFn } from '@tanstack/start'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from 'lucide-react'
import { useMemo, useState } from 'react'

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
  const router = useRouter()
  const updateEntry = useServerFn($updateTimeEntry)
  const deleteEntry = useServerFn($deleteTimeEntry)

  const dayBefore = time.shift('days', -1)
  const dayAfter = time.shift('days', 1)
  const isToday = time.isToday()

  function onDateChange(time: Time) {
    if (time.isToday()) return router.navigate({ to: '/time' })
    router.navigate({
      to: '/time/$day',
      params: { day: time.toISOString() },
    })
  }

  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null)

  const columnsWithActions = useMemo<typeof timeTableColumns>(
    () => [
      ...timeTableColumns,
      {
        id: 'actions',
        cell: ({ row }) => {
          const entry = row.original

          return (
            <ActionsMenu
              onEdit={() => setSelectedEntry(entry)}
              onDelete={async () => {
                await deleteEntry({ data: { id: entry.id } })
                await router.invalidate()
              }}
            />
          )
        },
      },
    ],
    [deleteEntry, router],
  )

  return (
    <div className="flex size-full flex-col gap-4">
      <div className="flex flex-row items-center">
        <Button size="icon" className="h-[36px] rounded-r-none" asChild>
          <Link to="/time/$day" params={{ day: dayBefore.toISOString() }}>
            <ChevronLeftIcon />
          </Link>
        </Button>
        <CalendarSelect
          value={time.getDate()}
          onChange={(date) => onDateChange(Time.from(date))}
          className={cn(isToday ? 'rounded-l-none' : 'rounded-none')}
        />
        <h3 className="sr-only">{time.formatDay()}</h3>
        {!isToday && (
          <Button
            size="icon"
            className={cn('h-[36px] rounded-l-none')}
            disabled={isToday}
            asChild
          >
            <Link to="/time/$day" params={{ day: dayAfter.toISOString() }}>
              <ChevronRightIcon />
            </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-col-reverse gap-4 lg:flex-row">
        <DataTable
          className="flex-grow"
          columns={columnsWithActions}
          data={entries}
        />

        {isToday && (
          <TimeRecorderControls
            className="max-h-96 min-h-96 max-w-full lg:max-w-md"
            entries={entries}
          />
        )}
      </div>

      <EditEntryDialog
        entry={selectedEntry}
        onEdit={async (entry) => {
          await updateEntry({ data: entry })
          await router.invalidate()
        }}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  )
}

function ActionsMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open action menu for row"
          variant="ghost"
          size="icon"
        >
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onEdit}>
          <EditIcon /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={onDelete}>
          <Trash2Icon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
