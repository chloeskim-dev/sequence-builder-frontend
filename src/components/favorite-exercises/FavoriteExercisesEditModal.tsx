import { SetStateAction } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useUser } from "../../contexts/UserContext";

import Modal from "../layouts/Modal";
import { ExerciseForm } from "../forms/ExerciseForm";
import { exerciseFormFieldConfigs } from "../../constants/formFieldConfigs";
import {
    CleanedUpFavoriteExercise,
    FavoriteExerciseFormInputs,
} from "../../constants/types";

import { api } from "../../utils/api";
import { makeFavoriteExerciseRequestPayloadFromFormData } from "../../utils/favoriteExerciseFormHelpers";
import { splitDuration } from "../../utils/timeHelpers";

type FavoriteExerciseEditModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    resetFavoriteExercisesToDisplay: () => Promise<any>;
    editItem: CleanedUpFavoriteExercise;
    setEditItem: React.Dispatch<
        SetStateAction<CleanedUpFavoriteExercise | null>
    >;
};
export default function FavoriteExerciseEditModal({
    isModalOpen,
    setIsModalOpen,
    resetFavoriteExercisesToDisplay,
    editItem,
    setEditItem,
}: FavoriteExerciseEditModalProps) {
    const { user } = useUser();
    const userId = user?.id ?? null;

    const editItemDurationMinutes =
        editItem.duration_secs !== undefined
            ? splitDuration(editItem.duration_secs).splitMinutes
            : undefined;

    const editItemDurationSeconds =
        editItem.duration_secs !== undefined
            ? splitDuration(editItem.duration_secs).splitSeconds
            : undefined;

    const formInitialValues = {
        name: editItem.name,
        direction: editItem.direction,
        duration_mins: editItemDurationMinutes,
        duration_secs: editItemDurationSeconds,
        resistance: editItem.resistance,
        notes: editItem.notes,
    };

    const editFavoriteExercisesFormMethods = useForm({
        defaultValues: formInitialValues,
        mode: "onSubmit", // only validate on submit
        reValidateMode: "onChange",
    });

    const onModalClose = () => {
        setEditItem(null);
        setIsModalOpen(false);
    };

    const onSubmit: SubmitHandler<FavoriteExerciseFormInputs> = async (
        formData
    ) => {
        try {
            const editRequestPayload =
                makeFavoriteExerciseRequestPayloadFromFormData(
                    formData,
                    userId!,
                    editItem.id,
                    editItem.created_at
                );

            const res = await api.put(
                `/v1/favorite_exercises/${editItem.id}`,
                editRequestPayload
            );

            resetFavoriteExercisesToDisplay();
            onModalClose();
        } catch (err: any) {
            console.log(err);
        }
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={onModalClose}
            title="Edit your favorite exercise."
            buttons={[
                {
                    label: "Save Changes",
                    onClick: () => {}, // Empty onClick for submit buttons
                    variant: "primary",
                    type: "submit",
                    form: "edit-favorite-exercise-form",
                    disabled:
                        editFavoriteExercisesFormMethods.formState.isSubmitting,
                },
                {
                    label: "Cancel",
                    onClick: onModalClose,
                    variant: "secondary",
                },
            ]}
        >
            <FormProvider {...editFavoriteExercisesFormMethods}>
                <ExerciseForm
                    id="edit-favorite-exercise-form"
                    onSubmit={onSubmit}
                    fieldConfigs={exerciseFormFieldConfigs}
                />
            </FormProvider>
        </Modal>
    );
}
