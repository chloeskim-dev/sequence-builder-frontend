import { SequenceFormInputs, ExerciseInputs } from "./types";

export const blankSequenceFormInputs: SequenceFormInputs = {
    name: "",
    description: undefined,
    notes: undefined,
    exercises: [],
};

export const blankExerciseFormInputs: ExerciseInputs = {
    name: "",
    direction: undefined,
    duration_mins: undefined,
    duration_secs: undefined,
    resistance: undefined,
    notes: undefined,
};
