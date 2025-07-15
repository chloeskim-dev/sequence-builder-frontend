import { useState } from "react";
import {
    UseFormSetValue,
    useFormContext,
    useController,
} from "react-hook-form";
import Modal from "../../layouts/Modal";
import { MainRow } from "../../layouts/ReusableTable";
import { SequenceFormInputs } from "../../../constants/types";
import {
    combineDuration,
    exerciseDataHasDuration,
    splitDuration,
} from "../../../utils/timeHelpers";
import {
    fullLengthInputStyles,
    errorMessageStyles,
    editLabelStyles,
    fieldColumnStyles,
    durationLabelStyles,
    durationInputStyles,
    numTextAreaRows,
} from "../../../constants/tailwindClasses";
import PaddedDurationDisplayWithLabels from "../../ui/PaddedDurationDisplayWithLabels";
import { number } from "prop-types";
import ReusableDetailsList from "../../layouts/ReusableDetailsList";

type ExerciseRowProps = {
    index: number;
    errors: any;
    viewingExerciseFieldIndex: number | null;
    setViewingExerciseFieldIndex: (
        fieldIndex: React.SetStateAction<number | null>
    ) => void;
    editingExerciseFieldIndex: number | null;
    setEditingExerciseFieldIndex: (
        fieldIndex: React.SetStateAction<number | null>
    ) => void;
    isExpanded: boolean;
    onSaveEdits: () => void;
    onRemove: (index: number) => void;
    onExpand: () => void;
    onEditModalClose: () => void;
    setValue: UseFormSetValue<SequenceFormInputs>;
};

const labelStyles = "block font-medium text-sm mb-1";
const textStyles = "text-sm";

