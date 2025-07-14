import { SetStateAction, useEffect } from "react";
import Modal from "../layouts/Modal";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    FavoriteExercise,
    FavoriteExerciseFormInputs,
} from "../../constants/types";
import { splitDuration, combineDuration } from "../../utils/timeHelpers";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import {
    durationInputStyles,
    durationLabelStyles,
} from "../../constants/tailwindClasses";

const labelStyles = "block font-medium text-sm mb-1";
const inputStyles = "text-sm border p-2 w-full";

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
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FavoriteExerciseFormInputs>({
        defaultValues: {
            name: editItem.name,
            direction: editItem.direction,
            durationMinutes: splitMinutes,
            durationSeconds: splitSeconds,
            resistance: editItem.resistance,
            notes: editItem.notes,
        },
    });

    useEffect(() => {
        if (editItem) {
            const { splitMinutes, splitSeconds } = splitDuration(
                editItem.duration_secs
            );
            reset({
                name: editItem.name,
                direction: editItem.direction,
                durationMinutes: splitMinutes,
                durationSeconds: splitSeconds,
                resistance: editItem.resistance,
                notes: editItem.notes,
            });
        }
    }, [editItem, reset]);

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
        } catch (err: any) {}

        let updatedFavoriteExercises = fetchFavoriteExercises();
        setFavoriteExercises(await updatedFavoriteExercises);
        setIsModalOpen(false);
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
        setEditItem(null);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={closeEditModal}
            title="Edit your favorite exercise."
            buttons={[
                {
                    label: "Save Changes",
                    onClick: () => {}, // Empty onClick for submit buttons
                    variant: "primary",
                    type: "submit",
                    form: "edit-exercise-form",
                    disabled: isSubmitting,
                },
                {
                    label: "Cancel",
                    onClick: closeEditModal,
                    variant: "secondary",
                },
            ]}
        >
            <form
                id="edit-exercise-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <div>
                    <label htmlFor="name" className={labelStyles}>
                        Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        {...register("name", { required: true })}
                        className={inputStyles}
                    />
                    {errors.name && (
                        <span className="text-red-500 text-sm">
                            This field is required
                        </span>
                    )}
                </div>

                <div>
                    <label htmlFor="direction" className={labelStyles}>
                        Direction
                    </label>
                    <input
                        id="direction"
                        {...register("direction")}
                        className={inputStyles}
                    />
                </div>

                <div>
                    <span className={labelStyles}>Duration</span>
                    <div className="flex items-end gap-x-1">
                        <div>
                            <label
                                htmlFor="durationMinutes"
                                className={"text-gray-500 text-[10px]"}
                            >
                                Min
                            </label>
                            <div>
                                <input
                                    id="durationMinutes"
                                    type="number"
                                    min="0"
                                    {...register("durationMinutes", {
                                        valueAsNumber: true,
                                    })}
                                    className={`${durationInputStyles}`}
                                />
                            </div>
                        </div>

                        <div className="text-sm mb-1">:</div>

                        <div className="ml-1">
                            <label
                                htmlFor="durationSeconds"
                                className={"text-gray-500 text-[10px]"}
                            >
                                Sec
                            </label>
                            <div>
                                <input
                                    id="durationSeconds"
                                    type="number"
                                    min="0"
                                    {...register("durationSeconds", {
                                        valueAsNumber: true,
                                    })}
                                    className={`${durationInputStyles}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="resistance" className={labelStyles}>
                        Resistance
                    </label>
                    <input
                        id="resistance"
                        {...register("resistance")}
                        className={inputStyles}
                    />
                </div>

                <div>
                    <label htmlFor="notes" className={labelStyles}>
                        Notes
                    </label>
                    <textarea
                        id="notes"
                        {...register("notes")}
                        rows={4}
                        className={inputStyles}
                    ></textarea>
                </div>
            </form>
        </Modal>
    );
}
