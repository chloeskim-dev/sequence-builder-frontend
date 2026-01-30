import { useState, useEffect } from "react";
import Searchbar from "../../components/ui/Searchbar";
import FavoriteExerciseEditModal from "../../components/favorite-exercises/FavoriteExercisesEditModal";
import FavoriteExerciseCreateModal from "../../components/favorite-exercises/FavoriteExercisesCreateModal";
import { useUser } from "../../contexts/UserContext";
import FavoriteExerciseDetailModal from "../../components/favorite-exercises/FavoriteExercisesDetailModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { CompactTable } from "../../components/layouts/CompactTable";
import { infoTextStyles } from "../../constants/tailwindClasses";
import {
  favoriteExercisesTableGridColStyles,
  pageOutermostFlexColStyles,
} from "../../constants/tailwindClasses";
import { removeNullFieldsFromFavoriteExercise } from "../../utils/cleanupHelpers";
import { CleanedUpFavoriteExercise } from "../../constants/types";
import { SortDirection } from "../../utils/listHelpers";
import { useFavoriteExercises } from "../../hooks/useFavoriteExercises";
import Button from "../../components/ui/Button/Button";

export const FavoriteExercisesPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [createModalIsOpen, setCreateModalIsOpen] = useState<boolean>(false);
  const [detailModalIsOpen, setDetailModalIsOpen] = useState<boolean>(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const [deleteModalIsOpen, setDeleteConfirmModalIsOpen] =
    useState<boolean>(false);

  const [itemToDetail, setItemToDetail] =
    useState<CleanedUpFavoriteExercise | null>(null);
  const [itemToEdit, setItemToEdit] =
    useState<CleanedUpFavoriteExercise | null>(null);
  const [itemToDelete, setItemToDelete] =
    useState<CleanedUpFavoriteExercise | null>(null);

  const { user } = useUser();
  const userId = user?.id ?? null;

  const {
    // fetch
    fetchFavoriteExercise,
    fetchFavoriteExercises,
    fetchedFavoriteExercises,
    // display
    displayFavoriteExercises,
    setFavoriteExercisesToDisplay,
    // delete
    deleteFavoriteExercise,
    // error
    setError,
  } = useFavoriteExercises(userId!);

  useEffect(() => {
    if (!userId) return;
    fetchFavoriteExercises();
  }, [userId, fetchFavoriteExercises]);

  useEffect(() => {
    setFavoriteExercisesToDisplay(sortBy, sortDirection, searchQuery);
  }, [
    sortBy,
    sortDirection,
    searchQuery,
    fetchedFavoriteExercises,
    setFavoriteExercisesToDisplay,
  ]);

  const resetFavoriteExercisesToDisplay = async () => {
    try {
      setSearchQuery("");
      setSortBy("name");
      setSortDirection("asc");
      await fetchFavoriteExercises();
      setFavoriteExercisesToDisplay(sortBy, sortDirection, searchQuery);
    } catch (err: any) {
      console.error("Error refreshing favorite exercises to display:", err);
      setError(err.message);
    }
  };

  // convenience booleans

  const userHasNoFavoriteExercises =
    fetchedFavoriteExercises !== undefined &&
    fetchedFavoriteExercises.length === 0;

  const userHasFavoriteExercisesButNoneMatchQuery =
    fetchedFavoriteExercises !== undefined &&
    fetchedFavoriteExercises.length !== 0 &&
    displayFavoriteExercises !== undefined &&
    displayFavoriteExercises.length === 0;

  const thereAreFavoriteExercisesToDisplay =
    displayFavoriteExercises !== undefined &&
    displayFavoriteExercises.length !== 0;

  // info and error texts

  const userHasNoFavoriteExercisesInfoText =
    "There are no favorite exercises in your collection currently.";
  const userHasFavoriteExercisesButNoneMatchQueryInfoText =
    "There are no favorite exercises in your collection that match your search.";

  // action button click handlers

  const handleViewItemClick = (index: number) => {
    if (!thereAreFavoriteExercisesToDisplay) return;
    setItemToDetail(displayFavoriteExercises[index]);
    setDetailModalIsOpen(true);
  };

  const handleEditItemClick = async (index: number) => {
    if (!thereAreFavoriteExercisesToDisplay) return;
    const exerciseId = displayFavoriteExercises[index].id;
    const fetchedFavoriteExercise = await fetchFavoriteExercise(exerciseId);

    setItemToEdit(
      removeNullFieldsFromFavoriteExercise(fetchedFavoriteExercise),
    );
    setEditModalIsOpen(true);
  };

  const handleDeleteItemClick = async (index: number) => {
    if (!thereAreFavoriteExercisesToDisplay) return;
    setItemToDelete(displayFavoriteExercises[index]);
    setDeleteConfirmModalIsOpen(true);
  };

  const deleteUponConfirmation = async () => {
    if (!itemToDelete) return;
    deleteFavoriteExercise(itemToDelete.id, () => {
      setSearchQuery("");
      setDeleteConfirmModalIsOpen(false);
    });
  };

  // unique action button creator for favorite exercises
  const getActionButtonsForFavoriteExercise = (_item: any, index: number) => [
    <Button
      buttonType="compact"
      text="view"
      onClick={() => handleViewItemClick(index)}
    />,
    <Button
      buttonType="compact"
      text="edit"
      onClick={() => handleEditItemClick(index)}
    />,
    <Button
      buttonType="compact"
      text="del"
      onClick={() => handleDeleteItemClick(index)}
    />,
  ];

  return (
    <div>
      <div className={pageOutermostFlexColStyles}>
        <div
          className={`flex flex-col gap-5 justify-between items-center w-full px-2`}
        >
          {/* Create New Button */}
          <Button
            className="-mt-[10px]"
            onClick={() => setCreateModalIsOpen(true)}
            text="Create New"
            buttonType="standard"
          />
        </div>

        {/* Searchbar */}
        <Searchbar
          placeholder="Search by name..."
          query={searchQuery}
          setQuery={setSearchQuery}
        />

        {/* Favorite Exercises Table */}
        {thereAreFavoriteExercisesToDisplay && (
          <CompactTable
            items={displayFavoriteExercises}
            getActionButtonsForItem={getActionButtonsForFavoriteExercise}
            standardFields={[
              "name",
              "direction",
              "duration",
              "resistance",
              "notes",
            ]}
            listType="favorites"
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            gridColStyles={favoriteExercisesTableGridColStyles}
          />
        )}

        {/* No Favorite Exercises Added Message */}
        {userHasNoFavoriteExercises && (
          <div className={`${infoTextStyles}`}>
            {userHasNoFavoriteExercisesInfoText}
          </div>
        )}

        {/* No Favorite Exercises Matching Query Message */}
        {userHasFavoriteExercisesButNoneMatchQuery && (
          <div className={`${infoTextStyles}`}>
            {userHasFavoriteExercisesButNoneMatchQueryInfoText}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <FavoriteExerciseCreateModal
        isModalOpen={createModalIsOpen}
        setIsModalOpen={setCreateModalIsOpen}
        resetFavoriteExercisesToDisplay={resetFavoriteExercisesToDisplay}
      />

      {/* Detail Modal */}
      {itemToDetail && detailModalIsOpen && (
        <FavoriteExerciseDetailModal
          isModalOpen={detailModalIsOpen}
          setIsModalOpen={setDetailModalIsOpen}
          detailItem={itemToDetail}
          setDetailItem={setItemToDetail}
        />
      )}

      {/* Edit Modal */}
      {itemToEdit && editModalIsOpen && (
        <FavoriteExerciseEditModal
          isModalOpen={editModalIsOpen}
          setIsModalOpen={setEditModalIsOpen}
          editItem={itemToEdit}
          setEditItem={setItemToEdit}
          resetFavoriteExercisesToDisplay={resetFavoriteExercisesToDisplay}
        />
      )}

      {/* Delete Modal */}
      {itemToDelete && deleteModalIsOpen && (
        <DeleteConfirmModal
          isModalOpen={deleteModalIsOpen}
          setIsModalOpen={setDeleteConfirmModalIsOpen}
          deleteItem={itemToDelete}
          setDeleteItem={setItemToDelete}
          onDelete={deleteUponConfirmation}
          title="Delete Favorite Exercise?"
        />
      )}
    </div>
  );
};

export default FavoriteExercisesPage;
