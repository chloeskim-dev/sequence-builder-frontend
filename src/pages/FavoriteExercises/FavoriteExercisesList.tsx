import { FavoriteExercise } from "../../constants/types";
import { SetStateAction, useState } from "react";
import Modal from "../../components/layouts/Modal";
import { api } from "../../utils/api";
import { splitDuration } from "../../utils/timeHelpers";

type FavoriteExercisesListProps = {
    favoriteExercises: FavoriteExercise[];
    handleViewItemClick: (index: number) => void;
    handleEditItemClick: (index: number) => void;
    handleDeleteItemClick: (index: number) => void;
    setFavoriteExercises: React.Dispatch<SetStateAction<FavoriteExercise[]>>;
    fetchFavoriteExercises: () => Promise<any>;
};
const actionButtonsColumnWidth = "w-[200px]";

export default function FavoriteExercisesList({
    favoriteExercises,
    handleViewItemClick,
    handleEditItemClick,
    handleDeleteItemClick,
    setFavoriteExercises,
    fetchFavoriteExercises,
}: FavoriteExercisesListProps) {
    return (
        <div className="md:border border-gray-300 mx-4 my-2 font-bold text-xs">
            <div className="hidden md:flex flex-row gap-4 bg-gray-200">
                <div className="flex-1 flex flex-row">
                    <div className="flex-[2] p-2">Name</div>
                    <div className="flex-1 p-2">Direction</div>
                    <div className="flex-1 p-2">Duration</div>
                    <div className="flex-1 p-2">Resistance</div>
                    <div className="flex-[2] p-2">Notes</div>
                </div>
                <div>
                    <div className={`${actionButtonsColumnWidth} p-2 pl-0`}>
                        Actions
                    </div>
                </div>
            </div>

            {/* Favorite exercise rows */}
            {favoriteExercises.map((favoriteExercise, i) => (
                <div key={i} className="mb-4 md:mb-0">
                    <FavoriteExerciseRow
                        index={i}
                        exercise={favoriteExercise}
                        setFavoriteExercises={setFavoriteExercises}
                        fetchFavoriteExercises={fetchFavoriteExercises}
                        handleViewItemClick={handleViewItemClick}
                        handleEditItemClick={handleEditItemClick}
                        handleDeleteItemClick={handleDeleteItemClick}
                    />
                </div>
            ))}

            {favoriteExercises && favoriteExercises.length === 0 && (
                <div className="my-2 p-2 font-normal text-gray-400">
                    No favorite exercises have been added.
                </div>
            )}
        </div>
    );
}

type FavoriteExerciseRowProps = {
    index: number;
    exercise: FavoriteExercise;
    handleViewItemClick: (index: number) => void;
    handleEditItemClick: (index: number) => void;
    handleDeleteItemClick: (index: number) => void;
    setFavoriteExercises: React.Dispatch<SetStateAction<FavoriteExercise[]>>;
    fetchFavoriteExercises: () => Promise<any>;
};
function FavoriteExerciseRow({
    index,
    exercise,
    handleEditItemClick,
    handleViewItemClick,
    handleDeleteItemClick,
    setFavoriteExercises,
    fetchFavoriteExercises,
}: FavoriteExerciseRowProps) {
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
        useState(false);

    const rowContainerStyles =
        "flex flex-col md:flex-row  md:gap-4 py-4 p-2 md:p-0 bg-gray-100 md:border-t md:bg-white";

    const fieldsContainerStyles =
        "flex flex-col md:flex-row md:flex-wrap md:items-center gap-2 flex-1 min-w-0 overflow-hidden";
    const singleFieldContainerStyles = "px-2 md:p-2 min-w-0";
    const actionButtonsContainerStyle = `mt-2 md:mt-0 ml-1 md:ml-0 ${actionButtonsColumnWidth}`;
    const actionButtonStyles = "text-xs font-bold p-2 text-white bg-red-500";
    const labelStyles = "font-bold md:hidden text-xs";
    const rowTextStyles = "text-xs flex-1 font-normal truncate";
    const emptyFieldTextStyle = "hidden text-gray-400 md:block";

    return (
        <div id="rowContainer" className={rowContainerStyles}>
            <div id="fieldsContainer" className={fieldsContainerStyles}>
                <div className={`flex-[2] ${singleFieldContainerStyles}`}>
                    <div
                        className={`font-bold md:font-normal uppercase md:normal-case text-base md:text-xs`}
                    >
                        {exercise.name}
                    </div>
                </div>

                <div className={`flex-1 ${singleFieldContainerStyles}`}>
                    {exercise.direction ? (
                        <>
                            <label className={labelStyles}>Direction</label>
                            <div className={rowTextStyles}>
                                {exercise.direction}
                            </div>
                        </>
                    ) : (
                        <div className={emptyFieldTextStyle}>-</div>
                    )}
                </div>

                <div className={`flex-1 ${singleFieldContainerStyles}`}>
                    {exercise.duration_secs !== null &&
                    exercise.duration_secs !== undefined ? ( // ?? returns
                        <>
                            <label className={labelStyles}>Duration</label>
                            <div className="flex gap-2 md:-mt-2">
                                <div className="flex flex-col">
                                    <label className="text-[9px] font-medium">
                                        min
                                    </label>
                                    <div className={rowTextStyles}>
                                        {
                                            splitDuration(
                                                exercise.duration_secs
                                            ).splitMinutes
                                        }
                                    </div>
                                </div>
                                <div className="text-[10px] self-end pb-0">
                                    :
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[9px] font-medium">
                                        sec
                                    </label>
                                    <div className={rowTextStyles}>
                                        {
                                            splitDuration(
                                                exercise.duration_secs
                                            ).splitSeconds
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={emptyFieldTextStyle}>-</div>
                    )}
                </div>

                <div className={`flex-1 ${singleFieldContainerStyles}`}>
                    {exercise.resistance ? (
                        <>
                            <label className={labelStyles}>Resistance</label>
                            <div className={rowTextStyles}>
                                {exercise.resistance}
                            </div>
                        </>
                    ) : (
                        <div className={emptyFieldTextStyle}>-</div>
                    )}
                </div>

                <div className={`flex-[2] ${singleFieldContainerStyles}`}>
                    {exercise.notes ? (
                        <>
                            <label className={labelStyles}>Notes</label>
                            <div className={rowTextStyles}>
                                {exercise.notes}
                            </div>
                        </>
                    ) : (
                        <div className={emptyFieldTextStyle}>-</div>
                    )}
                </div>
            </div>

            <div
                id="actionButtonsContainer"
                className={`${actionButtonsContainerStyle} ${singleFieldContainerStyles}`}
            >
                <div className="flex justify-center">
                    <button
                        className={`${actionButtonStyles} mr-2`}
                        onClick={() => handleViewItemClick(index)}
                    >
                        View Details
                    </button>
                    <button
                        className={`${actionButtonStyles} mr-2`}
                        onClick={() => handleEditItemClick(index)}
                    >
                        Edit
                    </button>
                    <button
                        className={actionButtonStyles}
                        onClick={() => handleDeleteItemClick(index)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
