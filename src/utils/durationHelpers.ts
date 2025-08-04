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
