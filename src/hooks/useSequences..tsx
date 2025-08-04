import { useState } from "react";
import { api } from "../utils/api";
import { CleanedFullSequence, RawFullSequence } from "../constants/types";
import {
    filterBySearchQuery,
    sortByField,
    SortDirection,
} from "../utils/listHelpers";
import { removeNullFieldsFromSequences } from "../utils/cleanupHelpers";

export function useSequences(userId: string) {
    const [fetchedSequences, setFetchedSequences] = useState<
        RawFullSequence[] | undefined
    >(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [displaySequences, setDisplaySequences] = useState<
        CleanedFullSequence[] | undefined
    >(undefined);

    const fetchSequences = async () => {
        try {
            const res: RawFullSequence[] = await api.get(
                `/v1/sequences/user/${userId}/full`
            );
            setFetchedSequences(res);
            setError("");
        } catch (err: any) {
            console.error("Error fetching favorite exercises:", err);
            setError(err.message);
        }
    };

    const setSequencesToDisplay = async (
        sortBy: string,
        sortDirection: SortDirection,
        searchQuery: string
    ) => {
        if (fetchedSequences === undefined) {
            return;
        }
        try {
            const sorted = sortByField(fetchedSequences, sortBy, sortDirection);
            const sortedCleaned = removeNullFieldsFromSequences(sorted);
            const filteredSortedCleaned = filterBySearchQuery(
                sortedCleaned,
                searchQuery
            );
            setDisplaySequences(filteredSortedCleaned);
            setError("");
        } catch (err: any) {
            console.error("Error setting favorite exercises to display:", err);
            setError(err.message);
        }
    };

    return {
        fetchedSequences,
        setFetchedSequences,
        fetchSequences,
        displaySequences,
        setDisplaySequences,
        setSequencesToDisplay,
        error,
        setError,
    };
}
