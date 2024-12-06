import { useEvent } from '@app/hooks/use-event'
import { toast } from 'sonner'

export function useServerErrors() {
  useEvent('server-error', (event) => {
    toast.error(event.detail.body.error)
  })
}
