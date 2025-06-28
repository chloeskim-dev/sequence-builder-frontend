import { useForm, SubmitHandler } from "react-hook-form";
import {
  FavoriteExercise,
  FavoriteExerciseFormInputs,
  FavoriteExerciseRequest,
} from "../../constants/types";

type Props = {
  editItem: FavoriteExercise;
};

const splitDuration = (combinedSecs: number) => {
  return {
    splitMinutes: Math.floor(combinedSecs / 60),
    splitSeconds: combinedSecs % 60,
  };
};

const combineDuration = (splitMinutes: number, splitSeconds: number) => {
  return splitMinutes * 60 + splitSeconds;
};

export const FavoriteExercisesEditForm = ({ editItem }: Props) => {
  const { splitMinutes, splitSeconds } = splitDuration(editItem.duration_secs);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FavoriteExerciseFormInputs>({
    defaultValues: {
      name: editItem.name,
      direction: editItem.direction,
      durationMinutes: splitMinutes,
      durationSeconds: splitSeconds,
      resistance: editItem.resistance,
      notes: editItem.notes,
    },
  });

  const onSubmit: SubmitHandler<FavoriteExerciseFormInputs> = (data) => {
    const combinedDurationSecs = combineDuration(
      data.durationMinutes,
      data.durationSeconds
    );

    const payload: FavoriteExerciseRequest = {
      name: data.name,
      direction: data.direction,
      duration_secs: combinedDurationSecs,
      resistance: data.resistance,
      notes: data.notes,
    };

    console.log("API payload:", payload);
    // e.g. send to server here
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          {...register("name", { required: true })}
          className="border p-2 w-full"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">This field is required</span>
        )}
      </div>

      <div>
        <label htmlFor="direction" className="block font-medium mb-1">
          Direction
        </label>
        <input
          id="direction"
          {...register("direction")}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <span className="block font-medium mb-1">Duration</span>
        <div className="flex items-end gap-4">
          <div>
            <label htmlFor="durationMinutes" className="block text-sm mb-1">
              Minutes
            </label>
            <input
              id="durationMinutes"
              type="number"
              min="0"
              {...register("durationMinutes", { valueAsNumber: true })}
              className="border p-2 w-24"
            />
          </div>
          <div>
            <label htmlFor="durationSeconds" className="block text-sm mb-1">
              Seconds
            </label>
            <input
              id="durationSeconds"
              type="number"
              min="0"
              {...register("durationSeconds", { valueAsNumber: true })}
              className="border p-2 w-24"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="resistance" className="block font-medium mb-1">
          Resistance
        </label>
        <input
          id="resistance"
          {...register("resistance")}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block font-medium mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={4}
          className="border p-2 w-full"
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
};
