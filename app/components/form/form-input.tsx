import { FieldInfo } from '@app/components/form/field-info'
import { Input } from '@app/components/ui/input'
import { Label } from '@app/components/ui/label'
import type { ReactFormExtendedApi, Validator } from '@tanstack/react-form'
import type { ZodType, ZodTypeDef } from 'zod'

export interface FormInputProps<F extends Record<string, any>> {
  type: React.HTMLInputTypeAttribute
  form: ReactFormExtendedApi<
    F,
    Validator<unknown, ZodType<any, ZodTypeDef, any>> | undefined
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
