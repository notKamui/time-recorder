import { type FieldApi, useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { AnimatePresence, motion } from 'motion/react'
import { z } from 'zod'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      name: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: z.object({
        name: z.string().min(3),
      }),
    },
    onSubmit: ({ value }) => {
      console.log(value)
    },
  })

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field name="name">
          {(field) => (
            <div>
              <label htmlFor={field.name}>Name</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <button type="submit" disabled={!canSubmit}>
              Submit
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <AnimatePresence>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <motion.p
          key={`${field.name}Errors`}
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          style={{
            color: 'red',
            fontSize: '0.8em',
          }}
        >
          {field.state.meta.errors.join(', ')}
        </motion.p>
      ) : null}
    </AnimatePresence>
  )
}
