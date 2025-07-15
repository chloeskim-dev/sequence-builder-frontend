import React, { useState, useEffect } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import {
    useForm,
    FormProvider,
    useFieldArray,
    SubmitHandler,
    UseFormGetValues,
    UseFormTrigger,
    UseFormSetValue,
} from "react-hook-form";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";

import ExerciseRow from "./ExerciseRow";
import FavoriteExercisesDropdown from "./FavoriteExercisesDropdown";
import NewExerciseInputsRow from "./NewExerciseInputsRow";
import { IconButton } from "../../ui/IconButton";
import Modal from "../../layouts/Modal";
import { HeaderRow } from "../../layouts/ReusableTable";

import {
    Exercise,
    ExerciseInputs,
    Sequence,
    SequenceFormInputs,
} from "../../../constants/types";
import {
    allMainRowsContainerStyles,
    errorMessageStyles,
} from "../../../constants/tailwindClasses";

import {
    blankNewExerciseInputs,
    blankSequenceFormInputs,
} from "../../../constants/initialFormInputs";
import {
    addExerciseButtonStyles,
    labelStyles,
    inputStyles,
    sequenceExercisesListContainerStyles,
} from "../../../constants/tailwindClasses";

import {
    editExerciseFieldArray,
    prepareAndAppendExerciseToForm,
} from "../../../utils/formHelpers";

import { useUser } from "../../../contexts/UserContext";
import { splitDuration } from "../../../utils/timeHelpers";
import { useNavigate } from "react-router-dom";

type Props = {
    title: string;
    formId: string;
    onSubmit: SubmitHandler<SequenceFormInputs>;
    editItem?: Sequence;
};

