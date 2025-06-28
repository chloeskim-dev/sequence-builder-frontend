import { useState, useEffect } from "react";
import CenteredPageLayout from "../../components/layouts/CenteredPageLayout";
import FavoriteExercisesSearchbar from "./FavoriteExercisesPageSearchbar";
import { FavoriteExercise } from "../../constants/types";
import FavoriteExercisesList from "./FavoriteExercisesList";
import Modal from "../../components/layouts/Modal";
import { FavoriteExercisesEditForm } from "./FavoriteExercisesEditForm";
import { FavoriteExercisesCreateForm } from "./FavoriteExercisesCreateForm";
import { FiHeart, FiPlus } from "react-icons/fi";

const sampleFavoriteExercise_1: FavoriteExercise = {
  id: "44444444-4444-4444-444444444444",
  user_id: "aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa",
  name: "favorite exercise 1 name",
  direction: "favorite exercise 1 direction",
  duration_secs: 20,
  resistance: "favorite exercise 1 resistance",
  notes: "favorite exercise 1 notes",
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

export const FavoriteExercisesPage = () => {
  const [favoriteExerciseQuery, setFavoriteExerciseQuery] = useState("");
  const [favoriteExercises, setFavoriteExercises] = useState(
    sampleFavoriteExercises
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(sampleFavoriteExercise_1);

  const handleEditItemClick = (index: number) => {
    setEditItem(favoriteExercises[index]);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    // fetch user favorite exercises
  }, []);

  const filteredfavoriteExercises = favoriteExercises.filter(
    (favoriteExercise) =>
      favoriteExercise.name
        .toLowerCase()
        .includes(favoriteExerciseQuery.toLowerCase())
  );
  return (
    <CenteredPageLayout title="Favorite Exercises" icon={<FiHeart size={18} />}>
      <div className="max-w-md mx-auto my-4 px-4 space-y-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          <FiPlus size={18} />
          Create New
        </button>
        <div className="w-full">
          <FavoriteExercisesSearchbar
            favoriteExerciseQuery={favoriteExerciseQuery}
            setFavoriteExerciseQuery={setFavoriteExerciseQuery}
          />
        </div>
      </div>

      <FavoriteExercisesList
        favoriteExercises={filteredfavoriteExercises}
        handleEditItemClick={handleEditItemClick}
      />

      {/* Edit modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit your favorite exercise.</h2>
        <div className="text-gray-600">
          <FavoriteExercisesEditForm editItem={editItem} />
        </div>
      </Modal>

      {/* Create modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <h2 className="text-xl font-bold mb-4">
          Create a new favorite exercise.
        </h2>
        <div className="text-gray-600">
          <FavoriteExercisesCreateForm />
        </div>
      </Modal>
    </CenteredPageLayout>
  );
};

export default FavoriteExercisesPage;
