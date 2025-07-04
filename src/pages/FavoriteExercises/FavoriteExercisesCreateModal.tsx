import { SetStateAction, useEffect } from "react";
import Modal from "../../components/layouts/Modal";
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
        // const transformedData = {
        //     id: uuidv4(),
        //     created_at: getUtcNaiveTimestamp(),
        //     user_id: userId,
        //     name: formData.name,
        //     direction: formData.direction,
        //     duration_secs: combinedDurationSecs,
        //     resistance: formData.resistance,
        //     notes: formData.notes,
        // };

        console.log("transformed form data:", transformedData);

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
                    label: "Cancel",
                    onClick: () => setIsModalOpen(false),
                    variant: "secondary",
                },
                {
                    label: "Create New",
                    onClick: () => {}, // Empty onClick for submit buttons
                    variant: "primary",
                    type: "submit",
                    form: "create-favorite-exercise-form",
                    disabled: isSubmitting,
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
                        Name
                    </label>
                    <input
                        id="name"
                        {...register("name", { required: true })}
                        className={inputStyles}
                        placeholder="ex. reverse lunge"
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
                        placeholder="ex. left"
                    />
                </div>

                <div>
                    <span className={labelStyles}>Duration</span>
                    <div className="flex gap-2 items-start">
                        <div>
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
                                {...register("durationMinutes", {
                                    valueAsNumber: true,
                                })}
                                className={`${inputStyles} ${subDurationInputWidth}`}
                            />
                        </div>

                        <div className="text-sm self-end pb-2">:</div>

                        <div>
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
                                {...register("durationSeconds", {
                                    valueAsNumber: true,
                                })}
                                className={`${inputStyles} ${subDurationInputWidth}`}
                            />
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
                        placeholder="ex. 2 yellow springs"
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
                        placeholder="ex. Keep knees over ankles."
                    ></textarea>
                </div>
            </form>
        </Modal>
    );
}
