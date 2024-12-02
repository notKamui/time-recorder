import { Input } from '@app/components/ui/input'
import { Label } from '@app/components/ui/label'
import { text } from '@app/components/ui/primitives/typography'
import type {
  FieldApi,
  ReactFormExtendedApi,
  Validator,
} from '@tanstack/react-form'
import { AnimatePresence, motion } from 'motion/react'
import type { ZodType, ZodTypeDef } from 'zod'

export interface FormInputProps<F extends Record<string, any>> {
  type: React.HTMLInputTypeAttribute
  form: ReactFormExtendedApi<
    F,
    Validator<unknown, ZodType<any, ZodTypeDef, any>>
  >
  name: keyof F
  label: string
}

export function FormInput<F extends Record<string, any>>({
  type = 'text',
  name,
  form,
  label,
}: FormInputProps<F>) {
  return (
    <form.Field name={name as any}>
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>{label}</Label>
          <Input
            type={type}
            id={field.name}
            name={field.name}
            value={field.state.value as any}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value as any)}
          />
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
