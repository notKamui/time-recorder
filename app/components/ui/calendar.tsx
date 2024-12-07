import { buttonVariants } from '@app/components/ui/primitives/button'
import { cn } from '@app/utils/cn'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from 'lucide-react'
import { DayFlag, DayPicker, SelectionState, UI } from 'react-day-picker'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        [UI.Months]: 'relative',
        [UI.Month]: 'ml-0 space-y-4',
        [UI.MonthCaption]: 'flex h-7 items-center justify-center',
        [UI.CaptionLabel]: 'font-medium text-sm',
        [UI.PreviousMonthButton]: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute top-0 left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        [UI.NextMonthButton]: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute top-0 right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        [UI.MonthGrid]: 'w-full border-collapse space-y-1',
        [UI.Weekdays]: 'flex',
        [UI.Weekday]:
          'w-9 rounded-md font-normal text-[0.8rem] text-muted-foreground',
        [UI.Week]: 'mt-2 flex w-full',
        [UI.Day]:
          'relative h-9 w-9 rounded-md p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
        [UI.DayButton]: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal hover:bg-primary hover:text-primary-foreground aria-selected:opacity-100',
        ),
        [SelectionState.range_end]: 'day-range-end',
        [SelectionState.selected]:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        [SelectionState.range_middle]:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        [DayFlag.today]: 'bg-accent text-accent-foreground',
        [DayFlag.outside]:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        [DayFlag.disabled]: 'text-muted-foreground opacity-50',
        [DayFlag.hidden]: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) => <Chevron {...props} />,
      }}
      {...props}
    />
  )
}

function Chevron({
  orientation = 'left',
}: {
  orientation?: 'left' | 'right' | 'up' | 'down'
}) {
  switch (orientation) {
    case 'left':
      return <ChevronLeftIcon className="h-4 w-4" />
    case 'right':
      return <ChevronRightIcon className="h-4 w-4" />
    case 'up':
      return <ChevronUpIcon className="h-4 w-4" />
    case 'down':
      return <ChevronDownIcon className="h-4 w-4" />
  }
}
