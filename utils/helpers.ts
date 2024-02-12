import dayjs from "dayjs";
import test from "node:test";

export const capitalize = (s: string) => {
    if (typeof s !== 'string') return s
    return s.charAt(0).toUpperCase() + s.slice(1)
}


export const calculateDateWithOffset = (targetDate: string, units: string | undefined, range: number | undefined) => {
    let date
    if (units && range) {

        switch (units) {
            case 'days_before':
            date = dayjs(targetDate).subtract(range, 'day').toISOString()
            break
        case 'days_after':
            date = dayjs(targetDate).add(range, 'day').toISOString()
            break
        case 'weeks_before':
            date = dayjs(targetDate).subtract(range, 'week').toISOString()
        break
        case 'weeks_after':
            date = dayjs(targetDate).add(range, 'week').toISOString()
            break
        case 'months_before':
            date = dayjs(targetDate).subtract(range, 'month').toISOString()
            break
        case 'months_after':
            date = dayjs(targetDate).add(range, 'month').toISOString()
            break
        case 'years_before':
            date = dayjs(targetDate).subtract(range, 'year').toISOString()
            break
        case 'years_after':
            date = dayjs(targetDate).add(range, 'year').toISOString()
            break
        default:
            date = targetDate
    }
} console.log("calculation")
    return dayjs(date).toISOString()
};

// const date = new Date()
// const testDate = calculateDateWithOffset(date.toISOString(), 'weeks_after', 2)
// console.log(testDate)
// console.log(typeof testDate)
// const defaultDateType =  new Date(testDate)
// console.log(dayjs(defaultDateType).format("ddd DD/MM/YYYY"))

export const calculateOffsetFromDate = (targetDate: string, datePicked: string) => {
    const range = dayjs(datePicked).diff(dayjs(targetDate), 'day')
    return range
}

// const date = new Date()
// const endDate = dayjs('2022-01-10');
// const testDate = calculateOffsetFromDate(date.toISOString(), endDate as string)
// console.log(testDate)



export const dayjsFormat = (date: Date) => {
    return dayjs(date).format("ddd DD/MM/YYYY")
}


export const checkForPhaseOverlap = (events: EventType[]) => {
    let eventsByPhase = events.reduce((acc: (EventType[])[], event: EventType) => {
        if (acc.length !== event.phase_number) {
            acc.push([event])
        }
        if (acc.length === event.phase_number) {
            acc[event.phase_number - 1].push(event)
        }
        return acc
    }, []);

    

}