export default function ExerciseRow({
    index,
    viewingExerciseFieldIndex,
    setViewingExerciseFieldIndex,
    editingExerciseFieldIndex,
    setEditingExerciseFieldIndex,
    onRemove,
    onSaveEdits,
    onEditModalClose,
    setValue,
}: ExerciseRowProps) {
    const { control, getValues, watch } = useFormContext<SequenceFormInputs>();
    const [backupExercise, setBackupExercise] = useState<Partial<
        SequenceFormInputs["exercises"][number]
    > | null>(null);

    const isEditing = index === editingExerciseFieldIndex;
    const isViewing = index === viewingExerciseFieldIndex;

    const { field: nameField, fieldState: nameError } = useController({
        name: `exercises.${index}.name`,
        control,
        rules: {
            required: "Name is required",
            maxLength: {
                value: 100,
                message: "Name must be 100 characters or fewer",
            },
        },
    });

    const { field: directionField, fieldState: directionError } = useController(
        {
            name: `exercises.${index}.direction`,
            control,
            rules: {
                maxLength: {
                    value: 100,
                    message: "Direction must be 100 characters or fewer",
                },
            },
        }
    );

    const { field: resistanceField, fieldState: resistanceError } =
        useController({
            name: `exercises.${index}.resistance`,
            control,
            rules: {
                maxLength: {
                    value: 100,
                    message: "Resistance must be 100 characters or fewer",
                },
            },
        });

    const { field: notesField, fieldState: notesError } = useController({
        name: `exercises.${index}.notes`,
        control,
        rules: {
            maxLength: {
                value: 500,
                message: "Notes must be 500 characters or fewer",
            },
        },
    });

    const {
        field: durationMinsField,
        fieldState: { error: durationMinsError },
    } = useController({
        name: `exercises.${index}.duration_mins`,
        control,
        rules: {
            min: { value: 0, message: "Minutes must be 0 or more" },
            max: { value: 99, message: "Minutes must be 99 or less" },
        },
    });

    const {
        field: durationSecsField,
        fieldState: { error: durationSecsError },
    } = useController({
        name: `exercises.${index}.duration_secs`,
        control,
        rules: {
            min: { value: 0, message: "Seconds must be 0 or more" },
            max: { value: 999, message: "Seconds must be 999 or less" },
        },
    });

    const singleFieldContainerStyles = `${
        isEditing ? "" : "px-2 md:p-2"
    } min-w-0 w-full`;

    const addMarginTopStyle = isEditing ? "mt-1 md:mt-0" : "mt-1 md:mt-0";

    const currentValues = getValues();
    const exercise = currentValues.exercises?.[index];
    if (!exercise) {
        return <div>Exercise not found</div>;
    }

    if (!currentValues.exercises || !currentValues.exercises[index])
        return null;

    const hasDuration = exerciseDataHasDuration(currentValues.exercises[index]);

    const handleEditExerciseClick = (fieldIndex: number) => {
        const exercise = getValues().exercises[fieldIndex];
        setBackupExercise({ ...exercise });
        setEditingExerciseFieldIndex(fieldIndex);
    };

    const handleViewExerciseClick = (fieldIndex: number) => {
        console.log(fieldIndex);
        setViewingExerciseFieldIndex(fieldIndex);
    };

    const handleCloseEditModal = () => {
        if (backupExercise) {
            const keysToRestore: (keyof typeof backupExercise)[] = [
                "name",
                "direction",
                "duration_mins",
                "duration_secs",
                "resistance",
                "notes",
            ];

            keysToRestore.forEach((key) => {
                setValue(`exercises.${index}.${key}`, backupExercise[key]);
            });
        }

        setBackupExercise(null);
        setEditingExerciseFieldIndex(null);
        onEditModalClose();
    };

    const displayExercise =
        isEditing && backupExercise
            ? backupExercise
            : currentValues.exercises[index];

    console.log(displayExercise);

    return (
        <div>
            <MainRow
                standardFields={[
                    "name",
                    "direction",
                    "duration",
                    "resistance",
                    "notes",
                ]}
                actionsFieldWidthStyle="w-[160px]"
                actionButtons={[
                    {
                        title: "View",
                        action: () => handleViewExerciseClick(index),
                    },
                    {
                        title: "Edit",
                        action: () => handleEditExerciseClick(index),
                    },
                    {
                        title: "Delete",
                        action: () => onRemove(index),
                    },
                ]}
                rowItem={displayExercise}
            />
            {isViewing && (
                <Modal
                    isOpen={isViewing}
                    onClose={() => setViewingExerciseFieldIndex(null)}
                    title={"Exercise Details"}
                    buttons={[
                        {
                            label: "Close",
                            onClick: () => setViewingExerciseFieldIndex(null),
                            variant: "secondary",
                        },
                    ]}
                >
                    <ReusableDetailsList
                        fields={[
                            "name",
                            "direction",
                            "duration",
                            "resistance",
                            "notes",
                        ]}
                        item={displayExercise}
                    />
                </Modal>
            )}
            {isEditing && (
                <Modal
                    title={"Edit your exercise."}
                    isOpen={isEditing}
                    onClose={handleCloseEditModal}
                    buttons={[
                        {
                            label: "Save",
                            onClick: onSaveEdits,
                            variant: "primary",
                        },
                        {
                            label: "Cancel",
                            onClick: handleCloseEditModal,
                            variant: "secondary",
                        },
                    ]}
                >
                    <div className="flex flex-col gap-y-2">
                        <div>
                            <label htmlFor="name" className={editLabelStyles}>
                                Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                {...nameField}
                                className={`${fullLengthInputStyles} block`}
                                placeholder="name"
                            />
                            {nameError.error?.message && (
                                <p className={errorMessageStyles}>
                                    {nameError.error.message}
                                </p>
                            )}
                        </div>

                        <div
                            className={`flex-1 ${fieldColumnStyles} ${singleFieldContainerStyles} ${addMarginTopStyle}`}
                        >
                            <label className={editLabelStyles}>Direction</label>
                            <input
                                {...directionField}
                                className={`${fullLengthInputStyles} block`}
                                placeholder="direction"
                            />
                            {directionError.error?.message && (
                                <p className={errorMessageStyles}>
                                    {directionError.error.message}
                                </p>
                            )}
                        </div>

                        <div
                            className={`flex-1 ${singleFieldContainerStyles} ${addMarginTopStyle}
                       ${
                           //    !isEditing && !hasDuration
                           !hasDuration
                               ? "block md:block hidden" // hide entire div at small screens if no value
                               : ""
                       }
                      
                      
                      `}
                        >
                            <label className={editLabelStyles}>Duration</label>
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
                                            type="number"
                                            min="0"
                                            max="99"
                                            value={durationMinsField.value}
                                            onChange={(e) => {
                                                const rawValue = e.target.value;
                                                console.log(rawValue);

                                                durationMinsField.onChange(
                                                    rawValue === "" ||
                                                        rawValue === null ||
                                                        rawValue === undefined
                                                        ? undefined
                                                        : isNaN(
                                                              Number(rawValue)
                                                          )
                                                        ? undefined
                                                        : Number(rawValue)
                                                );
                                            }}
                                            ref={durationMinsField.ref}
                                            className={durationInputStyles}
                                        />
                                    </div>
                                    {durationMinsError?.message && (
                                        <span className={errorMessageStyles}>
                                            {durationMinsError.message}
                                        </span>
                                    )}
                                </div>

                                <div className="text-sm ">:</div>

                                <div className="ml-1">
                                    <label
                                        htmlFor="durationSeconds"
                                        className={"text-gray-500 text-[10px]"}
                                    >
                                        Sec
                                    </label>
                                    <div>
                                        <input
                                            type="number"
                                            min="0"
                                            max="999"
                                            value={durationSecsField.value}
                                            onChange={(e) => {
                                                const rawValue = e.target.value;
                                                console.log(rawValue);

                                                durationSecsField.onChange(
                                                    rawValue === "" ||
                                                        rawValue === null ||
                                                        rawValue === undefined
                                                        ? undefined
                                                        : isNaN(
                                                              Number(rawValue)
                                                          )
                                                        ? undefined
                                                        : Number(rawValue)
                                                );
                                            }}
                                            ref={durationMinsField.ref}
                                            className={durationInputStyles}
                                        />
                                    </div>
                                    {durationSecsError?.message && (
                                        <span className={errorMessageStyles}>
                                            {durationSecsError.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div
                            className={`flex-1 ${fieldColumnStyles} ${singleFieldContainerStyles} ${addMarginTopStyle}`}
                        >
                            <label className={editLabelStyles}>
                                Resistance
                            </label>
                            <input
                                {...resistanceField}
                                className={`${fullLengthInputStyles} block`}
                                placeholder="resistance"
                            />
                            {resistanceError.error?.message && (
                                <p className={errorMessageStyles}>
                                    {resistanceError.error.message}
                                </p>
                            )}
                        </div>

                        <div
                            className={`flex-1 ${fieldColumnStyles} ${singleFieldContainerStyles} ${addMarginTopStyle}
              `}
                        >
                            <label className={`${editLabelStyles}`}>
                                Notes
                            </label>
                            <textarea
                                {...notesField}
                                rows={numTextAreaRows}
                                className={`${fullLengthInputStyles}`}
                                placeholder="notes"
                            />

                            {notesError.error?.message && (
                                <p className={errorMessageStyles}>
                                    {notesError.error.message}
                                </p>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
