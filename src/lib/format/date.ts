export function formatEventDate(value: string, locale: string, timeZone: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(new Date(value));
}

export function formatRelative(value: string, locale: string): string {
  const diff = new Date(value).getTime() - Date.now();
  const days = Math.round(diff / 86_400_000);
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(days, 'day');
}
