import { FiEdit, FiTrash } from "react-icons/fi";
import { FavoriteExercise } from "../../constants/types";
import { formatUtcToLocalTrimmed } from "../../utils/dateHelpers";

type Props = {
  favoriteExercises: FavoriteExercise[];
  handleEditItemClick: (index: number) => void;
};

export const FavoriteExercisesList = ({
  favoriteExercises,
  handleEditItemClick,
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
            <th className="text-left px-4 py-2">Direction</th>
            <th className="text-left px-4 py-2">Duration</th>
            <th className="text-left px-4 py-2">Resistance</th>
            <th className="text-left px-4 py-2">Notes</th>
            <th className="text-left px-4 py-2">Created</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {favoriteExercises.map((favoriteExercise, index) => (
            <tr key={favoriteExercise.id} className="border-t border-gray-200">
              <td className="px-4 py-2">{favoriteExercise.name}</td>
              <td className="px-4 py-2">{favoriteExercise.direction}</td>
              <td className="px-4 py-2">{favoriteExercise.duration_secs}</td>
              <td className="px-4 py-2">{favoriteExercise.resistance}</td>
              <td className="px-4 py-2">{favoriteExercise.notes}</td>
              <td className="px-4 py-2">
                {formatUtcToLocalTrimmed(favoriteExercise.created_at)}
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
                  onClick={() => handleDeleteButtonClick(favoriteExercise.id)}
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

export default FavoriteExercisesList;

// let favorite_exercise_1: FavoriteExercise = {
//   id: "44444444-4444-4444-444444444444",
//   name: "favorite exercise 1 name",
//   direction: "favorite exercise 1 direction",
//   duration_secs: 20,
//   resistance: "favorite exercise 1 resistance",
//   notes: "favorite exercise 1 notes",
//   created_at: "2025-06-13 21:38:17.099782",
// };
