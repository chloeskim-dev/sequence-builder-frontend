import React, { useState } from "react";
import { SetStateAction } from "react";
import { ExerciseInputs } from "../../../constants/types";
import { errorMessageStyles } from "../../../constants/tailwindClasses";

type RowProps = {
    newExerciseInputs: ExerciseInputs;
    setNewExerciseInputs: React.Dispatch<SetStateAction<ExerciseInputs>>;
    handleAddNewExercise: (newExercise: ExerciseInputs) => void;
    showAddNewExerciseRowErrors: boolean;
    cancelAddNewExercise: () => void;
};

export default function NewExerciseInputsRow({
    newExerciseInputs,
    setNewExerciseInputs,
    showAddNewExerciseRowErrors,
}: RowProps) {
    const [errors, setErrors] = useState<{
        name?: string;
        direction?: string;
        duration_mins?: string;
        duration_secs?: string;
        resistance?: string;
        notes?: string;
    }>({});
    const _fieldsContainerStyles = "flex flex-col md:gap-2 flex-1";
    const _labelStyles = "text-xs font-bold";
    const fullLengthInputStyles = "border rounded text-sm p-1.5 w-full";
    const durationInputStyles = "text-sm p-1.5 w-[100px]";

    return (
        <div>
            <div id="fieldsContainer" className={_fieldsContainerStyles}>
                <div className="flex-1 px-2">
                    <label className={_labelStyles}>
                        Name<span className="text-red-500">*</span>
                    </label>

                    <input
                        value={newExerciseInputs.name}
                        onChange={(e) => {
                            const value = e.target.value;
                            setNewExerciseInputs((prev) => ({
                                ...prev,
                                name: value,
                            }));

                            if (value.length > 100) {
                                setErrors((prev) => ({
                                    ...prev,
                                    name: "Name must be 100 characters or less",
                                }));
                            } else {
                                setErrors((prev) => ({
                                    ...prev,
                                    name: undefined,
                                }));
                            }
                        }}
                        className={fullLengthInputStyles}
                        placeholder="ex. reverse lunge"
                    />

                    {showAddNewExerciseRowErrors && (
                        <span className="text-red-500 text-xs mt-1">
                            This field is required
                        </span>
                    )}
                    {errors.name && (
                        <p className={errorMessageStyles}>{errors.name}</p>
                    )}
                </div>
                <div className="flex-1 px-2 ">
                    <label className={_labelStyles}>Direction</label>

                    <input
                        value={newExerciseInputs.direction}
                        onChange={(e) => {
                            const value = e.target.value;
                            setNewExerciseInputs((prev) => ({
                                ...prev,
                                direction: value,
                            }));

                            if (value.length > 100) {
                                setErrors((prev) => ({
                                    ...prev,
                                    direction:
                                        "Direction must be 100 characters or less",
                                }));
                            } else {
                                setErrors((prev) => ({
                                    ...prev,
                                    direction: undefined,
                                }));
                            }
                        }}
                        className={`${fullLengthInputStyles}`}
                        placeholder="ex. left"
                    />
                    {errors.direction && (
                        <p className={errorMessageStyles}>{errors.direction}</p>
                    )}
                </div>
                <div className={`flex-1 px-2`}>
                    <label className={_labelStyles}>Duration</label>
                    <div className="flex gap-1.5 items-center">
                        <div className="flex flex-col">
                            <label className="text-[9px] md:hidden font-medium">
                                min
                            </label>

                            <input
                                type="number"
                                min="0"
                                max="99"
                                value={newExerciseInputs.duration_mins}
                                onChange={(e) => {
                                    const value =
                                        e.target.value === "" ||
                                        e.target.value === undefined
                                            ? undefined
                                            : Number(e.target.value);
                                    // if (value !== undefined)
                                    setNewExerciseInputs((prev) => ({
                                        ...prev,
                                        duration_mins: value,
                                    }));

                                    if (value && (value < 0 || value > 99)) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            duration_mins:
                                                "Minutes must be between 0 and 99",
                                        }));
                                    } else {
                                        setErrors((prev) => ({
                                            ...prev,
                                            duration_mins: undefined,
                                        }));
                                    }
                                }}
                                placeholder="min"
                                className={durationInputStyles}
                            />
                            {errors.duration_mins && (
                                <p className={errorMessageStyles}>
                                    {errors.duration_mins}
                                </p>
                            )}
                        </div>
                        <div className="text-xs text-white font-bold self-end pb-2">
                            :
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[9px] md:hidden font-medium">
                                sec
                            </label>

                            <input
                                type="number"
                                min="0"
                                max="999"
                                value={newExerciseInputs.duration_secs}
                                onChange={(e) => {
                                    const value =
                                        e.target.value === "" ||
                                        e.target.value === undefined
                                            ? undefined
                                            : Number(e.target.value);
                                    // if (value !== undefined)
                                    setNewExerciseInputs((prev) => ({
                                        ...prev,
                                        duration_secs: value,
                                    }));

                                    if (value && (value < 0 || value > 999)) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            duration_secs:
                                                "Seconds must be between 0 and 999.",
                                        }));
                                    } else {
                                        setErrors((prev) => ({
                                            ...prev,
                                            duration_secs: undefined,
                                        }));
                                    }
                                }}
                                placeholder="sec"
                                className={durationInputStyles}
                            />
                            {errors.duration_secs && (
                                <p className={errorMessageStyles}>
                                    {errors.duration_secs}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex-1 px-2">
                    <label className={_labelStyles}>Resistance</label>
                    <input
                        value={newExerciseInputs.resistance}
                        onChange={(e) => {
                            const value = e.target.value;
                            setNewExerciseInputs((prev) => ({
                                ...prev,
                                resistance: value,
                            }));

                            if (value.length > 100) {
                                setErrors((prev) => ({
                                    ...prev,
                                    resistance:
                                        "Resistance must be 100 characters or less",
                                }));
                            } else {
                                setErrors((prev) => ({
                                    ...prev,
                                    resistance: undefined,
                                }));
                            }
                        }}
                        className={fullLengthInputStyles}
                        placeholder="ex. 2 yellow springs"
                    />
                    {errors.resistance && (
                        <p className={errorMessageStyles}>
                            {errors.resistance}
                        </p>
                    )}
                </div>
                <div className="flex-1 px-2">
                    <label className={_labelStyles}>Notes</label>
                    <input
                        value={newExerciseInputs.notes}
                        onChange={(e) => {
                            const value = e.target.value;
                            setNewExerciseInputs((prev) => ({
                                ...prev,
                                notes: value,
                            }));

                            if (value.length > 500) {
                                setErrors((prev) => ({
                                    ...prev,
                                    notes: "Notes must be 100 characters or less",
                                }));
                            } else {
                                setErrors((prev) => ({
                                    ...prev,
                                    notes: undefined,
                                }));
                            }
                        }}
                        className={fullLengthInputStyles}
                        placeholder="ex. Keep knees over ankles."
                    />
                    {errors.notes && (
                        <p className={errorMessageStyles}>{errors.notes}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
