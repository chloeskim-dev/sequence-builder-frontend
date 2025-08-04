export function getUtcNaiveTimestamp(): string {
    const now = new Date();

    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(now.getUTCDate()).padStart(2, "0");

    const hh = String(now.getUTCHours()).padStart(2, "0");
    const mi = String(now.getUTCMinutes()).padStart(2, "0");
    const ss = String(now.getUTCSeconds()).padStart(2, "0");

    const ms = String(now.getUTCMilliseconds()).padStart(3, "0");
    const microseconds = ms + "000"; // Simulate microseconds

    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}.${microseconds}`;
}

export function formatSecondsToTimeString(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    if (hours > 0) {
        return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    } else {
        return `${paddedMinutes}:${paddedSeconds}`;
    }
}

interface localTimeStrings {
    date: string;
    time: string;
}

export function formatUtcToLocalTrimmed(utcString: string): localTimeStrings {
    const trimmed = utcString.split(".")[0].replace(" ", "T") + "Z";
    const localDate = new Date(trimmed);
    const yyyy = localDate.getFullYear();
    const mm = String(localDate.getMonth() + 1).padStart(2, "0");
    const dd = String(localDate.getDate()).padStart(2, "0");
    const hh = String(localDate.getHours()).padStart(2, "0");
    const mi = String(localDate.getMinutes()).padStart(2, "0");

    return {
        date: `${yyyy}-${mm}-${dd}`,
        time: `${hh}:${mi}`,
    };
}
