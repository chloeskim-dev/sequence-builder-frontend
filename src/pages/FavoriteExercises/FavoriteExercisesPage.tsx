import { useState, useEffect } from "react";
import Searchbar from "../../components/ui/Searchbar";
import { FiPlus } from "react-icons/fi";
import { FavoriteExercise } from "../../constants/types";
import FavoriteExerciseEditModal from "../FavoriteExercises/FavoriteExercisesEditModal";
import FavoriteExerciseCreateModal from "../FavoriteExercises/FavoriteExercisesCreateModal";
import { IconButton } from "../../components/ui/IconButton";
import FavoriteExercisesList from "./FavoriteExercisesList";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import FavoriteExerciseDetailModal from "./FavoriteExercisesDetailModal";
import Modal from "../../components/layouts/Modal";
import FavoriteExercisesDeleteConfirmModal from "./FavoriteExercisesDeleteConfirmModal";

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
            <div id="favoriteExercisesListHeader" className="mx-4">
                <div>
                    <text className="font-bold">My favorite exercises</text>
                </div>
                <div className="mb-2 mt-1">
                    <IconButton
                        onClick={() => setIsCreateModalOpen(true)}
                        icon={<FiPlus size={14} />}
                        className="bg-green-600"
                    >
                        Add new
                    </IconButton>
                </div>
                <div className="w-full">
                    <Searchbar
                        placeholder="Search by name..."
                        query={favoriteExerciseQuery}
                        setQuery={setFavoriteExerciseQuery}
                    />
                </div>
            </div>

            <FavoriteExercisesList
                favoriteExercises={filteredfavoriteExercises}
                handleViewItemClick={handleViewItemClick}
                handleEditItemClick={handleEditItemClick}
                handleDeleteItemClick={handleDeleteItemClick}
                setFavoriteExercises={setFavoriteExercises}
                fetchFavoriteExercises={fetchFavoriteExercises}
            />

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

// const sampleFavoriteExercise_1: FavoriteExercise = {
//     id: "44444444-4444-4444-444444444444",
//     user_id: "aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa",
//     name: "favorite exercise 1 name",
//     direction: "favorite exercise 1 direction",
//     duration_secs: 20,
//     resistance: "favorite exercise 1 resistance",
//     notes: "favorite exercise 1 notes favorite exercise 1 notesfavorite exercise 1 notes favorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notes s",
//     created_at: "2025-06-13 21:38:17.099782",
// };
// const sampleFavoriteExercise_2: FavoriteExercise = {
//     id: "55555555-5555-5555-555555555555",
//     user_id: "aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa",
//     name: "favorite exercise 2 name",
//     direction: "favorite exercise 2 direction",
//     duration_secs: 20,
//     resistance: "favorite exercise 2 resistance",
//     notes: "favorite exercise 2 notes",
//     created_at: "2025-06-23 21:38:17.099782",
// };

// const sampleFavoriteExercises = [
//     sampleFavoriteExercise_1,
//     sampleFavoriteExercise_2,
// ];
