import {
    CleanedFullSequence,
    CleanedUpExercise,
    CleanedUpFavoriteExercise,
    Exercise,
    RawExercise,
    RawFavoriteExercise,
    RawFullSequence,
    Sequence,
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
): Exercise[] => {
    const cleanedExercises = exercises.map((exercise) =>
        removeNullFieldsFromExercise(exercise)
    );
    console.log("Removed null fields from exercises.");
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
    const cleanedExercises = exercises.map((exercise) =>
        removeNullFieldsFromFavoriteExercise(exercise)
    );
    console.log("Removed null fields from favorite exercises.");
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
    const cleanedSequences = sequences.map((seq) =>
        removeNullFieldsFromSequence(seq)
    );
    console.log("Removed null fields from sequences.");
    return cleanedSequences;
};

export const getSequenceTotalDurationSecs = (sequence: Sequence) => {
    return sequence.exercises.reduce(
        (acc: any, exercise: any) => acc + (exercise.duration_secs ?? 0),
        0
    );
};

export const filterBySearchQuery = (items: any, searchQuery: string) => {
    return items.filter((item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
};
