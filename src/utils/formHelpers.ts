import {
    combineDuration,
    exerciseDataHasDuration,
    normalizeDurations,
} from "./timeHelpers";
import {
    ExerciseInputs,
    SequenceFormInputs,
    SequencePayload,
} from "../constants/types";
import {
    UseFormGetValues,
    UseFormSetValue,
    UseFormTrigger,
} from "react-hook-form";

export const prepareAndAppendExerciseToForm = (
    exerciseData: ExerciseInputs,
    append: (value: ExerciseInputs) => void
) => {
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
    // 1) Add user_id
    // 2) Drop all fields from form whose values are "" or undefined
    // This way only meaningful values will be stored in DB
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
                    description: exercise.direction,
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

type ToggleEditExerciseParams = {
    fieldIndex: number;
    fieldId: string;
    isEditing: boolean;
    getValues: UseFormGetValues<SequenceFormInputs>;
    setValue: UseFormSetValue<SequenceFormInputs>;
    trigger: UseFormTrigger<SequenceFormInputs>;
    setEditingExerciseId: (id: string | null) => void;
};

export const handleToggleEditExercise = async ({
    fieldIndex,
    fieldId,
    isEditing,
    getValues,
    setValue,
    trigger,
    setEditingExerciseId,
}: ToggleEditExerciseParams) => {
    if (!isEditing) {
        setEditingExerciseId(fieldId);
        return;
    }

    const valid = await trigger([
        `exercises.${fieldIndex}.name`,
        `exercises.${fieldIndex}.direction`,
        `exercises.${fieldIndex}.duration_mins`,
        `exercises.${fieldIndex}.duration_secs`,
        `exercises.${fieldIndex}.resistance`,
        `exercises.${fieldIndex}.notes`,
    ]);

    if (!valid) return;

    const sequenceData = getValues() as SequenceFormInputs;
    const editedExercise = sequenceData.exercises?.[fieldIndex];

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

    setEditingExerciseId(null);
};
