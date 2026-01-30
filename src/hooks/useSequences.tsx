import { useCallback, useState } from "react";
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
  const [displaySequences, setDisplaySequences] = useState<
    CleanedFullSequence[] | undefined
  >(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchSequences = useCallback(async () => {
    if (!userId) return;

    try {
      const res: RawFullSequence[] = await api.get(
        `/v1/sequences/user/${userId}/full`,
      );
      setFetchedSequences(res);
      setError("");
    } catch (err: any) {
      console.error("Error fetching sequences:", err);
      setError(err.message);
    }
  }, [userId]);

  const setSequencesToDisplay = useCallback(
    (sortBy: string, sortDirection: SortDirection, searchQuery: string) => {
      if (!fetchedSequences) return;

      try {
        const sorted = sortByField(fetchedSequences, sortBy, sortDirection);
        const sortedCleaned = removeNullFieldsFromSequences(sorted);
        const filteredSortedCleaned = filterBySearchQuery(
          sortedCleaned,
          searchQuery,
        );
        setDisplaySequences(filteredSortedCleaned);
        setError("");
      } catch (err: any) {
        console.error("Error setting sequences to display:", err);
        setError(err.message);
      }
    },
    [fetchedSequences],
  );

  const deleteSequence = useCallback(
    async (sequenceId: string, onAfterDelete?: () => void) => {
      try {
        await api.delete(`/v1/sequences/${sequenceId}`);
        // refetch sequences after deletion
        fetchSequences();

        // optional callback (e.g., reset searchQuery or close modal)
        if (onAfterDelete) onAfterDelete();

        setError("");
      } catch (err: any) {
        console.error("Error deleting sequence:", err);
        setError(
          "Something went wrong while deleting your sequence. Please try again later.",
        );
      }
    },
    [fetchSequences],
  );

  return {
    // fetch
    fetchSequences,
    fetchedSequences,
    setFetchedSequences,
    // display
    displaySequences,
    setDisplaySequences,
    setSequencesToDisplay,
    // delete
    deleteSequence,
    // error
    error,
    setError,
  };
}