export default function SequenceForm({ formId, onSubmit, editItem }: Props) {
    const [addNewExerciseModalIsOpen, setAddNewExerciseModalIsOpen] =
        useState<boolean>(false);
    const [
        addFromFavoriteExercisesModalIsOpen,
        setAddFromFavoriteExercisesModalIsOpen,
    ] = useState<boolean>(false);

    const [backupSequence, setBackupSequence] =
        useState<SequenceFormInputs | null>(null);

    const [showAddNewExerciseRowErrors, setShowAddNewExerciseRowErrors] =
        useState(false);
    const [newExerciseInputs, setNewExerciseInputs] = useState<ExerciseInputs>(
        blankNewExerciseInputs
    );
    const [editingExerciseId, setEditingExerciseId] = useState<string | null>(
        null
    );
    const [editingExerciseFieldIndex, setEditingExerciseFieldIndex] = useState<
        number | null
    >(null);
    const [viewingExerciseFieldIndex, setViewingExerciseFieldIndex] = useState<
        number | null
    >(null);

    const [expandedExerciseIndex, setExpandedExerciseIndex] = useState<
        number | null
    >(null);

    const prepareInitialExercise = (exercise: Exercise) => {
        const initialDurations = exercise.duration_secs
            ? splitDuration(exercise.duration_secs)
            : undefined;

        return {
            ...exercise,
            ...(initialDurations && {
                duration_mins: initialDurations.splitMinutes,
            }),
            ...(initialDurations && {
                duration_secs: initialDurations.splitSeconds,
            }),
        };
    };

    const formInitialInputs = editItem
        ? {
              name: editItem.name,
              description: editItem.description,
              notes: editItem.notes,
              exercises: editItem.exercises.map((exercise) => {
                  return prepareInitialExercise(exercise);
              }),
          }
        : blankSequenceFormInputs;

    const methods = useForm<SequenceFormInputs>({
        defaultValues: formInitialInputs,
    });

    const {
        control,
        getValues,
        setValue,
        handleSubmit,
        register,
        reset,
        trigger,
        formState: { errors, isSubmitting },
    } = methods;

    useEffect(() => {
        if (editItem) {
            const initial: SequenceFormInputs = {
                name: editItem.name,
                description: editItem.description,
                notes: editItem.notes,
                exercises: editItem.exercises.map(prepareInitialExercise),
            };
            reset(initial); // Also sets form value5s
            setBackupSequence(initial);
        } else {
            reset(blankSequenceFormInputs);
            setBackupSequence(null);
        }
    }, [editItem, reset]);

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "exercises",
    });

    const resetAddNewExerciseRow = () => {
        setNewExerciseInputs(blankNewExerciseInputs);
    };

    const handleAddNewExerciseOptionClick = () => {
        setAddFromFavoriteExercisesModalIsOpen(false);
        setAddNewExerciseModalIsOpen(!addNewExerciseModalIsOpen);
    };

    const handleAddFromFavoriteExercisesOptionClick = () => {
        setAddNewExerciseModalIsOpen(false);
        setAddFromFavoriteExercisesModalIsOpen(
            !addFromFavoriteExercisesModalIsOpen
        );
    };

    const handleAddNewExercise = () => {
        if (newExerciseInputs.name === "") {
            setShowAddNewExerciseRowErrors(true);
            return;
        }
        setShowAddNewExerciseRowErrors(false);
        prepareAndAppendExerciseToForm(newExerciseInputs, append);
        setAddNewExerciseModalIsOpen(false);
        resetAddNewExerciseRow();
    };

    const cancelAddNewExercise = () => {
        setShowAddNewExerciseRowErrors(false);
        setAddNewExerciseModalIsOpen(false);
        resetAddNewExerciseRow();
    };

    const handleAddFavoriteExercise = (
        newFavExerciseInputs: ExerciseInputs
    ) => {
        prepareAndAppendExerciseToForm(newFavExerciseInputs, append);
        setAddFromFavoriteExercisesModalIsOpen(false);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        move(result.source.index, result.destination.index);
    };

    const onExpandRow = (index: number) => {
        setExpandedExerciseIndex(expandedExerciseIndex == index ? null : index);
    };

    const navigate = useNavigate();

    const onSequenceFormCancel = () => {
        if (backupSequence) {
            reset(backupSequence);
        } else reset(blankSequenceFormInputs);
        navigate("/sequences");
    };

    const handleModalClose = () => {
        setAddFromFavoriteExercisesModalIsOpen(false);
        setAddNewExerciseModalIsOpen(false);
        setExpandedExerciseIndex(null);
        setEditingExerciseId(null);
        resetAddNewExerciseRow();
    };

    type onSaveExerciseEditsArgs = {
        fieldIndex: number;
        getValues: UseFormGetValues<SequenceFormInputs>;
        setValue: UseFormSetValue<SequenceFormInputs>;
        trigger: UseFormTrigger<SequenceFormInputs>;
        setEditingExerciseFieldIndex: React.Dispatch<
            React.SetStateAction<number | null>
        >;
    };

    const onSaveExerciseEdits = (args: onSaveExerciseEditsArgs) => {
        setEditingExerciseFieldIndex(args.fieldIndex);
        editExerciseFieldArray(args);
        setExpandedExerciseIndex(null);
    };

    const onEditExerciseModalClose = () => {
        setEditingExerciseFieldIndex(null);
    };

    return (
        <div>
            <FormProvider {...methods}>
                <form
                    id={formId}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
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
                                    message:
                                        "Name must be 100 characters or fewer",
                                },
                            })}
                            className={inputStyles}
                            placeholder="ex. club pilates monday 9am class"
                        />
                        {errors.name && (
                            <p className={errorMessageStyles}>
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="description" className={labelStyles}>
                            Description
                        </label>
                        <input
                            id="description"
                            {...register("description", {
                                maxLength: {
                                    value: 100,
                                    message:
                                        "Description must be 100 characters or fewer",
                                },
                            })}
                            className={inputStyles}
                            placeholder="ex. glutes-focused"
                        />
                        {errors.description && (
                            <p className={errorMessageStyles}>
                                {errors.description.message}
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
                            rows={2}
                            className={inputStyles}
                            placeholder="ex. Need resistance bands."
                        ></textarea>
                        {errors.notes && (
                            <p className={errorMessageStyles}>
                                {errors.notes.message}
                            </p>
                        )}
                    </div>

                    <Modal
                        isOpen={addNewExerciseModalIsOpen}
                        onClose={handleModalClose}
                        title={"Add a new exercise to the sequence."}
                        buttons={[
                            {
                                label: "Add",
                                onClick: handleAddNewExercise,
                                variant: "primary",
                            },
                            {
                                label: "Cancel",
                                onClick: handleModalClose,
                                variant: "secondary",
                            },
                        ]}
                    >
                        <div>
                            <NewExerciseInputsRow
                                newExerciseInputs={newExerciseInputs}
                                setNewExerciseInputs={setNewExerciseInputs}
                                handleAddNewExercise={handleAddNewExercise}
                                showAddNewExerciseRowErrors={
                                    showAddNewExerciseRowErrors
                                }
                                cancelAddNewExercise={cancelAddNewExercise}
                            />
                        </div>
                    </Modal>

                    <Modal
                        isOpen={addFromFavoriteExercisesModalIsOpen}
                        onClose={handleModalClose}
                        title={"Add a favorite exercise to the sequence."}
                        buttons={[
                            {
                                label: "Cancel",
                                onClick: handleModalClose,
                                variant: "secondary",
                            },
                        ]}
                    >
                        <FavoriteExercisesDropdown
                            handleAddFavoriteExercise={
                                handleAddFavoriteExercise
                            }
                        />
                    </Modal>

                    <div className="flex flex-col gap-y-1">
                        <div className="font-bold text-sm">Exercises</div>
                        <div className="flex flex-col md:flex-row gap-2">
                            <IconButton
                                onClick={handleAddNewExerciseOptionClick}
                                icon={<FiPlus size={16} />}
                                className={`bg-blue-600 ${addExerciseButtonStyles}`}
                            >
                                Add New
                            </IconButton>
                            <IconButton
                                onClick={
                                    handleAddFromFavoriteExercisesOptionClick
                                }
                                icon={<FiPlus size={16} />}
                                className={`bg-blue-600 ${addExerciseButtonStyles}`}
                            >
                                Add from Favorites
                            </IconButton>
                        </div>

                        {fields.length === 0 ? (
                            <div className="text-gray-400 text-sm mt-2">
                                No exercises have been added to the sequence.
                            </div>
                        ) : (
                            <div
                                id="sequenceExercisesListContainer"
                                className={sequenceExercisesListContainerStyles}
                            >
                                <div
                                    className={`hidden md:block bg-orange-300 rounded-xl py-2`}
                                >
                                    <HeaderRow
                                        standardFields={[
                                            "Name",
                                            "Direction",
                                            "Duration",
                                            "Resistance",
                                            "Notes",
                                        ]}
                                        actionsFieldWidthStyle="w-[160px]"
                                    />
                                </div>

                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="list">
                                        {(provided) => (
                                            <div
                                                id="sequenceExercisesListDroppableContainer"
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`${allMainRowsContainerStyles} mt-2`}
                                            >
                                                {fields.map(
                                                    (field, fieldIndex) => {
                                                        const isExpanded =
                                                            expandedExerciseIndex ===
                                                            fieldIndex;
                                                        return (
                                                            <Draggable
                                                                key={field.id}
                                                                draggableId={
                                                                    field.id
                                                                }
                                                                index={
                                                                    fieldIndex
                                                                }
                                                            >
                                                                {(provided) => (
                                                                    <div
                                                                        ref={
                                                                            provided.innerRef
                                                                        }
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={
                                                                            ""
                                                                        }
                                                                    >
                                                                        <ExerciseRow
                                                                            index={
                                                                                fieldIndex
                                                                            }
                                                                            errors={
                                                                                errors
                                                                            }
                                                                            viewingExerciseFieldIndex={
                                                                                viewingExerciseFieldIndex
                                                                            }
                                                                            setViewingExerciseFieldIndex={
                                                                                setViewingExerciseFieldIndex
                                                                            }
                                                                            editingExerciseFieldIndex={
                                                                                editingExerciseFieldIndex
                                                                            }
                                                                            setEditingExerciseFieldIndex={
                                                                                setEditingExerciseFieldIndex
                                                                            }
                                                                            isExpanded={
                                                                                isExpanded
                                                                            }
                                                                            onSaveEdits={() =>
                                                                                onSaveExerciseEdits(
                                                                                    {
                                                                                        fieldIndex,
                                                                                        getValues,
                                                                                        setValue,
                                                                                        trigger,
                                                                                        setEditingExerciseFieldIndex,
                                                                                    }
                                                                                )
                                                                            }
                                                                            onRemove={() =>
                                                                                remove(
                                                                                    fieldIndex
                                                                                )
                                                                            }
                                                                            onExpand={() =>
                                                                                onExpandRow(
                                                                                    fieldIndex
                                                                                )
                                                                            }
                                                                            onEditModalClose={
                                                                                onEditExerciseModalClose
                                                                            }
                                                                            setValue={
                                                                                setValue
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        );
                                                    }
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        )}
                    </div>
                </form>
                <div className="mt-8 flex flex-row gap-x-2">
                    <button
                        type="submit"
                        form={formId}
                        className="bg-blue-600 text-white font-extrabold px-4 py-2 rounded"
                        disabled={isSubmitting}
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={onSequenceFormCancel}
                        className="bg-gray-300 text-black px-4 py-2 rounded font-extrabold"
                    >
                        Cancel
                    </button>
                </div>
            </FormProvider>
        </div>
    );
}
