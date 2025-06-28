export function formatUtcToLocalTrimmed(utcString: string): string {
  // Remove the fractional seconds
  const trimmed = utcString.split(".")[0].replace(" ", "T") + "Z";
  // Convert to local time
  const localDate = new Date(trimmed);
  // Format as 'YYYY-MM-DD HH:MM:SS' in local time:
  const yyyy = localDate.getFullYear();
  const mm = String(localDate.getMonth() + 1).padStart(2, "0");
  const dd = String(localDate.getDate()).padStart(2, "0");
  const hh = String(localDate.getHours()).padStart(2, "0");
  const mi = String(localDate.getMinutes()).padStart(2, "0");
  const ss = String(localDate.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}
