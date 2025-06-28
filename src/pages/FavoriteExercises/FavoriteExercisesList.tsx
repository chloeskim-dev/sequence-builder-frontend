import { FavoriteExercise } from "../../constants/types";
import { SetStateAction, useState } from "react";
import Modal from "../../components/layouts/Modal";
import { api } from "../../utils/api";

type FavoriteExercisesListProps = {
  favoriteExercises: FavoriteExercise[];
  handleEditItemClick: (index: number) => void;
  setFavoriteExercises: React.Dispatch<SetStateAction<FavoriteExercise[]>>;
  fetchFavoriteExercises: () => Promise<any>;
};

export default function FavoriteExercisesList({
  favoriteExercises,
  handleEditItemClick,
  setFavoriteExercises,
  fetchFavoriteExercises,
}: FavoriteExercisesListProps) {
  return (
    <div className="border border-black mx-4 my-2">
      <div className="hidden md:flex bg-gray-200 p-2 font-bold text-xs">
        <div className="flex-[2] px-2">Name</div>
        <div className="flex-1 px-2">Direction</div>
        <div className="flex-1 px-2">Duration</div>
        <div className="flex-1 px-2">Resistance</div>
        <div className="flex-[2] px-2">Notes</div>
        <div className="w-[133px] px-2">Actions</div>
      </div>

      {favoriteExercises.map((favoriteExercise, i) => (
        <FavoriteExerciseRow
          index={i}
          exercise={favoriteExercise}
          handleEditItemClick={handleEditItemClick}
          setFavoriteExercises={setFavoriteExercises}
          fetchFavoriteExercises={fetchFavoriteExercises}
        />
      ))}
    </div>
  );
}

type FavoriteExerciseRowProps = {
  exercise: FavoriteExercise;
  handleEditItemClick: (index: number) => void;
  index: number;
  setFavoriteExercises: React.Dispatch<SetStateAction<FavoriteExercise[]>>;
  fetchFavoriteExercises: () => Promise<any>;
};
function FavoriteExerciseRow({
  exercise,
  handleEditItemClick,
  index,
  setFavoriteExercises,
  fetchFavoriteExercises,
}: FavoriteExerciseRowProps) {
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);

  const handleDeleteItemClick = async (exerciseId: string) => {
    console.log("user wants to delete exercise with id ", exerciseId);
    setIsDeleteConfirmModalOpen(true);
  };

  const deleteItem = async (exerciseId: string) => {
    const res = await api.delete(`/v1/favorite_exercises/${exerciseId}`);
    console.log(`deleted full sequence with id: ${exerciseId}`, res);
    let updatedFavoriteExercises = fetchFavoriteExercises();
    setFavoriteExercises(await updatedFavoriteExercises);
    setIsDeleteConfirmModalOpen(false);
  };

  const _rowContainerStyles =
    "border-t border-black flex flex-col items-start md:flex-row  md:gap-4 p-2";
  const _fieldsContainerStyles =
    "flex flex-col md:flex-row md:flex-wrap md:items-start gap-2 flex-1";
  const _actionButtonsContainerStyle = "mt-2 md:mt-0";
  const _actionButtonStyles = "text-xs font-bold p-2 border-2 border-black";
  const _labelStyles = "text-xs font-bold md:hidden";
  const _rowTextStyles = "text-xs";

  return (
    <div id="rowContainer" className={_rowContainerStyles}>
      <div id="fieldsContainer" className={_fieldsContainerStyles}>
        <div className="flex-[2] px-2">
          <label className={_labelStyles}>Name*</label>
          <div className={_rowTextStyles}>{exercise.name}</div>
        </div>
        <div className="flex-1 px-2">
          <label className={_labelStyles}>Direction</label>
          <div className={_rowTextStyles}>{exercise.direction}</div>
        </div>
        <div className="flex-1 px-2">
          <label className={_labelStyles}>Duration</label>
          <div className="flex gap-2">
            <div className="flex flex-col">
              <label className="text-[9px] font-medium">min</label>
              <div className={_rowTextStyles}>{exercise.duration_secs}</div>
            </div>
            <div className="text-xs self-end pb-0">:</div>
            <div className="flex flex-col">
              <label className="text-[9px] font-medium">sec</label>
              <div className={_rowTextStyles}>{exercise.duration_secs}</div>
            </div>
          </div>
        </div>
        <div className="flex-1 px-2">
          <label className={_labelStyles}>Resistance</label>
          <div className={_rowTextStyles}>{exercise.resistance}</div>
        </div>
        <div className="flex-[2] px-2">
          <label className={_labelStyles}>Notes</label>
          <div className={_rowTextStyles}>{exercise.notes}</div>
        </div>
      </div>

      <div id="actionButtonsContainer" className={_actionButtonsContainerStyle}>
        <div className="flex gap-2 justify-center">
          <button
            className={_actionButtonStyles}
            onClick={() => handleEditItemClick(index)}
          >
            Edit
          </button>
          <button
            className={_actionButtonStyles}
            onClick={() => handleDeleteItemClick(exercise.id)}
          >
            Delete
          </button>
        </div>
      </div>

      {isDeleteConfirmModalOpen && (
        <Modal
          isOpen={isDeleteConfirmModalOpen}
          onClose={() => setIsDeleteConfirmModalOpen(false)}
          title={`Delete '${exercise.name}'?`}
          buttons={[
            {
              label: "Cancel",
              onClick: () => setIsDeleteConfirmModalOpen(false),
              variant: "secondary",
            },
            {
              label: "Delete",
              onClick: () => deleteItem(exercise.id),
              variant: "danger",
            },
          ]}
        >
          <div className="text-sm">
            <p>
              Are you sure you want to delete this favorite exercise? This
              action cannot be undone.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
