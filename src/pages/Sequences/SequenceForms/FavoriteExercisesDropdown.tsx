import { SetStateAction, useState, useEffect } from "react";
import { splitDuration } from "../../../utils/timeHelpers";
import { FiHeart } from "react-icons/fi";
import { ExerciseInputs, FavoriteExercise } from "../../../constants/types";
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";
const favoritesDropdownFieldsContainerStyles =
    "flex flex-col md:flex-row md:flex-wrap items-start md:gap-2 gap-0 flex-1";
const favoritesDropdownLabelStyles = "text-xs font-bold md:hidden";
const favoritesDropdownTextStyles = "text-xs break-words truncate";
const blankColWidth = "w-[130px]";

type FavoriteExercisesDropdownProps = {
    showFavoritesDropdown: boolean;
    setShowFavoritesDropdown: React.Dispatch<SetStateAction<boolean>>;
    handleAddFavoriteExercise: (newFavExercise: ExerciseInputs) => void;
};

const dropdownContainerStyles =
    "left-0 right-0 bg-red-600 px-4 pb-4 pt-4 md:pt-0";
const rowStyles =
    "w-full text-left border-t border-red-200 p-2 bg-white hover:bg-red-50";

function FavoriteExercisesDropdown({
    showFavoritesDropdown,
    setShowFavoritesDropdown,
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
        <div className="relative w-full pt-0">
            {showFavoritesDropdown && (
                <div className={dropdownContainerStyles}>
                    {favoriteExercises.length === 0 && (
                        <div className="p-2 text-gray-500">
                            No favorite exercicses found.
                        </div>
                    )}
                    <div className="hidden md:flex md:items-end md:pt-4 md:gap-2 w-full text-left text-white px-2 py-2 bg-red-600 text-xs font-bold">
                        <div className="flex-1 px-2 overflow-hidden flex gap-x-1.5 items-center ">
                            <FiHeart size={10} color="white" fill="white" />
                            <div>Favorite Exercise</div>
                        </div>

                        <div className="flex-1 px-2 overflow-hidden">
                            Direction
                        </div>
                        <div className="flex-1 px-2 overflow-hidden flex gap-x-1">
                            <span>Duration</span>
                            <span className="hidden md:block">(m:s)</span>
                        </div>
                        <div className="flex-1 px-2 overflow-hidden">
                            Resistance
                        </div>
                        <div className="flex-1 px-2 overflow-hidden">Notes</div>
                        <div className="w-[130px] px-2 overflow-hidden"></div>
                    </div>

                    {favoriteExercises.map((fav) => (
                        <button
                            key={fav.id}
                            type="button"
                            className={rowStyles}
                            onClick={() => {
                                let { splitMinutes, splitSeconds } =
                                    splitDuration(fav.duration_secs);
                                handleAddFavoriteExercise({
                                    ...fav,
                                    duration_mins: splitMinutes,
                                    duration_secs: splitSeconds,
                                });
                            }}
                        >
                            <div
                                id="fieldsContainer"
                                className={
                                    favoritesDropdownFieldsContainerStyles
                                }
                            >
                                <div className="flex-1 px-2 overflow-hidden flex items-center">
                                    <label
                                        className={`${favoritesDropdownLabelStyles} hidden`}
                                    >
                                        Name*
                                    </label>
                                    <div
                                        className={`${favoritesDropdownTextStyles} my-2 md:m-0 uppercase md:normal-case font-extrabold text-[17px] md:text-xs md:font-normal flex gap-1.5 items-center`}
                                    >
                                        <FiHeart
                                            size={10}
                                            color="red"
                                            fill="red"
                                        />
                                        {fav.name}
                                    </div>
                                </div>
                                <div className="flex-1 px-2 overflow-hidden">
                                    <label
                                        className={favoritesDropdownLabelStyles}
                                    >
                                        Direction
                                    </label>
                                    <div
                                        className={favoritesDropdownTextStyles}
                                    >
                                        {fav.direction}
                                    </div>
                                </div>
                                <div className="flex-1 px-2 overflow-hidden">
                                    <label
                                        className={favoritesDropdownLabelStyles}
                                    >
                                        Duration
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="flex flex-col">
                                            <label className="text-[9px] font-medium md:hidden">
                                                min
                                            </label>
                                            <div
                                                className={
                                                    favoritesDropdownTextStyles
                                                }
                                            >
                                                {
                                                    splitDuration(
                                                        fav.duration_secs
                                                    ).splitMinutes
                                                }
                                            </div>
                                        </div>
                                        <div className="text-xs self-end pb-0">
                                            :
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[9px] font-medium md:hidden">
                                                sec
                                            </label>
                                            <div
                                                className={
                                                    favoritesDropdownTextStyles
                                                }
                                            >
                                                {fav.duration_secs}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 px-2 overflow-hidden">
                                    <label
                                        className={favoritesDropdownLabelStyles}
                                    >
                                        Resistance
                                    </label>
                                    <div
                                        className={`${favoritesDropdownTextStyles}`}
                                    >
                                        {fav.resistance}
                                    </div>
                                </div>
                                <div className="flex-1 px-2 overflow-hidden">
                                    <label
                                        className={favoritesDropdownLabelStyles}
                                    >
                                        Notes
                                    </label>
                                    <div
                                        className={`${favoritesDropdownTextStyles}`}
                                    >
                                        {fav.notes}
                                    </div>
                                </div>
                                <div
                                    className={`${blankColWidth} bg-blue-100  px-2 overflow-hidden flex`}
                                ></div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FavoriteExercisesDropdown;
