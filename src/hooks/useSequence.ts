import { useState, useCallback } from "react";
import { api } from "../utils/api";
import { removeNullFieldsFromSequence } from "../utils/cleanupHelpers";
import {
    CleanedFullSequence,
    CleanedUpExercise,
    DurationsSequence,
    RawFullSequence,
} from "../constants/types";

export function useSequence(id: string | undefined) {
    const [sequence, setSequence] = useState<CleanedFullSequence | undefined>(
        undefined
    );

    const [error, setError] = useState<string>("null");

    const fetchSequence = async () => {
        try {
            const res: RawFullSequence = await api.get(
                `/v1/sequences/${id}/full`
            );
            const cleanedSequence = removeNullFieldsFromSequence(res);
            setSequence(cleanedSequence);
            setError("");
        } catch (err: any) {
            console.error("Error fetching favorite exercises:", err);
            setError(err.message);
        }
    };

    const removeExercisesWithoutDurationFromSequence = (
        sequence: CleanedFullSequence
    ) => {
        return {
            ...sequence,
            exercises: sequence.exercises.filter(
                (exercise: CleanedUpExercise) => exercise.duration_secs != null
            ),
        } as DurationsSequence;
    };

    return {
        sequence,
        setSequence,
        fetchSequence,
        error,
        setError,
        removeExercisesWithoutDurationFromSequence,
    };
}
