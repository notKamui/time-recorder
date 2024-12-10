import { CalendarSelect } from '@app/components/ui/calendar-select'
import { text } from '@app/components/ui/primitives/typography'
import { Label } from '@radix-ui/react-label'
import type {
  FieldApi,
  ReactFormExtendedApi,
  Validator,
} from '@tanstack/react-form'
import { AnimatePresence, motion } from 'motion/react'
import type { ZodType, ZodTypeDef } from 'zod'

export interface DateInputProps<F extends Record<string, any>> {
  form: ReactFormExtendedApi<
    F,
    Validator<unknown, ZodType<any, ZodTypeDef, any>>
  >
  name: keyof F
  label: string
}

export function DateInput<F extends Record<string, any>>({
  name,
  form,
  label,
}: DateInputProps<F>) {
  return (
    <form.Field name={name as any}>
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>{label}</Label>
          <CalendarSelect
            value={field.state.value as any}
            onBlur={field.handleBlur}
            onChange={(date) => field.handleChange(date as any)}
            ariaHidden
          />
          {/* <input
            type="date"
            value={field.state.value as any}
            onChange={(event) => field.handleChange(event.target.value as any)}
            className="sr-only"
          /> */}
          <FieldInfo field={field} />
        </div>
      )}
    </form.Field>
  )
}

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <AnimatePresence>
      {field.state.meta.isTouched && field.state.meta.errors.length && (
        <motion.p
          key={`${field.name}Errors`}
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className={text({ variant: 'small', color: 'error' })}
        >
          {field.state.meta.errors.join(',')}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
