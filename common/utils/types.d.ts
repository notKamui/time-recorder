import type { HTMLAttributes, RefObject } from 'react'

export type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type Range<Min extends number, Max extends number> = Exclude<
  Enumerate<Max>,
  Enumerate<Min>
>

export type WithRef<
  T,
  R extends HTMLElement = T extends HTMLAttributes<infer HR>
    ? HR extends HTMLElement
      ? HR
      : never
    : never,
  Mandatory extends boolean = false,
> = R extends never
  ? never
  : Mandatory extends true
    ? T & { ref: RefObject<R> }
    : T & { ref?: RefObject<R> }
