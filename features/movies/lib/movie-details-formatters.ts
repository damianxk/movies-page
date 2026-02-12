export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatRuntime(minutes: number | null) {
  if (!minutes || minutes <= 0) return "Unknown"
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

export function formatDate(value: string) {
  if (!value) return "Unknown"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown"
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(date)
}

export function formatBoolean(value: boolean) {
  return value ? "Yes" : "No"
}
