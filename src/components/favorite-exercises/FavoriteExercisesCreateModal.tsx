import { SetStateAction, useEffect } from "react";
import Modal from "../layouts/Modal";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    FavoriteExercise,
    FavoriteExerciseFormInputs,
} from "../../constants/types";
import { combineDuration } from "../../utils/timeHelpers";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import { getUtcNaiveTimestamp } from "../../utils/timeHelpers";
import { v4 as uuidv4 } from "uuid";
import {
    durationInputStyles,
    errorMessageStyles,
} from "../../constants/tailwindClasses";

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

    const formInitialInputs = {
        name: "",
        direction: undefined,
        durationMinutes: undefined,
        durationSeconds: undefined,
        resistance: undefined,
        notes: undefined,
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FavoriteExerciseFormInputs>({
        defaultValues: formInitialInputs,
    });

    useEffect(() => {
        reset(formInitialInputs);
    }, [reset, isModalOpen]);

    const labelStyles = "block font-medium text-sm mb-1";
    const inputStyles = "text-sm border p-2 w-full";
    const subDurationInputWidth = "w-[70px]";

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
        setIsModalOpen(false);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Create a new favorite exercise."
            buttons={[
                {
                    label: "Create New",
                    onClick: () => {}, // Empty onClick for submit buttons
                    variant: "primary",
                    type: "submit",
                    form: "create-favorite-exercise-form",
                    disabled: isSubmitting,
                },
                {
                    label: "Cancel",
                    onClick: () => setIsModalOpen(false),
                    variant: "secondary",
                },
            ]}
        >
            <form
                id="create-favorite-exercise-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-2"
            >
                <div>
                    <label htmlFor="name" className={labelStyles}>
                        Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        {...register("name", {
                            required: "Name is required",
                            maxLength: {
                                value: 100,
                                message: "Name must be 100 characters or fewer",
                            },
                        })}
                        className={inputStyles}
                        placeholder="ex. reverse lunge"
                    />
                    {errors.name && (
                        <p className={errorMessageStyles}>
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="direction" className={labelStyles}>
                        Direction
                    </label>
                    <input
                        id="direction"
                        {...register("direction", {
                            maxLength: {
                                value: 100,
                                message:
                                    "Direction must be 100 characters or fewer",
                            },
                        })}
                        className={inputStyles}
                        placeholder="ex. left"
                    />
                    {errors.direction && (
                        <p className={errorMessageStyles}>
                            {errors.direction.message}
                        </p>
                    )}
                </div>

                <div>
                    <span className={labelStyles}>Duration</span>
                    <div className="flex gap-2 items-start">
                        <div className={`flex flex-col`}>
                            <label
                                htmlFor="durationMinutes"
                                className="block text-xs mb-1"
                            >
                                Minutes
                            </label>
                            <input
                                id="durationMinutes"
                                type="number"
                                min="0"
                                max="99"
                                {...register("durationMinutes", {
                                    valueAsNumber: true,
                                    min: {
                                        value: 0,
                                        message: "Minutes must be 0 or more",
                                    },
                                    max: {
                                        value: 99,
                                        message: "Minutes must be 99 or less",
                                    },
                                })}
                                className={`${durationInputStyles}`}
                            />
                            {errors.durationMinutes && (
                                <p className={errorMessageStyles}>
                                    {errors.durationMinutes.message}
                                </p>
                            )}
                        </div>

                        <div className="text-sm self-end pb-2">:</div>

                        <div className={`flex flex-col flex-1`}>
                            <label
                                htmlFor="durationSeconds"
                                className="block text-xs mb-1"
                            >
                                Seconds
                            </label>
                            <input
                                id="durationSeconds"
                                type="number"
                                min="0"
                                max="999"
                                {...register("durationSeconds", {
                                    valueAsNumber: true,
                                    min: {
                                        value: 0,
                                        message: "Seconds must be 0 or more",
                                    },
                                    max: {
                                        value: 999,
                                        message: "Seconds must be 999 or less",
                                    },
                                })}
                                className={`${durationInputStyles}`}
                            />
                            {errors.durationSeconds && (
                                <p className={errorMessageStyles}>
                                    {errors.durationSeconds.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="resistance" className={labelStyles}>
                        Resistance
                    </label>
                    <input
                        id="resistance"
                        {...register("resistance", {
                            maxLength: {
                                value: 100,
                                message:
                                    "Resistance must be 100 characters or fewer",
                            },
                        })}
                        className={inputStyles}
                        placeholder="ex. 2 yellow springs"
                    />
                    {errors.resistance && (
                        <p className={errorMessageStyles}>
                            {errors.resistance.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="notes" className={labelStyles}>
                        Notes
                    </label>
                    <textarea
                        id="notes"
                        {...register("notes", {
                            maxLength: {
                                value: 500,
                                message:
                                    "Notes must be 500 characters or fewer",
                            },
                        })}
                        rows={4}
                        className={inputStyles}
                        placeholder="ex. Keep knees over ankles."
                    ></textarea>
                </div>
                {errors.notes && (
                    <p className={errorMessageStyles}>{errors.notes.message}</p>
                )}
            </form>
        </Modal>
    );
}
