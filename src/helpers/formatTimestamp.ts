export function formatTimestamp(
  timestamp: string,
  { onlyDate = false, ignoreYear = true } = {}
): string {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: ignoreYear ? undefined : 'numeric',
    month: 'short',
    day: 'numeric',
    hour: onlyDate ? undefined : '2-digit',
    minute: onlyDate ? undefined : '2-digit',
    hour12: false,
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}
