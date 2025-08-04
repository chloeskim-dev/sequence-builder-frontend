import { useState } from "react";
import { api } from "../utils/api";
import {
    CleanedUpFavoriteExercise,
    RawFavoriteExercise,
} from "../constants/types";
import {
    filterBySearchQuery,
    sortByField,
    SortDirection,
} from "../utils/listHelpers";
import { removeNullFieldsFromFavoriteExercises } from "../utils/cleanupHelpers";

export function useFavoriteExercises(userId: string) {
    const [fetchedFavoriteExercises, setFetchedFavoriteExercises] = useState<
        RawFavoriteExercise[] | undefined
    >(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [displayFavoriteExercises, setDisplayFavoriteExercises] = useState<
        CleanedUpFavoriteExercise[] | undefined
    >(undefined);

    const fetchFavoriteExercises = async () => {
        try {
            const res: RawFavoriteExercise[] = await api.get(
                `/v1/favorite_exercises/user/${userId}`
            );
            setFetchedFavoriteExercises(res);
            setError("");
        } catch (err: any) {
            console.error("Error fetching favorite exercises:", err);
            setError(err.message);
        }
    };

    const setFavoriteExercisesToDisplay = async (
        sortBy: string,
        sortDirection: SortDirection,
        searchQuery: string
    ) => {
        if (fetchedFavoriteExercises === undefined) {
            return;
        }
        try {
            const sorted = sortByField(
                fetchedFavoriteExercises,
                sortBy,
                sortDirection
            );
            const sortedCleaned = removeNullFieldsFromFavoriteExercises(sorted);
            const filteredSortedCleaned = filterBySearchQuery(
                sortedCleaned,
                searchQuery
            );
            setDisplayFavoriteExercises(filteredSortedCleaned);
            setError("");
        } catch (err: any) {
            console.error("Error setting favorite exercises to display:", err);
            setError(err.message);
        }
    };

    return {
        fetchFavoriteExercises,
        fetchedFavoriteExercises,
        displayFavoriteExercises,
        setFavoriteExercisesToDisplay,
        error,
        setError,
    };
}
