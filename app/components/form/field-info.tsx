import { text } from '@app/components/ui/primitives/typography'
import type { FieldApi } from '@tanstack/react-form'
import { AnimatePresence, motion } from 'motion/react'

export function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
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
