type ShiftType =
  | 'years'
  | 'months'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'milliseconds'

export interface Time {
  shift(type: ShiftType, count: number): Time
  compare(other: Time, type?: ShiftType): number
  toISOString(): string
  formatDay(options?: { short: boolean }): string
  formatTime(): string
  formatDiff(other: Time): string
  isToday(): boolean
  getDate(): Date
}

export namespace Time {
  export function now(): Time {
    return from(new Date())
  }

  export function from(date: Date | string | null | undefined): Time {
    if (date === null || date === undefined) return now()

    const _date = date
      ? typeof date === 'string'
        ? new Date(date)
        : date
      : new Date()

    function getDate(): Date {
      return new Date(_date)
    }

    function shift(type: ShiftType, count: number): Time {
      const date = getDate()
      switch (type) {
        case 'years':
          return from(new Date(date.setFullYear(date.getFullYear() + count)))
        case 'months':
          return from(new Date(date.setMonth(date.getMonth() + count)))
        case 'days':
          return from(new Date(date.setDate(date.getDate() + count)))
        case 'hours':
          return from(new Date(date.setHours(date.getHours() + count)))
        case 'minutes':
          return from(new Date(date.setMinutes(date.getMinutes() + count)))
        case 'seconds':
          return from(new Date(date.setSeconds(date.getSeconds() + count)))
        case 'milliseconds':
          return from(
            new Date(date.setMilliseconds(date.getMilliseconds() + count)),
          )
        default:
          throw new Error('Unknown shift type')
      }
    }

    function compare(other: Time, type: ShiftType = 'milliseconds'): number {
      const date = getDate()
      const otherDate = other.getDate()
      switch (type) {
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: Fallthrough is intended
        case 'years': {
          date.setMonth(0)
          otherDate.setMonth(0)
        }
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: Fallthrough is intended
        case 'months': {
          date.setDate(0)
          otherDate.setDate(0)
        }
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: Fallthrough is intended
        case 'days': {
          date.setHours(0)
          otherDate.setHours(0)
        }
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: Fallthrough is intended
        case 'hours': {
          date.setMinutes(0)
          otherDate.setMinutes(0)
        }
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: Fallthrough is intended
        case 'minutes': {
          date.setSeconds(0)
          otherDate.setSeconds(0)
        }
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: Fallthrough is intended
        case 'seconds': {
          date.setMilliseconds(0)
          otherDate.setMilliseconds(0)
        }
        case 'milliseconds':
          break
      }
      return date.getTime() - otherDate.getTime()
    }

    function toISOString(): string {
      return getDate().toISOString()
    }

    function isToday(): boolean {
      const today = new Date()
      const date = getDate()
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      )
    }

    function formatDay(options?: { short?: boolean }): string {
      return isToday()
        ? 'Today'
        : options?.short
          ? getDate().toLocaleDateString(['en'], {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : getDate().toLocaleDateString(['en'], {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
    }

    function formatTime(): string {
      return getDate().toLocaleTimeString(['en'], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }

    // HH:MM:SS
    function formatDiff(other: Time): string {
      const diff = Math.abs(compare(other, 'milliseconds'))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0',
      )}:${String(seconds).padStart(2, '0')}`
    }

    return {
      shift,
      compare,
      toISOString,
      formatDay,
      formatTime,
      formatDiff,
      isToday,
      getDate,
    }
  }
}
