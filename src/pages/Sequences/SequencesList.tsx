import { useState } from "react";
import { FavoriteExercise, Sequence } from "../../constants/types";
import { FiEdit, FiTrash } from "react-icons/fi";
import { formatUtcToLocalTrimmed } from "../../utils/dateHelpers";

type Props = {
  // savedSequence: FavoriteExercise[];
  // setsavedSequence: React.Dispatch<React.SetStateAction<FavoriteExercise[]>>;
  // setEditItem: React.Dispatch<React.SetStateAction<FavoriteExercise>>;
  handleEditItemClick: (index: number) => void;
  sequences: Sequence[];
};

export const SequencesList = ({
  // favoriteExercises,
  // setFavoriteExercises,
  // setEditItem,
  handleEditItemClick,
  sequences,
}: Props) => {
  const handleDeleteButtonClick = (id: string) => {
    console.log(id);
    // send request to delete favorite exercise by id
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Name</th>
            <th className="text-left px-4 py-2">Description</th>
            <th className="text-left px-4 py-2">Notes</th>
            <th className="text-left px-4 py-2">Created</th>
            <th className="text-left px-4 py-2">Updated</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sequences &&
            sequences.map((sequence, index) => (
              <tr key={sequence.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{sequence.name}</td>
                <td className="px-4 py-2">{sequence.description}</td>
                <td className="px-4 py-2">{sequence.notes}</td>
                <td className="px-4 py-2">
                  {formatUtcToLocalTrimmed(sequence.createdAt)}
                </td>
                <td className="px-4 py-2">
                  {formatUtcToLocalTrimmed(sequence.updatedAt)}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEditItemClick(index)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteButtonClick(sequence.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FiTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default SequencesList;

// let favorite_exercise_1: FavoriteExercise = {
//   id: "44444444-4444-4444-444444444444",
//   name: "favorite exercise 1 name",
//   direction: "favorite exercise 1 direction",
//   duration_secs: 20,
//   resistance: "favorite exercise 1 resistance",
//   notes: "favorite exercise 1 notes",
//   created_at: "2025-06-13 21:38:17.099782",
// };
