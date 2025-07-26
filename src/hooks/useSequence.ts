import { useState, useCallback } from "react";
import { api } from "../utils/api";
import { removeNullFieldsFromSequence } from "../utils/sequenceHelpers";
import { CleanedFullSequence, RawFullSequence } from "../constants/types";

export function useSequence(id: string | undefined) {
    const [sequence, setSequence] = useState<CleanedFullSequence | null>(null); // This sequence is local to the component that uses the hook

    const initializeSequence = useCallback(async () => {
        if (!id) return;

        try {
            const res: RawFullSequence = await api.get(
                `/v1/sequences/${id}/full`
            );
            console.log("Fetched raw sequence from db:\n", res);
            const cleanedSequence = removeNullFieldsFromSequence(res);
            setSequence(cleanedSequence);
        } catch (err: any) {
            console.error("Error initializing sequence: ", err);
            throw err;
        }
    }, [id]);

    const initializeDurationsSequence = useCallback(async () => {
        if (!id) return;

        try {
            const res = await api.get(`/v1/sequences/${id}/full`);
            console.log("Fetched raw sequence from db:\n", res);

            const filteredSequence = {
                ...res,
                exercises: res.exercises.filter(
                    (exercise: any) => exercise.duration_secs != null
                ),
            };

            setSequence(filteredSequence);
        } catch (err: any) {
            console.error("Error initializing sequence: ", err);
            throw err;
        }
    }, [id]);

    return {
        sequence,
        setSequence,
        initializeSequence,
        initializeDurationsSequence,
    };
}
