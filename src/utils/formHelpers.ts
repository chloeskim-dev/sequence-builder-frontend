import {
    combineDuration,
    exerciseDataHasDuration,
    normalizeDurations,
} from "./timeHelpers";
import {
    ExerciseInputs,
    FavoriteExerciseFormInputs,
    SequenceFormInputs,
    SequencePayload,
} from "../constants/types";
import {
    UseFormGetValues,
    UseFormSetValue,
    UseFormTrigger,
} from "react-hook-form";
import {
    CleanedUpFavoriteExercise,
    FavoriteExerciseBasePayload,
} from "./sequenceHelpers";

export const prepareAndAppendExerciseToForm = (
    exerciseData: ExerciseInputs,
    append: (value: ExerciseInputs) => void
) => {
    console.log(exerciseData);
    const normalizedDurations = exerciseDataHasDuration(exerciseData)
        ? normalizeDurations(
              exerciseData.duration_mins ?? 0,
              exerciseData.duration_secs ?? 0
          )
        : undefined;

    // Standardize "" and undefined to undefined
    const exercise = {
        name: exerciseData.name,
        direction: exerciseData.direction || undefined,
        duration_mins: normalizedDurations?.splitMinutes,
        duration_secs: normalizedDurations?.splitSeconds,
        resistance: exerciseData.resistance || undefined,
        notes: exerciseData.notes || undefined,
    };
    console.log("adding to form: ", exercise);

    append(exercise);
};

export const makeSequencePayloadFromFormData = (
    formData: SequenceFormInputs,
    userId: string
): SequencePayload => {
    // 1) Adds user_id
    // 2) Drops all fields from form whose values are "" or undefined
    const sanitizedPayload = {
        user_id: userId,
        name: formData.name,
        ...(formData.description && {
            description: formData.description,
        }),
        ...(formData.notes && {
            notes: formData.notes,
        }),
        exercises: formData.exercises.map((exercise, index) => {
            const durationSecs = exerciseDataHasDuration(exercise)
                ? combineDuration(
                      exercise.duration_mins ?? 0,
                      exercise.duration_secs ?? 0
                  )
                : undefined;

            return {
                name: exercise.name,
                ...(exercise.direction && {
                    direction: exercise.direction,
                }),
                ...(exercise.resistance && {
                    resistance: exercise.resistance,
                }),
                ...(exercise.notes && { notes: exercise.notes }),
                ...(durationSecs && {
                    duration_secs: durationSecs,
                }),
                order_index: index,
            };
        }),
    };
    return sanitizedPayload;
};

type EditExerciseParams = {
    fieldIndex: number;
    getValues: UseFormGetValues<SequenceFormInputs>;
    setValue: UseFormSetValue<SequenceFormInputs>;
    trigger: UseFormTrigger<SequenceFormInputs>;
    setEditingExerciseFieldIndex: (fieldIndex: number | null) => void;
};

export const editExerciseFieldArray = async ({
    fieldIndex,
    getValues,
    setValue,
    trigger,
    setEditingExerciseFieldIndex,
}: EditExerciseParams) => {
    const valid = await trigger([
        `exercises.${fieldIndex}.name`,
        `exercises.${fieldIndex}.direction`,
        `exercises.${fieldIndex}.duration_mins`,
        `exercises.${fieldIndex}.duration_secs`,
        `exercises.${fieldIndex}.resistance`,
        `exercises.${fieldIndex}.notes`,
    ]);

    if (!valid) return;

    const formValues = getValues() as SequenceFormInputs;
    const editedExercise = formValues.exercises?.[fieldIndex];

    if (!editedExercise) return;

    const normalizedDurations = exerciseDataHasDuration(editedExercise)
        ? normalizeDurations(
              editedExercise.duration_mins ?? 0,
              editedExercise.duration_secs ?? 0
          )
        : undefined;

    setValue(
        `exercises.${fieldIndex}.duration_mins`,
        normalizedDurations?.splitMinutes
    );
    setValue(
        `exercises.${fieldIndex}.duration_secs`,
        normalizedDurations?.splitSeconds
    );

    setEditingExerciseFieldIndex(null);
};

// Favorite Exercise Forms
export const makeBaseFavoriteExercisePayloadFromFormData = (
    formData: FavoriteExerciseFormInputs,
    userId: string
) => {
    // 1) Adds user_id
    // 2) Drops all fields from form whose values are undefined

    const hasDuration =
        formData.durationMinutes !== undefined ||
        formData.durationSeconds !== undefined;

    const combinedDurationSecs = hasDuration
        ? combineDuration(
              formData.durationMinutes ?? 0,
              formData.durationSeconds ?? 0
          )
        : undefined;

    const sanitizedBasePayload: FavoriteExerciseBasePayload = {
        user_id: userId,
        name: formData.name,
        ...(formData.direction !== undefined && {
            direction: formData.direction,
        }),
        ...(hasDuration && { duration_secs: combinedDurationSecs }),
        ...(formData.resistance !== undefined && {
            resistance: formData.resistance,
        }),
        ...(formData.notes !== undefined && { notes: formData.notes }),
    };
    return sanitizedBasePayload;
};
