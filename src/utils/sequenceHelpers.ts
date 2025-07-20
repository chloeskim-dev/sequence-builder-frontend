import { Exercise, FavoriteExercise, Sequence } from "../constants/types";

export interface RawFullSequence {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    exercises: RawExercise[];
}

export interface RawExercise {
    id: string;
    name: string;
    direction: string | null;
    duration_secs: number | null;
    resistance: string | null;
    notes: string | null;
    created_at: string;
    orderIndex: number;
}

export interface CleanedFullSequence {
    id: string;
    userId: string;
    name: string;
    description?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    exercises: CleanedUpExercise[];
}

export interface CleanedUpExercise {
    id: string;
    name: string;
    direction?: string;
    duration_secs?: number;
    resistance?: string;
    notes?: string;
    created_at: string;
    orderIndex: number;
    user_id: string;
}

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

export interface favoriteExerciseFetchResult {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    direction: string | null;
    duration_secs: number | null;
    resistance: string | null;
    notes: string | null;
}
export interface CleanedUpFavoriteExercise {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    direction?: string;
    duration_secs?: number;
    resistance?: string;
    notes?: string;
}
export interface FavoriteExerciseBasePayload {
    user_id: string;
    name: string;
    direction?: string;
    duration_secs?: number;
    resistance?: string;
    notes?: string;
}

export const removeNullFieldsFromFavoriteExercise = (
    favorite_exercise: favoriteExerciseFetchResult
): CleanedUpFavoriteExercise => {
    return Object.fromEntries(
        Object.entries(favorite_exercise).filter(([_, value]) => value !== null)
    ) as CleanedUpFavoriteExercise;
};

export const removeNullFieldsFromFavoriteExercises = (
    exercises: favoriteExerciseFetchResult[]
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
