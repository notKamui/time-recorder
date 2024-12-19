import { FieldInfo } from '@app/components/form/field-info'
import { CalendarSelect } from '@app/components/ui/calendar-select'
import { Label } from '@radix-ui/react-label'
import type { ReactFormExtendedApi, Validator } from '@tanstack/react-form'
import type { ZodType, ZodTypeDef } from 'zod'

export interface DateInputProps<F extends Record<string, any>> {
  form: ReactFormExtendedApi<
    F,
    Validator<unknown, ZodType<any, ZodTypeDef, any>> | undefined
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
          <FieldInfo field={field} />
        </div>
      )}
    </form.Field>
  )
}
