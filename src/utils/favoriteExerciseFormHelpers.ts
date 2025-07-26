import {
    FavoriteExerciseBasePayload,
    FavoriteExerciseFormInputs,
} from "../constants/types";
import { combineDuration, exerciseDataHasDuration } from "./timeHelpers";

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
        ...(formData.direction !== undefined && {
            direction: formData.direction,
        }),
        ...(formData.resistance !== undefined && {
            resistance: formData.resistance,
        }),
        ...(formData.notes !== undefined && { notes: formData.notes }),
        // omit duration_secs field from payload if 0
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
