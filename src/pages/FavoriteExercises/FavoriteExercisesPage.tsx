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

export default function FavoriteExercisesPage() {
  const [favoriteExerciseQuery, setFavoriteExerciseQuery] = useState("");
  const [favoriteExercises, setFavoriteExercises] = useState(
    sampleFavoriteExercises
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<FavoriteExercise | null>();
  const [error, setError] = useState("");
  const { user } = useUser();
  const userId = user?.id ?? null;

  const handleEditItemClick = async (index: number) => {
    console.log("clicked favorite exercise with index ", index);
    console.log(
      "user wants to edit favorite exercise: ",
      favoriteExercises[index]
    );
    const favoriteExerciseId = favoriteExercises[index].id;
    const res = await api.get(`/v1/favorite_exercises/${favoriteExerciseId}`);
    console.log(`fetched full sequence with id: ${favoriteExerciseId}`, res);
    setEditItem(res);
    setIsEditModalOpen(true);
  };

  const fetchFavoriteExercises = async () => {
    try {
      const res = await api.get(`/v1/favorite_exercises/user/${userId}`);
      return res;
    } catch (err: any) {
      console.error("Error fetching favorite exercises:", err);
    }
  };

  useEffect(() => {
    const fetchFavoriteExercises = async () => {
      try {
        const res = await api.get(`/v1/favorite_exercises/user/${userId}`);
        console.log("fetched favorite exercises for user: ", res);
        setFavoriteExercises(res);
      } catch (err: any) {
        console.error("Error fetching sequences:", err);
        setError(err.message);
      }
    };
    fetchFavoriteExercises();
  }, [userId]);

  const filteredfavoriteExercises = favoriteExercises.filter(
    (favoriteExercise) =>
      favoriteExercise.name
        .toLowerCase()
        .includes(favoriteExerciseQuery.toLowerCase())
  );

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
        handleEditItemClick={handleEditItemClick}
        setFavoriteExercises={setFavoriteExercises}
        fetchFavoriteExercises={fetchFavoriteExercises}
      />

      {editItem && (
        <FavoriteExerciseEditModal
          isModalOpen={isEditModalOpen}
          setIsModalOpen={setIsEditModalOpen}
          editItem={editItem}
          setFavoriteExercises={setFavoriteExercises}
          fetchFavoriteExercises={fetchFavoriteExercises}
        />
      )}

      {/* CREATE MODAL */}
      <FavoriteExerciseCreateModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        setFavoriteExercises={setFavoriteExercises}
        fetchFavoriteExercises={fetchFavoriteExercises}
      />
    </div>
  );
}

const sampleFavoriteExercise_1: FavoriteExercise = {
  id: "44444444-4444-4444-444444444444",
  user_id: "aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa",
  name: "favorite exercise 1 name",
  direction: "favorite exercise 1 direction",
  duration_secs: 20,
  resistance: "favorite exercise 1 resistance",
  notes:
    "favorite exercise 1 notes favorite exercise 1 notesfavorite exercise 1 notes favorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notesfavorite exercise 1 notes s",
  created_at: "2025-06-13 21:38:17.099782",
};
const sampleFavoriteExercise_2: FavoriteExercise = {
  id: "55555555-5555-5555-555555555555",
  user_id: "aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa",
  name: "favorite exercise 2 name",
  direction: "favorite exercise 2 direction",
  duration_secs: 20,
  resistance: "favorite exercise 2 resistance",
  notes: "favorite exercise 2 notes",
  created_at: "2025-06-23 21:38:17.099782",
};

const sampleFavoriteExercises = [
  sampleFavoriteExercise_1,
  sampleFavoriteExercise_2,
];
