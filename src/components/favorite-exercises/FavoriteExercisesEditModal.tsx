import { SetStateAction } from "react";
import Modal from "../layouts/Modal";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { FavoriteExerciseFormInputs } from "../../constants/types";
import { splitDuration } from "../../utils/timeHelpers";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import { GenericExerciseForm } from "./GenericExerciseForm";
import { exerciseFormFieldConfigs } from "../../constants/exerciseFormFields";
import {
    CleanedUpFavoriteExercise,
    removeNullFieldsFromFavoriteExercises,
} from "../../utils/sequenceHelpers";
import { makeBaseFavoriteExercisePayloadFromFormData } from "../../utils/formHelpers";

type FavoriteExerciseEditModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    editItem: CleanedUpFavoriteExercise;
    setEditItem: React.Dispatch<
        SetStateAction<CleanedUpFavoriteExercise | null>
    >;
    setFavoriteExercises: React.Dispatch<
        SetStateAction<CleanedUpFavoriteExercise[]>
    >;
    fetchFavoriteExercises: () => Promise<any>;
};
export default function FavoriteExerciseEditModal({
    isModalOpen,
    setIsModalOpen,
    editItem,
    setEditItem,
    setFavoriteExercises,
    fetchFavoriteExercises,
}: FavoriteExerciseEditModalProps) {
    const { user } = useUser();
    const userId = user?.id ?? null;

    const editItemDurationMinutes =
        editItem.duration_secs !== undefined
            ? splitDuration(editItem.duration_secs).splitMinutes
            : undefined;

    const editItemDurationSeconds =
        editItem.duration_secs !== undefined
            ? splitDuration(editItem.duration_secs).splitMinutes
            : undefined;

    const formInitialValues = {
        name: editItem.name,
        direction: editItem.direction,
        durationMinutes: editItemDurationMinutes,
        durationSeconds: editItemDurationSeconds,
        resistance: editItem.resistance,
        notes: editItem.notes,
    };

    const methods = useForm({ defaultValues: formInitialValues });

    const onSubmit: SubmitHandler<FavoriteExerciseFormInputs> = async (
        formData
    ) => {
        const baseFavoriteExercisePayload =
            makeBaseFavoriteExercisePayloadFromFormData(formData, userId!);

        const editRequestPayload = {
            ...baseFavoriteExercisePayload,
            id: editItem.id,
            created_at: editItem.created_at,
        };

        try {
            const res = await api.put(
                `/v1/favorite_exercises/${editItem.id}`,
                editRequestPayload
            );
        } catch (err: any) {
            console.log(err);
        }

        let updatedFavoriteExercises = await fetchFavoriteExercises();
        setFavoriteExercises(
            removeNullFieldsFromFavoriteExercises(updatedFavoriteExercises)
        );
        onModalClose();
    };

    const onModalClose = () => {
        setIsModalOpen(false);
        setEditItem(null);
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
                    id="edit-favorite-exercise-form"
                    onSubmit={onSubmit}
                    fields={exerciseFormFieldConfigs}
                />
            </FormProvider>
        </Modal>
    );
}
