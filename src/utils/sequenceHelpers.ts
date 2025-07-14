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

export interface CleanedUpExercise {
    id: string;
    name: string;
    direction?: string;
    duration_secs?: number;
    resistance?: string;
    notes?: string;
    created_at: string;
    orderIndex: number;
}

export const removeNullFieldsFromExercise = (
    exercise: RawExercise
): CleanedUpExercise => {
    return Object.fromEntries(
        Object.entries(exercise).filter(([_, value]) => value !== null)
    ) as CleanedUpExercise;
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
