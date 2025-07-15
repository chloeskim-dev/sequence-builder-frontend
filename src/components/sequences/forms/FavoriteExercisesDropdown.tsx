import { useState, useEffect } from "react";
import { splitDuration } from "../../../utils/timeHelpers";
import { ExerciseInputs, FavoriteExercise } from "../../../constants/types";
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";
import { ReusableTable } from "../../layouts/ReusableTable";

type FavoriteExercisesDropdownProps = {
    handleAddFavoriteExercise: (newFavExercise: ExerciseInputs) => void;
};

function FavoriteExercisesDropdown({
    handleAddFavoriteExercise,
}: FavoriteExercisesDropdownProps) {
    const [favoriteExercises, setFavoriteExercises] = useState<
        FavoriteExercise[]
    >([]);
    const { user } = useUser();
    const userId = user?.id ?? null;

    useEffect(() => {
        const fetchFavoriteExercises = async () => {
            try {
                const res = await api.get(
                    `/v1/favorite_exercises/user/${userId}`
                );
                console.log("fetched favorite exercises for user: ", res);
                setFavoriteExercises(res);
            } catch (err: any) {
                console.error("Error fetching sequences:", err);
            }
        };
        fetchFavoriteExercises();
    }, [userId]);

    return (
        <ReusableTable
            items={favoriteExercises}
            getActionButtonsForItem={(item, index) => [
                {
                    title: "Add",
                    action: () => {
                        let durations =
                            item.duration_secs === undefined ||
                            item.duration_secs === null
                                ? undefined
                                : splitDuration(item.duration_secs);
                        handleAddFavoriteExercise({
                            ...item,
                            duration_mins: durations
                                ? durations.splitMinutes
                                : undefined,
                            duration_secs: durations
                                ? durations.splitSeconds
                                : undefined,
                        });
                    },
                },
            ]}
            standardFields={[
                "name",
                "direction",
                "duration",
                "resistance",
                "notes",
            ]}
            actionsFieldWidthStyle="w-[70px]"
        />
    );
}

export default FavoriteExercisesDropdown;
