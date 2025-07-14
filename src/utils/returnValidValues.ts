import { Exercise } from "../constants/types";

export const getValidDurationSecs = (exercise: Exercise) => {
    return exercise.duration_secs && typeof exercise.duration_secs === "number"
        ? exercise.duration_secs
        : 0;
};
