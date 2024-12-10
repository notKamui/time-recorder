import { DataTable } from '@app/components/data/data-table'
import { FormInput } from '@app/components/form/form-input'
import { TimeRecorderControls } from '@app/components/time/time-recorder-controls'
import { Button } from '@app/components/ui/button'
import { CalendarSelect } from '@app/components/ui/calendar-select'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog'
import { cn } from '@app/utils/cn'
import { EditTimeEntrySchema } from '@common/forms/time-entry'
import { Time } from '@common/utils/time'
import type { TimeEntry } from '@server/db/schema'
import { $updateTimeEntry } from '@server/functions/time-entry'
import { useForm } from '@tanstack/react-form'
import { Link, useRouter } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useServerFn } from '@tanstack/start'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'

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

  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null)

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
          columns={timeTableColumns}
          data={entries}
          onRowClick={(row) => setSelectedEntry(row)}
        />

        {isToday && (
          <TimeRecorderControls
            className="max-h-96 min-h-96 max-w-full lg:max-w-md"
            entries={entries}
          />
        )}
      </div>

      <EditEntryDialog
        key={selectedEntry?.id}
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  )
}

function EditEntryDialog({
  entry,
  onClose,
}: { entry: TimeEntry | null; onClose?: () => void }) {
  const router = useRouter()
  const updateEntry = useServerFn($updateTimeEntry)

  const defaultStartedAt = entry?.startedAt
    ? Time.from(entry.startedAt).formatTime({ short: true })
    : undefined
  const defaultEndedAt = entry?.endedAt
    ? Time.from(entry.endedAt).formatTime({ short: true })
    : undefined
  const defaultDescription = entry?.description ?? ''

  const form = useForm({
    defaultValues: {
      startedAt: defaultStartedAt,
      endedAt: defaultEndedAt,
      description: defaultDescription,
    },
    onSubmit: async ({ value: data }) => {
      if (!entry) return
      const newStartedAt = data.startedAt
        ? Time.from(entry.startedAt).setTime(data.startedAt)
        : undefined
      const newEndedAt = data.endedAt
        ? Time.from(entry.endedAt).setTime(data.endedAt)
        : undefined

      await updateEntry({
        data: {
          id: entry?.id,
          startedAt: newStartedAt?.getDate(),
          endedAt: newEndedAt?.getDate(),
          description: data.description,
        },
      })
      await router.invalidate()
      onClose?.()
    },
    validatorAdapter: zodValidator(),
    validators: {
      onBlur: EditTimeEntrySchema,
    },
  })

  return (
    <Dialog open={entry !== null} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit entry</DialogTitle>
            <DialogDescription className="sr-only">
              Edit time entry dialog
            </DialogDescription>
          </DialogHeader>

          {/* <DateInput form={form} name="startedAt" label="Started at" /> */}

          {/* <DateInput form={form} name="endedAt" label="Ended at" /> */}

          <FormInput
            type="time"
            form={form}
            name="startedAt"
            label="Started at"
          />

          <FormInput type="time" form={form} name="endedAt" label="Ended at" />

          <FormInput
            type="text"
            form={form}
            name="description"
            label="Description"
          />

          <DialogFooter>
            <form.Subscribe selector={(state) => state.canSubmit}>
              {(canSubmit) => (
                <Button type="submit" disabled={!canSubmit}>
                  Save
                </Button>
              )}
            </form.Subscribe>
            <DialogClose asChild>
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
