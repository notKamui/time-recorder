import { Button } from '@app/components/ui/button'
import { cn } from '@app/utils/cn'
import type { TimeEntry } from '@server/db/schema'
import {
  $createTimeEntry,
  $updateTimeEntry,
} from '@server/functions/time-entry'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { forwardRef, useState } from 'react'

export type TimeRecorderControlsProps = {
  entries: TimeEntry[]
  className?: string
}

function useTimeTableControls(entries: TimeRecorderControlsProps['entries']) {
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

  return {
    start,
    end,
    currentEntryId,
  }
}

export const TimeRecorderControls = forwardRef<
  HTMLDivElement,
  TimeRecorderControlsProps
>(({ entries, className }, elementRef) => {
  const { start, end, currentEntryId } = useTimeTableControls(entries)

  return (
    <div ref={elementRef} className={cn('container rounded-md border', className)}>
      {currentEntryId ? (
        <Button onClick={end}>End</Button>
      ) : (
        <Button onClick={start}>Start</Button>
      )}
    </div>
  )
})
