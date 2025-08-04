import {
    combineDuration,
    exerciseDataHasDuration,
    splitDuration,
} from "./durationHelpers";
import {
    CleanedUpExercise,
    ExerciseInputs,
    CleanedFullSequence,
    SequenceFormInputs,
    SequencePayload,
    FavoriteExerciseFormInputs,
    FavoriteExerciseBasePayload,
} from "../constants/types";

export const splitInitialExerciseDurationSecsIfAny = (
    exercise: CleanedUpExercise
) => {
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
    editSequence: CleanedFullSequence
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
    editExercise: CleanedUpExercise
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

export const makeFavoriteExerciseRequestPayloadFromFormData = (
    formData: FavoriteExerciseFormInputs,
    userId: string,
    id: string,
    created_at: string
) => {
    const hasDuration = exerciseDataHasDuration(formData);

    const combinedDurationSecs = hasDuration
        ? combineDuration(
              formData.duration_mins ?? 0,
              formData.duration_secs ?? 0
          )
        : undefined;

    const sanitizedBasePayload: FavoriteExerciseBasePayload = {
        user_id: userId,
        name: formData.name,
        // only include optional fields in payload if defined
        ...(formData.direction !== undefined && {
            direction: formData.direction,
        }),
        ...(formData.resistance !== undefined && {
            resistance: formData.resistance,
        }),
        ...(formData.notes !== undefined && { notes: formData.notes }),
        // also omit duration if it totals to 0
        ...(combinedDurationSecs &&
            combinedDurationSecs !== 0 && {
                duration_secs: combinedDurationSecs,
            }),
    };

    const finalPayload = {
        ...sanitizedBasePayload,
        id,
        created_at,
    };

    return finalPayload;
};
