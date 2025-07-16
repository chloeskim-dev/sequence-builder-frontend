import { SetStateAction } from "react";
import Modal from "../layouts/Modal";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { FavoriteExerciseFormInputs } from "../../constants/types";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import { getUtcNaiveTimestamp } from "../../utils/timeHelpers";
import { v4 as uuidv4 } from "uuid";
import { GenericExerciseForm } from "./GenericExerciseForm";
import { exerciseFormFieldConfigs } from "../../constants/exerciseFormFields";
import {
    CleanedUpFavoriteExercise,
    removeNullFieldsFromFavoriteExercises,
} from "../../utils/sequenceHelpers";
import { makeBaseFavoriteExercisePayloadFromFormData } from "../../utils/formHelpers";
import { blankNewExerciseInputs } from "../../constants/initialFormInputs";

type FavoriteExerciseCreateModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    setFavoriteExercises: React.Dispatch<
        SetStateAction<CleanedUpFavoriteExercise[]>
    >;
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

    const formInitialValues = blankNewExerciseInputs;

    const methods = useForm({ defaultValues: formInitialValues });

    const onSubmit: SubmitHandler<FavoriteExerciseFormInputs> = async (
        formData
    ) => {
        const baseFavoriteExercisePayload =
            makeBaseFavoriteExercisePayloadFromFormData(formData, userId!);

        const createRequestPayload = {
            ...baseFavoriteExercisePayload,
            id: uuidv4(),
            created_at: getUtcNaiveTimestamp(),
        };

        try {
            const res = await api.post(
                `/v1/favorite_exercises/user/${userId}`,
                createRequestPayload
            );
            console.log("API response to create request:", res);
        } catch (err: any) {
            console.error("Error creating favorite_exercise:", err.message);
        }

        let updatedFavoriteExercises = await fetchFavoriteExercises();
        setFavoriteExercises(
            removeNullFieldsFromFavoriteExercises(updatedFavoriteExercises)
        );
        onModalClose();
    };

    const onModalClose = () => {
        setIsModalOpen(false);
        methods.reset(formInitialValues);
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
