export const combineDuration = (splitMinutes: number, splitSeconds: number) => {
    return splitMinutes * 60 + splitSeconds;
};

export const splitDuration = (combinedSecs: number) => {
    return {
        splitMinutes: Math.floor(combinedSecs / 60),
        splitSeconds: combinedSecs % 60,
    };
};

export const exerciseDataHasDuration = (exerciseData: any): boolean => {
    return (
        exerciseData.duration_mins !== undefined ||
        exerciseData.duration_secs !== undefined
    );
};

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

// export const normalizeDurations = (minutes: number, seconds: number) => {
//     const combinedDurationSecs = combineDuration(minutes, seconds);
//     const splitDurations = splitDuration(combinedDurationSecs);
//     return splitDurations;
// };
