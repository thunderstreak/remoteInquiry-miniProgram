import { useMemo } from 'react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import weekday from 'dayjs/plugin/weekday'
// import zh from 'dayjs/locale/zh-cn'

dayjs.extend(localizedFormat)
dayjs.extend(weekday)

const WEEK_MAP = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六'
}

export const useConvertTime = (startTime?: string | number, endTime?: string | number) => {
  return useMemo(() => {
    let str = ''
    if (!startTime && !endTime) {
      return str
    }
    const currentTime = dayjs()
    // 获取当前日期是否是同一天
    const isSameDay = dayjs(startTime).isSame(endTime, 'day')
    // 获取当前日期所在的周数
    const startWeek = dayjs(startTime).startOf('week').isSame(currentTime.startOf('week'), 'day')
    const endWeek = dayjs(endTime).startOf('week').isSame(currentTime.startOf('week'), 'day')

    const week = dayjs(startTime).weekday()

    // 时间都是一周内并且是同一天
    if (startWeek && endWeek && isSameDay) {
      const startMD = dayjs(startTime).format('MM.DD')
      const startHm = dayjs(startTime).format('HH:mm')
      const end = dayjs(endTime).format('HH:mm')
      str = `${startMD}(${WEEK_MAP[week]}) ${startHm}-${end}`
    }
    // 跨周或者时间都是一周内且不是是同一天
    if (!startWeek || !endWeek || startWeek && endWeek && !isSameDay) {
      const start = dayjs(startTime).format('MM.DD HH:mm')
      const end = dayjs(endTime).format('MM.DD HH:mm')
      str = `${start} - ${end}`
    }
    return str
  }, [endTime, startTime])
}
