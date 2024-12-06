import { buttonVariants } from '@app/components/ui/primitives/button'
import { cn } from '@app/utils/cn'
import type { WithRef } from '@common/utils/types'
import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = ({
  ref,
  className,
  variant,
  size,
  asChild = false,
  ...props
}: WithRef<ButtonProps>) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
}
Button.displayName = 'Button'
