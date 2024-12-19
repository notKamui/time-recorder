export namespace Collection {
  export function partition<T>(
    array: T[],
    predicate: (value: T) => boolean,
  ): [T[], T[]] {
    const truthy: T[] = []
    const falsy: T[] = []
    for (const value of array) {
      if (predicate(value)) truthy.push(value)
      else falsy.push(value)
    }
    return [truthy, falsy]
  }
}
