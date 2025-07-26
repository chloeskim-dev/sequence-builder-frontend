import {
    combineDuration,
    exerciseDataHasDuration,
    // normalizeDurations,
    splitDuration,
} from "./timeHelpers";
import {
    Exercise,
    ExerciseInputs,
    Sequence,
    SequenceFormInputs,
    SequencePayload,
} from "../constants/types";
// import {
//     UseFormGetValues,
//     UseFormSetValue,
//     UseFormTrigger,
// } from "react-hook-form";
// import { FavoriteExerciseBasePayload } from "./sequenceHelpers";

// export const prepareAndAppendExerciseToForm = (
//     exerciseData: ExerciseInputs,
//     append: (value: ExerciseInputs) => void
// ) => {
//     console.log(exerciseData);

//     const hasDuration = exerciseDataHasDuration(exerciseData);
//     const combinedDurationSecs = hasDuration
//         ? combineDuration(
//               exerciseData.duration_mins ?? 0,
//               exerciseData.duration_secs ?? 0
//           )
//         : undefined;

//     const splitDurations = combinedDurationSecs
//         ? splitDuration(combinedDurationSecs)
//         : undefined;

//     const newExercise = {
//         name: exerciseData.name,
//         direction: exerciseData.direction || undefined, // "" => undefined"
//         resistance: exerciseData.resistance || undefined,
//         notes: exerciseData.notes || undefined,
//         // both duration_mins and duration_secs will be 'undefined' unless a meaningful number was put in
//         duration_mins:
//             splitDurations && combinedDurationSecs !== 0
//                 ? splitDurations.splitMinutes
//                 : undefined,
//         duration_secs:
//             splitDurations && combinedDurationSecs !== 0
//                 ? splitDurations.splitSeconds
//                 : undefined,
//     };
//     console.log("adding to form: ", newExercise);

//     append(newExercise);
// };

export const splitInitialExerciseDurationSecsIfAny = (exercise: Exercise) => {
    const initialDurations = exercise.duration_secs
        ? splitDuration(exercise.duration_secs)
        : undefined;

    return {
        ...exercise,
        ...(initialDurations && {
            duration_mins: initialDurations.splitMinutes,
        }),
        ...(initialDurations && {
            duration_secs: initialDurations.splitSeconds,
        }),
    };
};

export const getInitialEditSequenceFormValues = (
    editSequence: Sequence
): SequenceFormInputs => {
    return {
        name: editSequence.name,
        description: editSequence.description,
        notes: editSequence.notes,
        exercises: editSequence.exercises.map(
            splitInitialExerciseDurationSecsIfAny
        ),
    };
};
export const getInitialEditExerciseFormValues = (
    editExercise: Exercise
): ExerciseInputs => {
    const splitDurations = editExercise.duration_secs
        ? splitDuration(editExercise.duration_secs)
        : undefined;
    return {
        name: editExercise.name,
        notes: editExercise.notes ?? undefined,
        resistance: editExercise.resistance ?? undefined,
        direction: editExercise.direction ?? undefined,
        duration_mins: splitDurations ? splitDurations.splitMinutes : undefined,
        duration_secs: splitDurations ? splitDurations.splitSeconds : undefined,
    };
};

export const normalizeDurationsIfAnyInExerciseData = (data: ExerciseInputs) => {
    const hasDuration = exerciseDataHasDuration(data);
    const combinedDurationSecs = hasDuration
        ? combineDuration(data.duration_mins ?? 0, data.duration_secs ?? 0)
        : undefined;

    const splitDurations = combinedDurationSecs
        ? splitDuration(combinedDurationSecs)
        : undefined;

    const normalizedData = {
        ...data,
        ...(splitDurations &&
            combinedDurationSecs !== 0 && {
                duration_mins: splitDurations.splitMinutes,
            }),
        ...(splitDurations &&
            combinedDurationSecs !== 0 && {
                duration_secs: splitDurations.splitSeconds,
            }),
    };

    return normalizedData;
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
            const combinedDurationSecs = exerciseDataHasDuration(exercise)
                ? combineDuration(
                      exercise.duration_mins ?? 0,
                      exercise.duration_secs ?? 0
                  )
                : undefined;

            // omit undefined fields
            return {
                name: exercise.name,
                ...(exercise.direction && {
                    direction: exercise.direction,
                }),
                ...(exercise.resistance && {
                    resistance: exercise.resistance,
                }),
                ...(exercise.notes && { notes: exercise.notes }),
                ...(combinedDurationSecs &&
                    // also omit duration_secs field if it is 0
                    combinedDurationSecs !== 0 && {
                        duration_secs: combinedDurationSecs,
                    }),
                order_index: index,
            };
        }),
    };
    return sanitizedPayload;
};

// type EditExerciseParams = {
//     fieldIndex: number;
//     getValues: UseFormGetValues<SequenceFormInputs>;
//     setValue: UseFormSetValue<SequenceFormInputs>;
//     trigger: UseFormTrigger<SequenceFormInputs>;
//     setEditingExerciseFieldIndex: (fieldIndex: number | null) => void;
// };

// export const editExerciseFieldArray = async ({
//     fieldIndex,
//     getValues,
//     setValue,
//     trigger,
//     setEditingExerciseFieldIndex,
// }: EditExerciseParams) => {
//     const valid = await trigger([
//         `exercises.${fieldIndex}.name`,
//         `exercises.${fieldIndex}.direction`,
//         `exercises.${fieldIndex}.duration_mins`,
//         `exercises.${fieldIndex}.duration_secs`,
//         `exercises.${fieldIndex}.resistance`,
//         `exercises.${fieldIndex}.notes`,
//     ]);

//     if (!valid) return;

//     const formValues = getValues() as SequenceFormInputs;
//     const editedExercise = formValues.exercises?.[fieldIndex];

//     if (!editedExercise) return;

//     const normalizedDurations = exerciseDataHasDuration(editedExercise)
//         ? normalizeDurations(
//               editedExercise.duration_mins ?? 0,
//               editedExercise.duration_secs ?? 0
//           )
//         : undefined;

//     setValue(
//         `exercises.${fieldIndex}.duration_mins`,
//         normalizedDurations?.splitMinutes
//     );
//     setValue(
//         `exercises.${fieldIndex}.duration_secs`,
//         normalizedDurations?.splitSeconds
//     );

//     setEditingExerciseFieldIndex(null);
// };
