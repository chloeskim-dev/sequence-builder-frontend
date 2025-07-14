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
