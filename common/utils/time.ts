export interface Time {
  shiftDays(days: number): Time
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

    function shiftDays(days: number): Time {
      const date = getDate()
      return from(new Date(date.setDate(date.getDate() + days)))
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
      shiftDays,
      toISOString,
      formatDay,
      formatTime,
      isToday,
      getDate,
    }
  }
}
