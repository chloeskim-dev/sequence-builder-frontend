import {
    CleanedUpExercise,
    CleanedUpFavoriteExercise,
    RawExercise,
    RawFavoriteExercise,
    RawFullSequence,
    CleanedFullSequence,
} from "../constants/types";

export const removeNullFieldsFromExercise = (
    exercise: RawExercise
): CleanedUpExercise => {
    return Object.fromEntries(
        Object.entries(exercise).filter(([_, value]) => value !== null)
    ) as CleanedUpExercise;
};

export const removeNullFieldsFromExercises = (
    exercises: RawExercise[]
): CleanedUpExercise[] => {
    const cleanedExercises = exercises.map(removeNullFieldsFromExercise);
    return cleanedExercises;
};

export const removeNullFieldsFromFavoriteExercise = (
    favorite_exercise: RawFavoriteExercise
): CleanedUpFavoriteExercise => {
    return Object.fromEntries(
        Object.entries(favorite_exercise).filter(([_, value]) => value !== null)
    ) as CleanedUpFavoriteExercise;
};

export const removeNullFieldsFromFavoriteExercises = (
    exercises: RawFavoriteExercise[]
): CleanedUpFavoriteExercise[] => {
    const cleanedExercises = exercises.map(
        removeNullFieldsFromFavoriteExercise
    );
    return cleanedExercises;
};

export const removeNullFieldsFromSequence = (
    sequence: RawFullSequence
): CleanedFullSequence => {
    const { exercises, ...rest } = sequence;

    const cleanedTopLevel = Object.fromEntries(
        Object.entries(rest).filter(([_, value]) => value !== null)
    );

    const cleanedExercises = exercises.map(removeNullFieldsFromExercise);

    return {
        ...cleanedTopLevel,
        exercises: cleanedExercises,
    } as CleanedFullSequence;
};

export const removeNullFieldsFromSequences = (
    sequences: RawFullSequence[]
): CleanedFullSequence[] => {
    const cleanedSequences = sequences.map(removeNullFieldsFromSequence);
    return cleanedSequences;
};

export const getSequenceTotalDurationSecs = (sequence: CleanedFullSequence) => {
    return sequence.exercises.reduce(
        (acc: number, exercise: any) => acc + (exercise.duration_secs ?? 0),
        0
    );
};
