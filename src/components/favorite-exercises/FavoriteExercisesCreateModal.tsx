import { SetStateAction, useEffect } from "react";
import Modal from "../layouts/Modal";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import {
    FavoriteExercise,
    FavoriteExerciseFormInputs,
} from "../../constants/types";
import { combineDuration } from "../../utils/timeHelpers";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import { getUtcNaiveTimestamp } from "../../utils/timeHelpers";
import { v4 as uuidv4 } from "uuid";
import { GenericExerciseForm } from "./GenericExerciseForm";
import { exerciseFormFieldConfigs } from "../../constants/exerciseFormFields";

type FavoriteExerciseCreateModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    setFavoriteExercises: React.Dispatch<SetStateAction<FavoriteExercise[]>>;
    fetchFavoriteExercises: () => Promise<any>;
};

export default function FavoriteExerciseCreateModal({
    isModalOpen,
    setIsModalOpen,
    setFavoriteExercises,
    fetchFavoriteExercises,
}: FavoriteExerciseCreateModalProps) {
    const { user } = useUser();
    const userId = user?.id ?? null;

    const initialValues = {
        name: "",
        direction: undefined,
        durationMinutes: undefined,
        durationSeconds: undefined,
        resistance: undefined,
        notes: undefined,
    };

    const methods = useForm({ defaultValues: initialValues });

    const onSubmit: SubmitHandler<FavoriteExerciseFormInputs> = async (
        formData
    ) => {
        const hasDuration =
            formData.durationMinutes !== undefined ||
            formData.durationSeconds !== undefined;

        const combinedDurationSecs = hasDuration
            ? combineDuration(
                  formData.durationMinutes ?? 0,
                  formData.durationSeconds ?? 0
              )
            : undefined;

        const transformedData = {
            id: uuidv4(),
            created_at: getUtcNaiveTimestamp(),
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

        try {
            const res = await api.post(
                `/v1/favorite_exercises/user/${userId}`,
                transformedData
            );
            console.log("API response to create request:", res);
        } catch (err: any) {
            console.error("Error creating favorite_exercise:", err.message);
        }

        let updatedFavoriteExercises = fetchFavoriteExercises();
        setFavoriteExercises(await updatedFavoriteExercises);
        onModalClose();
    };

    const onModalClose = () => {
        setIsModalOpen(false);
        methods.reset(initialValues);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={onModalClose}
            title="Create a new favorite exercise."
            buttons={[
                {
                    label: "Create New",
                    onClick: () => {}, // Empty onClick for submit buttons
                    variant: "primary",
                    type: "submit",
                    form: "create-favorite-exercise-form",
                    disabled: methods.formState.isSubmitting,
                },
                {
                    label: "Cancel",
                    onClick: onModalClose,
                    variant: "secondary",
                },
            ]}
        >
            <FormProvider {...methods}>
                <GenericExerciseForm
                    id="create-favorite-exercise-form"
                    onSubmit={onSubmit}
                    fields={exerciseFormFieldConfigs}
                />
            </FormProvider>
        </Modal>
    );
}
