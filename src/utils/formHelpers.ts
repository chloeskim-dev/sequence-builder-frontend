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
import { FavoriteExerciseBasePayload } from "./sequenceHelpers";

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
        duration_mins: normalizedDurations?.splitMinutes, // 0s are allowed here since we are simply appending the exercise to the sequence form here
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
                ...(durationSecs &&
                    // also omit duration_secs field if it is 0
                    durationSecs !== 0 && {
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
    // Creates base payload (for either edit / create favorite exercise forms) by
    // 1) Adding user_id
    // 2) Dropping all fields from form whose values are undefined. Additionally drops 'duration_secs' field if its value is 0

    console.log("RAW DATA: ", formData);

    const hasDuration =
        formData.duration_mins !== undefined ||
        formData.duration_secs !== undefined;

    const combinedDurationSecs = hasDuration
        ? combineDuration(
              formData.duration_mins ?? 0,
              formData.duration_secs ?? 0
          )
        : undefined;

    const sanitizedBasePayload: FavoriteExerciseBasePayload = {
        user_id: userId,
        name: formData.name,
        ...(formData.direction !== undefined && {
            direction: formData.direction,
        }),
        // omit duration_secs field from payload if 0
        ...(combinedDurationSecs &&
            combinedDurationSecs !== 0 && {
                duration_secs: combinedDurationSecs,
            }),
        ...(formData.resistance !== undefined && {
            resistance: formData.resistance,
        }),
        ...(formData.notes !== undefined && { notes: formData.notes }),
    };
    return sanitizedBasePayload;
};
