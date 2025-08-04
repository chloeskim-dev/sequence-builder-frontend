import { useState, useEffect } from "react";
import { ExerciseInputs } from "../../../constants/types";
import { useUser } from "../../../contexts/UserContext";
import { ReusableTable } from "../../layouts/ReusableTable";
import { SortDirection } from "../../../utils/listHelpers";
import { useFavoriteExercises } from "../../../hooks/useFavoriteExercises";
import { splitDuration } from "../../../utils/durationHelpers";

type Props = {
    handleAddFavoriteExercise: (newFavExercise: ExerciseInputs) => void;
};

function FavoriteExercisesDropdown({ handleAddFavoriteExercise }: Props) {
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const { user } = useUser();
    const userId = user?.id ?? null;

    const {
        fetchFavoriteExercises,
        fetchedFavoriteExercises,
        displayFavoriteExercises,
        setFavoriteExercisesToDisplay,
        error,
        setError,
    } = useFavoriteExercises(userId!);

    useEffect(() => {
        fetchFavoriteExercises();
    }, []);

    useEffect(() => {
        setFavoriteExercisesToDisplay(sortBy, sortDirection, "");
    }, [sortBy, sortDirection, fetchedFavoriteExercises]);

    const thereAreFavoriteExercisesToDisplay =
        displayFavoriteExercises !== undefined &&
        displayFavoriteExercises.length !== 0;

    const onEntireRowClick = (rowItem: any) => {
        let durations =
            rowItem.duration_secs === undefined ||
            rowItem.duration_secs === null
                ? undefined
                : splitDuration(rowItem.duration_secs);
        handleAddFavoriteExercise({
            ...rowItem,
            duration_mins: durations ? durations.splitMinutes : undefined,
            duration_secs: durations ? durations.splitSeconds : undefined,
        });
    };

    return (
        <div>
            {thereAreFavoriteExercisesToDisplay && (
                <ReusableTable
                    items={displayFavoriteExercises}
                    getActionButtonsForItem={(item, index) => []}
                    standardFields={[
                        "name",
                        "direction",
                        "duration",
                        "resistance",
                        "notes",
                    ]}
                    actionsFieldWidthStyle="w-[70px]"
                    listType="favorites"
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    onEntireRowClick={onEntireRowClick}
                />
            )}
        </div>
    );
}

export default FavoriteExercisesDropdown;
