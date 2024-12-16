import { FieldInfo } from '@app/components/form/field-info'
import { Label } from '@app/components/ui/label'
import { Textarea } from '@app/components/ui/textarea'
import type { ReactFormExtendedApi, Validator } from '@tanstack/react-form'
import type { ZodType, ZodTypeDef } from 'zod'

export interface TextInputProps<F extends Record<string, any>> {
  form: ReactFormExtendedApi<
    F,
    Validator<unknown, ZodType<any, ZodTypeDef, any>>
  >
  name: keyof F
  label: string
}

export function TextInput<F extends Record<string, any>>({
  name,
  form,
  label,
}: TextInputProps<F>) {
  return (
    <form.Field name={name as any}>
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>{label}</Label>
          <Textarea
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
