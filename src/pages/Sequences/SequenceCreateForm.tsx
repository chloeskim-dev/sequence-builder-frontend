import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { FiTrash, FiCopy } from "react-icons/fi"; // import icons
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Sequence,
  SequenceFormInputs,
  SequenceRequest,
  ExerciseRequest,
} from "../../constants/types";
import { useState } from "react";

const splitDuration = (secs: number) => ({
  durationMins: Math.floor(secs / 60),
  durationSecs: secs % 60,
});

export const SequenceCreateForm = () => {
  const [showFavoritesDropdown, setShowFavoritesDropdown] = useState(true);
  // Initializes React Hook Form and gets useful helpers to manage the entire form.
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SequenceFormInputs>({
    defaultValues: {
      name: "",
      description: "",
      notes: "",
      exercises: [],
    },
  });

  // Dummy favorites list for example (you will get this from props or API)
  const favoriteExercises = [
    {
      id: "1",
      name: "Push Ups",
      direction: "forward",
      resistance: "bodyweight",
      notes: "",
      durationMins: 0,
      durationSecs: 30,
    },
    {
      id: "2",
      name: "Squats",
      direction: "down",
      resistance: "bodyweight",
      notes: "",
      durationMins: 0,
      durationSecs: 45,
    },
  ];

  const handleAddFavoriteExercise = (
    favExercise: (typeof favoriteExercises)[0]
  ) => {
    append({
      name: favExercise.name,
      direction: favExercise.direction,
      durationMins: Math.floor(favExercise.durationSecs / 60),
      durationSecs: favExercise.durationSecs % 60,
      resistance: favExercise.resistance,
      notes: favExercise.notes,
    });
    setShowFavoritesDropdown(false);
  };

  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name: "exercises",
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const onSubmit: SubmitHandler<SequenceFormInputs> = (data) => {
    const exerciseRequests: ExerciseRequest[] = data.exercises.map(
      (exercise, index) => ({
        name: exercise.name,
        direction: exercise.direction,
        resistance: exercise.resistance,
        notes: exercise.notes,
        order_index: index,
        duration_secs:
          // combine to total secs again, using 0 for empty inputs
          (exercise.durationMins || 0) * 60 + (exercise.durationSecs || 0),
      })
    );

    const payload: SequenceRequest = {
      name: data.name,
      description: data.description,
      notes: data.notes,
      exercises: exerciseRequests,
    };

    console.log("API payload:", payload);

    // send edit request to server
  };

  const duplicateExercise = (index: number) => {
    const current = getValues("exercises")[index];
    insert(index + 1, current);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* =================== Sequence Info =================== */}
      <div>
        {/* --- Sequence Name --- */}
        <label className="block font-bold mb-1">Name</label>
        <input
          {...register("name", { required: true })}
          className="border p-2 w-full"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">This field is required</span>
        )}
      </div>
      {/* --- Sequence Description --- */}
      <div>
        <label className="block font-bold mb-1">Description</label>
        <input {...register("description")} className="border p-2 w-full" />
      </div>
      {/* --- Sequence Notes --- */}
      <div>
        <label className="block font-bold mb-1">Notes</label>
        <textarea
          {...register("notes")}
          rows={4}
          className="border p-2 w-full"
        ></textarea>
      </div>

      {/* =================== Exercises DnD Section =================== */}
      <div>
        <h3 className="text-lg font-bold mb-2">Exercises</h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="exercises">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {fields.map((field, index) => (
                  <Draggable
                    key={field.id}
                    draggableId={field.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border p-4 rounded bg-gray-50"
                      >
                        {/* ====== Exercise DnD Row ====== */}
                        <div className="flex flex-wrap gap-4 items-start">
                          {/* --- Exercise Name --- */}
                          <div className="flex flex-col flex-1 min-w-[200px]">
                            <label className="text-xs font-bold">Name</label>
                            <input
                              {...register(`exercises.${index}.name`, {
                                required: true,
                              })}
                              className="border p-1 w-full"
                            />
                            {errors.exercises?.[index]?.name && (
                              <span className="text-red-500 text-xs mt-1">
                                This field is required
                              </span>
                            )}
                          </div>

                          {/* --- Exercise Direction --- */}
                          <div className="flex flex-col w-48">
                            <label className="text-xs font-bold">
                              Direction
                            </label>
                            <input
                              {...register(`exercises.${index}.direction`)}
                              className="border p-1 w-full"
                            />
                          </div>

                          {/* --- Exercise Duration --- */}
                          <div className="flex flex-col w-48">
                            <label className="text-xs font-bold mb-1">
                              Duration
                            </label>
                            <div className="flex items-center gap-1">
                              {/* --- Duration min --- */}
                              <input
                                type="number"
                                min="0"
                                {...register(
                                  `exercises.${index}.durationMins`,
                                  {
                                    valueAsNumber: true,
                                  }
                                )}
                                placeholder="min"
                                className="border p-1 w-16"
                              />
                              <span className="text-xs px-1">min</span>
                              {/* --- Duration sec --- */}
                              <input
                                type="number"
                                min="0"
                                {...register(
                                  `exercises.${index}.durationSecs`,
                                  {
                                    valueAsNumber: true,
                                  }
                                )}
                                placeholder="sec"
                                className="border p-1 w-16"
                              />
                              <span className="text-xs px-1">sec</span>
                            </div>
                          </div>

                          {/* --- Exercise Resistance --- */}
                          <div className="flex flex-col w-32">
                            <label className="text-xs font-bold">
                              Resistance
                            </label>
                            <input
                              {...register(`exercises.${index}.resistance`)}
                              className="border p-1 w-full"
                            />
                          </div>

                          {/* --- Exercise Notes --- */}
                          <div className="flex flex-col flex-1">
                            <label className="text-xs font-bold">Notes</label>
                            <input
                              {...register(`exercises.${index}.notes`)}
                              className="border p-1 w-full"
                            />
                          </div>

                          {/* --- Exercise Action Buttons --- */}
                          <div className="flex self-center items-center gap-2 ml-2">
                            {/* --- Duplicate button --- */}
                            <button
                              type="button"
                              onClick={() => duplicateExercise(index)}
                              className="text-green-600 hover:text-green-800"
                              title="Duplicate"
                            >
                              <FiCopy size={18} />
                            </button>
                            {/* --- Remove button --- */}
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-800"
                              title="Remove"
                            >
                              <FiTrash size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex my-2 gap-2">
          <button
            type="button"
            onClick={() =>
              append({
                name: "",
                direction: "",
                durationMins: 0,
                durationSecs: 0,
                resistance: "",
                notes: "",
              })
            }
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add A New Exercise
          </button>

          {/* Add From Favorite Exercises Button */}

          <button
            type="button"
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            onClick={() => setShowFavoritesDropdown(!showFavoritesDropdown)}
          >
            Add From Favorite Exercises
          </button>
        </div>
      </div>

      {showFavoritesDropdown && (
        <div>
          <h3 className="text-lg font-bold mb-2">Add A Favorite Exercise</h3>
          <div className="w-full max-h-96 overflow-y-auto bg-white rounded shadow-lg z-10">
            {favoriteExercises.length === 0 && (
              <div className="p-3 text-gray-500">
                No favorite exercises found.
              </div>
            )}
            {favoriteExercises.map((fav) => (
              <button
                key={fav.id}
                type="button"
                className="block w-full text-left mb-4 border rounded p-4 hover:bg-yellow-50"
                onClick={() => handleAddFavoriteExercise(fav)}
              >
                <div className="flex flex-wrap gap-4 items-start">
                  {/* --- Name --- */}
                  <div className="flex flex-col flex-1 min-w-[200px]">
                    <label className="text-xs font-bold">Name</label>
                    <div className="border p-1 bg-gray-50">{fav.name}</div>
                  </div>

                  {/* --- Direction --- */}
                  <div className="flex flex-col w-48">
                    <label className="text-xs font-bold">Direction</label>
                    <div className="border p-1 bg-gray-50">
                      {fav.direction || "-"}
                    </div>
                  </div>

                  {/* --- Duration --- */}
                  <div className="flex flex-col w-48">
                    <label className="text-xs font-bold mb-1">Duration</label>
                    <div className="flex items-center gap-1 border p-1 bg-gray-50">
                      <span>{Math.floor(fav.durationSecs / 60)}</span>
                      <span className="text-xs px-1">min</span>
                      <span>{fav.durationSecs % 60}</span>
                      <span className="text-xs px-1">sec</span>
                    </div>
                  </div>

                  {/* --- Resistance --- */}
                  <div className="flex flex-col w-32">
                    <label className="text-xs font-bold">Resistance</label>
                    <div className="border p-1 bg-gray-50">
                      {fav.resistance || "-"}
                    </div>
                  </div>

                  {/* --- Notes --- */}
                  <div className="flex flex-col flex-1">
                    <label className="text-xs font-bold">Notes</label>
                    <div className="border p-1 bg-gray-50">
                      {fav.notes || "-"}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default SequenceCreateForm;
