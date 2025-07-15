import { SetStateAction } from "react";
import Modal from "../layouts/Modal";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import {
    FavoriteExercise,
    FavoriteExerciseFormInputs,
} from "../../constants/types";
import { splitDuration, combineDuration } from "../../utils/timeHelpers";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import { GenericExerciseForm } from "./GenericExerciseForm";
import { exerciseFormFieldConfigs } from "../../constants/exerciseFormFields";

type FavoriteExerciseEditModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    editItem: FavoriteExercise;
    setEditItem: React.Dispatch<SetStateAction<FavoriteExercise | null>>;
    setFavoriteExercises: React.Dispatch<SetStateAction<FavoriteExercise[]>>;
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
    const { user, isAuthenticated } = useUser();
    const userId = user?.id ?? null;

    const { splitMinutes, splitSeconds } = splitDuration(
        editItem.duration_secs
    );

    const initialValues = {
        name: editItem.name,
        direction: editItem.direction,
        durationMinutes: splitMinutes,
        durationSeconds: splitSeconds,
        resistance: editItem.resistance,
        notes: editItem.notes,
    };

    const methods = useForm({ defaultValues: initialValues });

    const onSubmit: SubmitHandler<FavoriteExerciseFormInputs> = async (
        formData
    ) => {
        const combinedDurationSecs = combineDuration(
            formData.durationMinutes ?? 0,
            formData.durationSeconds ?? 0
        );

        const transformedData = {
            id: editItem.id,
            created_at: editItem.created_at,
            user_id: userId,
            name: formData.name,
            direction: formData.direction,
            duration_secs: combinedDurationSecs,
            resistance: formData.resistance,
            notes: formData.notes,
        };

        try {
            const res = await api.put(
                `/v1/favorite_exercises/${editItem.id}`,
                transformedData
            );
        } catch (err: any) {
            console.log(err);
        }

        let updatedFavoriteExercises = fetchFavoriteExercises();
        setFavoriteExercises(await updatedFavoriteExercises);
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
