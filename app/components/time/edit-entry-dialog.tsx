import { FormInput } from '@app/components/form/form-input'
import { Button } from '@app/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog'
import { EditTimeEntrySchema } from '@common/forms/time-entry'
import { Time } from '@common/utils/time'
import type { PartialExcept } from '@common/utils/types'
import type { TimeEntry } from '@server/db/schema'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'

export function EditEntryDialog({
  entry,
  onEdit,
  onClose,
}: {
  entry: TimeEntry | null
  onEdit: (entry: PartialExcept<TimeEntry, 'id'>) => Promise<void>
  onClose?: () => void
}) {
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

      await onEdit({
        id: entry.id,
        startedAt: newStartedAt?.getDate(),
        endedAt: newEndedAt?.getDate(),
        description: data.description,
      })
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
