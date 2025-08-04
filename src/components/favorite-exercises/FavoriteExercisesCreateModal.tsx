import { SetStateAction } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../../contexts/UserContext";

import Modal from "../layouts/Modal";
import { ExerciseForm } from "../forms/ExerciseForm";
import { exerciseFormFieldConfigs } from "../../constants/formFieldConfigs";
import { FavoriteExerciseFormInputs } from "../../constants/types";
import { blankExerciseFormInputs } from "../../constants/initialFormInputs";

import { api } from "../../utils/api";
import { getUtcNaiveTimestamp } from "../../utils/timeHelpers";
import { makeFavoriteExerciseRequestPayloadFromFormData } from "../../utils/formHelpers";

type FavoriteExerciseCreateModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    resetFavoriteExercisesToDisplay: () => Promise<any>;
};

export default function FavoriteExerciseCreateModal({
    isModalOpen,
    setIsModalOpen,
    resetFavoriteExercisesToDisplay,
}: FavoriteExerciseCreateModalProps) {
    const { user } = useUser();
    const userId = user?.id ?? null;

    const formInitialValues = blankExerciseFormInputs;

    const createFavoriteExerciseFormMethods = useForm({
        defaultValues: formInitialValues,
        mode: "onSubmit", // only validate on submit
        reValidateMode: "onChange",
    });

    const onModalClose = () => {
        createFavoriteExerciseFormMethods.reset(formInitialValues);
        setIsModalOpen(false);
    };

    const onSubmit: SubmitHandler<FavoriteExerciseFormInputs> = async (
        formData
    ) => {
        try {
            const createRequestPayload =
                makeFavoriteExerciseRequestPayloadFromFormData(
                    formData,
                    userId!,
                    uuidv4(),
                    getUtcNaiveTimestamp()
                );

            const res = await api.post(
                `/v1/favorite_exercises/user/${userId}`,
                createRequestPayload
            );

            resetFavoriteExercisesToDisplay();
            onModalClose();
        } catch (err: any) {
            console.error("Error creating favorite_exercise:", err.message);
        }
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
                    disabled:
                        createFavoriteExerciseFormMethods.formState
                            .isSubmitting,
                },
                {
                    label: "Cancel",
                    onClick: onModalClose,
                    variant: "secondary",
                },
            ]}
        >
            <FormProvider {...createFavoriteExerciseFormMethods}>
                <ExerciseForm
                    id="create-favorite-exercise-form"
                    onSubmit={onSubmit}
                    fieldConfigs={exerciseFormFieldConfigs}
                />
            </FormProvider>
        </Modal>
    );
}
