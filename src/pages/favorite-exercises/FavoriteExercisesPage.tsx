import { useState, useEffect } from "react";
import Searchbar from "../../components/ui/Searchbar";
import { FiPlus } from "react-icons/fi";
import FavoriteExerciseEditModal from "../../components/favorite-exercises/FavoriteExercisesEditModal";
import FavoriteExerciseCreateModal from "../../components/favorite-exercises/FavoriteExercisesCreateModal";
import { IconButton } from "../../components/ui/IconButton";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import FavoriteExerciseDetailModal from "../../components/favorite-exercises/FavoriteExercisesDetailModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { ReusableTable } from "../../components/layouts/ReusableTable";
import {
    createNewButtonStyles,
    pageOutermostFlexColStyles,
} from "../../constants/tailwindClasses";
import {
    filterBySearchQuery,
    removeNullFieldsFromFavoriteExercise,
    removeNullFieldsFromFavoriteExercises,
} from "../../utils/sequenceHelpers";
import {
    CleanedUpFavoriteExercise,
    RawFavoriteExercise,
} from "../../constants/types";

export default function FavoriteExercisesPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [fetchedFavoriteExercises, setFetchedFavoriteExercises] = useState<
        RawFavoriteExercise[] | undefined
    >(undefined);
    const [displayFavoriteExercises, setDisplayFavoriteExercises] = useState<
        CleanedUpFavoriteExercise[] | undefined
    >(undefined);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
        useState<boolean>(false);

    const [detailItem, setDetailItem] =
        useState<CleanedUpFavoriteExercise | null>(null);
    const [editItem, setEditItem] = useState<CleanedUpFavoriteExercise | null>(
        null
    );
    const [deleteItem, setDeleteItem] =
        useState<CleanedUpFavoriteExercise | null>(null);

    const [error, setError] = useState<string>("");
    const { user } = useUser();
    const userId = user?.id ?? null;

    const fetchFavoriteExercises = async () => {
        try {
            const res: RawFavoriteExercise[] = await api.get(
                `/v1/favorite_exercises/user/${userId}`
            );
            setFetchedFavoriteExercises(res);
            return res;
        } catch (err: any) {
            console.error("Error fetching favorite exercises:", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchFavoriteExercises();
    }, []);

    const setFavoriteExercisesToDisplay = async () => {
        if (fetchedFavoriteExercises === undefined) {
            return;
        }
        try {
            const cleanedFavoriteExercises =
                removeNullFieldsFromFavoriteExercises(fetchedFavoriteExercises);
            const cleanedFavoriteExercisesMatchingSearchQuery =
                filterBySearchQuery(cleanedFavoriteExercises, searchQuery);
            setDisplayFavoriteExercises(
                cleanedFavoriteExercisesMatchingSearchQuery
            );
        } catch (err: any) {
            console.error("Error setting sequences to display:", err);
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        setFavoriteExercisesToDisplay();
    }, [searchQuery, fetchedFavoriteExercises]);

    const resetFavoriteExercisesToDisplay = async () => {
        try {
            setSearchQuery("");
            await fetchFavoriteExercises();
            setFavoriteExercisesToDisplay();
        } catch (err: any) {
            console.error(
                "Error refreshing favorite exercises to display:",
                err
            );
            setError(err.message);
            throw err;
        }
    };

    const fetchResultsAreEmpty =
        fetchedFavoriteExercises !== undefined &&
        fetchedFavoriteExercises.length === 0;

    const thereAreNoFavoriteExercisesMatchingQuery =
        fetchedFavoriteExercises !== undefined &&
        fetchedFavoriteExercises.length !== 0 &&
        displayFavoriteExercises !== undefined &&
        displayFavoriteExercises.length === 0;

    const thereAreFavoriteExercisesToDisplay =
        displayFavoriteExercises !== undefined &&
        displayFavoriteExercises.length !== 0;

    const handleViewItemClick = (index: number) => {
        if (!thereAreFavoriteExercisesToDisplay) return;
        setDetailItem(displayFavoriteExercises[index]);
        setIsDetailModalOpen(true);
    };

    const handleEditItemClick = async (index: number) => {
        if (!thereAreFavoriteExercisesToDisplay) return;
        const favoriteExerciseId = displayFavoriteExercises[index].id;
        const fetchedFavoriteExercise = await api.get(
            `/v1/favorite_exercises/${favoriteExerciseId}`
        );
        console.log("!!!!!!!!!!!!!!!!!!!!");
        console.log(fetchedFavoriteExercise.duration_secs);
        setEditItem(
            removeNullFieldsFromFavoriteExercise(fetchedFavoriteExercise)
        );
        setIsEditModalOpen(true);
    };

    const handleDeleteItemClick = async (index: number) => {
        if (!thereAreFavoriteExercisesToDisplay) return;
        setDeleteItem(displayFavoriteExercises[index]);
        setIsDeleteConfirmModalOpen(true);
    };

    const deleteExercise = async (exerciseId: string) => {
        try {
            const res = await api.delete(
                `/v1/favorite_exercises/${exerciseId}`
            );
            setSearchQuery("");
            fetchFavoriteExercises();
            setIsDeleteConfirmModalOpen(false);
        } catch (err: any) {
            setError("Something went wrong.");
        }
    };

    return (
        <div className="">
            <div className={pageOutermostFlexColStyles}>
                <div>
                    <IconButton
                        onClick={() => setIsCreateModalOpen(true)}
                        icon={<FiPlus size={16} />}
                        className={createNewButtonStyles}
                    >
                        Create New
                    </IconButton>
                </div>
                <Searchbar
                    placeholder="Search by name..."
                    query={searchQuery}
                    setQuery={setSearchQuery}
                />
                {thereAreFavoriteExercisesToDisplay && (
                    <div>
                        <ReusableTable
                            items={displayFavoriteExercises}
                            getActionButtonsForItem={(item, index) => [
                                {
                                    title: "View",
                                    action: () => handleViewItemClick(index),
                                },
                                {
                                    title: "Edit",
                                    action: () => handleEditItemClick(index),
                                },
                                {
                                    title: "Delete",
                                    action: () => handleDeleteItemClick(index),
                                },
                            ]}
                            standardFields={[
                                "name",
                                "direction",
                                "duration",
                                "resistance",
                                "notes",
                            ]}
                            actionsFieldWidthStyle="w-[150px]"
                            listType="favorites"
                        />
                    </div>
                )}
                {fetchResultsAreEmpty && (
                    <div>
                        You have not added any favorite exercises. Create a
                        favorite exercise by clicking the button above.
                    </div>
                )}

                {thereAreNoFavoriteExercisesMatchingQuery && (
                    <div>
                        There are no favorite exercises that match your query by
                        name.
                    </div>
                )}
            </div>
            <FavoriteExerciseCreateModal
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
                resetFavoriteExercisesToDisplay={
                    resetFavoriteExercisesToDisplay
                }
            />

            {detailItem && isDetailModalOpen && (
                <FavoriteExerciseDetailModal
                    isModalOpen={isDetailModalOpen}
                    setIsModalOpen={setIsDetailModalOpen}
                    detailItem={detailItem}
                    setDetailItem={setDetailItem}
                />
            )}

            {editItem && isEditModalOpen && (
                <FavoriteExerciseEditModal
                    isModalOpen={isEditModalOpen}
                    setIsModalOpen={setIsEditModalOpen}
                    editItem={editItem}
                    setEditItem={setEditItem}
                    resetFavoriteExercisesToDisplay={
                        resetFavoriteExercisesToDisplay
                    }
                />
            )}

            {deleteItem && isDeleteConfirmModalOpen && (
                <DeleteConfirmModal
                    isModalOpen={isDeleteConfirmModalOpen}
                    setIsModalOpen={setIsDeleteConfirmModalOpen}
                    deleteItem={deleteItem}
                    setDeleteItem={setDeleteItem}
                    onDelete={deleteExercise}
                    title="Delete Favorite Exercise?"
                />
            )}
        </div>
    );
}
