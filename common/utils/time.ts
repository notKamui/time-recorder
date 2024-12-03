export interface Time {
  shiftDays(days: number): Time
  toISOString(): string
  formatDay(): string
  isToday(): boolean
  getDate(): Date
}

export namespace Time {
  export function now(): Time {
    return from(new Date())
  }

  export function from(date: Date | string): Time {
    const _date = date ? new Date(date) : new Date()

    function getDate(): Date {
      return new Date(_date)
    }

    function shiftDays(days: number): Time {
      const date = getDate()
      return from(new Date(date.setDate(date.getDate() + days)))
    }

    function toISOString(): string {
      return _date.toISOString()
    }

    function isToday(): boolean {
      const today = new Date()
      return (
        _date.getDate() === today.getDate() &&
        _date.getMonth() === today.getMonth() &&
        _date.getFullYear() === today.getFullYear()
      )
    }

    function formatDay(): string {
      return isToday()
        ? 'Today'
        : _date.toLocaleDateString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
    }

    return {
      shiftDays,
      toISOString,
      formatDay,
      isToday,
      getDate,
    }
  }
}


