import { cn } from '@app/utils/cn'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import type { ComponentProps } from 'react'

const Separator = ({
  ref,
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className,
    )}
    {...props}
  />
)

export { Separator }
