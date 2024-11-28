import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: () => {
    const [state, setState] = useState(0)

    return (
      <Button
        onClick={() => setState((prev) => prev + 1)}
      >
        Add 1 to {state}?
      </Button>
    )
  },
})
