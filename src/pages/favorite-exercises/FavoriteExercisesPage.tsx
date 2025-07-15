import { useState, useEffect } from "react";
import Searchbar from "../../components/ui/Searchbar";
import { FiPlus } from "react-icons/fi";
import { FavoriteExercise } from "../../constants/types";
import FavoriteExerciseEditModal from "../../components/favorite-exercises/FavoriteExercisesEditModal";
import FavoriteExerciseCreateModal from "../../components/favorite-exercises/FavoriteExercisesCreateModal";
import { IconButton } from "../../components/ui/IconButton";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import FavoriteExerciseDetailModal from "../../components/favorite-exercises/FavoriteExercisesDetailModal";
import FavoriteExercisesDeleteConfirmModal from "../../components/favorite-exercises/FavoriteExercisesDeleteConfirmModal";
import { ReusableTable } from "../../components/layouts/ReusableTable";
import { pageOutermostFlexColStyles } from "../../constants/tailwindClasses";

export default function FavoriteExercisesPage() {
    const [favoriteExerciseQuery, setFavoriteExerciseQuery] =
        useState<string>("");
    const [favoriteExercises, setFavoriteExercises] = useState<
        FavoriteExercise[]
    >([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
        useState<boolean>(false);
    const [detailItem, setDetailItem] = useState<FavoriteExercise | null>(null);
    const [editItem, setEditItem] = useState<FavoriteExercise | null>(null);
    const [deleteItem, setDeleteItem] = useState<FavoriteExercise | null>(null);
    const [error, setError] = useState<string>("");
    const { user } = useUser();
    const userId = user?.id ?? null;

    const fetchFavoriteExercises = async () => {
        try {
            const res = await api.get(`/v1/favorite_exercises/user/${userId}`);
            return res;
        } catch (err: any) {
            console.error("Error fetching favorite exercises:", err);
            throw err;
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            try {
                const res = await fetchFavoriteExercises();
                setFavoriteExercises(res);
            } catch (err: any) {
                console.error("Error initializing favorite exercises:", err);
                setError(err.message);
            }
        };
        initializeData();
    }, [userId]);

    const filteredfavoriteExercises = favoriteExercises.filter(
        (favoriteExercise) =>
            favoriteExercise.name
                .toLowerCase()
                .includes(favoriteExerciseQuery.toLowerCase())
    );

    const handleViewItemClick = (index: number) => {
        setDetailItem(favoriteExercises[index]);
        setIsDetailModalOpen(true);
    };

    const handleEditItemClick = async (index: number) => {
        const favoriteExerciseId = favoriteExercises[index].id;
        const res = await api.get(
            `/v1/favorite_exercises/${favoriteExerciseId}`
        );
        setEditItem(res);
        setIsEditModalOpen(true);
    };

    const deleteExercise = async (exerciseId: string) => {
        const res = await api.delete(`/v1/favorite_exercises/${exerciseId}`);
        console.log(`deleted full sequence with id: ${exerciseId}`, res);
        let updatedFavoriteExercises = fetchFavoriteExercises();
        setFavoriteExercises(await updatedFavoriteExercises);
        setIsDeleteConfirmModalOpen(false);
    };

    const handleDeleteItemClick = async (index: number) => {
        setDeleteItem(favoriteExercises[index]);
        setIsDeleteConfirmModalOpen(true);
    };

    return (
        <div>
            <div className={pageOutermostFlexColStyles}>
                <div>
                    <IconButton
                        onClick={() => setIsCreateModalOpen(true)}
                        icon={<FiPlus size={14} />}
                        className="bg-green-600 rounded-lg text-lg font-extrabold"
                    >
                        Create New
                    </IconButton>
                </div>
                <Searchbar
                    placeholder="Search by name..."
                    query={favoriteExerciseQuery}
                    setQuery={setFavoriteExerciseQuery}
                />
                <div>
                    <ReusableTable
                        items={filteredfavoriteExercises}
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
                    />
                </div>
            </div>
            <FavoriteExerciseCreateModal
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
                setFavoriteExercises={setFavoriteExercises}
                fetchFavoriteExercises={fetchFavoriteExercises}
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
                    setFavoriteExercises={setFavoriteExercises}
                    fetchFavoriteExercises={fetchFavoriteExercises}
                />
            )}

            {deleteItem && isDeleteConfirmModalOpen && (
                <FavoriteExercisesDeleteConfirmModal
                    isModalOpen={isDeleteConfirmModalOpen}
                    setIsModalOpen={setIsCreateModalOpen}
                    deleteItem={deleteItem}
                    setDeleteItem={setDeleteItem}
                    deleteExercise={deleteExercise}
                />
            )}
        </div>
    );
}
