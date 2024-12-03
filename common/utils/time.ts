type ShiftType = 'days' | 'months' | 'years' | 'hours' | 'minutes' | 'seconds'

export interface Time {
  shift(type: ShiftType, count: number): Time
  toISOString(): string
  formatDay(): string
  formatTime(): string
  isToday(): boolean
  getDate(): Date
}

export namespace Time {
  export function now(): Time {
    return from(new Date())
  }

  export function from(date: Date | string): Time {
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
        case 'days': return from(new Date(date.setDate(date.getDate() + count)))
        case 'months': return from(new Date(date.setMonth(date.getMonth() + count)))
        case 'years': return from(new Date(date.setFullYear(date.getFullYear() + count)))
        case 'hours': return from(new Date(date.setHours(date.getHours() + count)))
        case 'minutes': return from(new Date(date.setMinutes(date.getMinutes() + count)))
        case 'seconds': return from(new Date(date.setSeconds(date.getSeconds() + count)))
        default: throw new Error('Unknown shift type')
      }
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

    function formatDay(): string {
      return isToday()
        ? 'Today'
        : getDate().toLocaleDateString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
    }

    function formatTime(): string {
      return getDate().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }

    return {
      shift,
      toISOString,
      formatDay,
      formatTime,
      isToday,
      getDate,
    }
  }
}
