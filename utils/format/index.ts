import Graphemer from 'graphemer'
import dayjs from 'dayjs'

const spliter = new Graphemer()

export const getEllipsisStr = (str: string, prefixLength = 6, breakPoints = prefixLength + 4) => {
  let res = str
  const ellipsis = '...'
  if (str) {
    const splitStrList = spliter.splitGraphemes(str)
    const length = splitStrList.length
    if (length > breakPoints) {
      const prefix = splitStrList.slice(0, prefixLength)
      const suffix = splitStrList.slice(length - 4)
      res = `${prefix.join('')}${ellipsis}${suffix.join('')}`
    }
  }
  return res
}

export function getTimeDifference(endTimestamp: number) {
  const currentTimestamp = Date.now()
  const endDateTime = dayjs(endTimestamp * 1000)
  const currentDateTime = dayjs(currentTimestamp)
  if (endDateTime.isAfter(currentDateTime)) {
    const daysDifference = endDateTime.diff(currentDateTime, 'day')
    const hourDifference = endDateTime.diff(currentDateTime, 'hour')
    const minuteDifference = endDateTime.diff(currentDateTime, 'minute')
    if (minuteDifference <= 60) {
      return `Ends in ${minuteDifference} minutes`
    }
    if (hourDifference <= 24) {
      return `Ends in ${hourDifference} hours`
    }
    if (daysDifference > 365) {
      const yearsDifference = endDateTime.diff(currentDateTime, 'year')
      return `Ends in ${yearsDifference} years`
    } else if (daysDifference > 30) {
      const monthsDifference = endDateTime.diff(currentDateTime, 'month')
      return `Ends in ${monthsDifference} months`
    } else {
      return `Ends in ${daysDifference} days`
    }
  } else {
    const daysDifference = currentDateTime.diff(endDateTime, 'day')
    const hourDifference = currentDateTime.diff(endDateTime, 'hour')
    const minuteDifference = currentDateTime.diff(endDateTime, 'minute')
    if (minuteDifference <= 60) {
      return `Ended ${minuteDifference} minutes ago`
    }
    if (hourDifference <= 24) {
      return `Ended ${hourDifference} hours ago`
    }
    if (daysDifference > 365) {
      const yearsDifference = currentDateTime.diff(endDateTime, 'year')
      return `Ended ${yearsDifference} years ago`
    } else if (daysDifference > 30) {
      const monthsDifference = currentDateTime.diff(endDateTime, 'month')
      return `Ended ${monthsDifference} months ago`
    } else {
      return `Ended ${daysDifference} days ago`
    }
  }
}

export function formatCount(count: number) {
  const THOUSAND = 1000
  const MILLION = 1000000
  if (count < THOUSAND) return count
  if (count >= THOUSAND && count < MILLION) return `${(count / THOUSAND).toFixed(2)}K`
  return `${(count / MILLION).toFixed(2)}M`
}
