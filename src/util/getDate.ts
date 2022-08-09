export const getDatetimeLocalFormatted = (date: Date) => {
  let year = date.getFullYear()
  let month = String(date.getMonth() + 1)
  month.length < 2 ? month = '0' + month : undefined
  let day = String(date.getDate())
  day.length < 2 ? day = '0' + day : undefined
  let hour = String(date.getHours())
  hour.length < 2 ? hour = '0' + hour : undefined
  let minute = String(date.getMinutes())
  minute.length < 2 ? minute = '0' + minute : undefined

  return `${year}-${day}-${month}T${hour}:${minute}`
}