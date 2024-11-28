import { ThemeToggle } from '@/components/theme/toggle'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: () => {
    const [state, setState] = useState(0)

    return (
      <div>
        <ThemeToggle />
        <Button
          onClick={() => {
            console.log('Adding 1 to', state)
            setState((prev) => prev + 1)
          }}
        >
          Add 1 to {state}?
        </Button>
      </div>
    )
  },
})
