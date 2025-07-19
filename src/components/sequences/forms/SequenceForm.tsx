import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import {
    useForm,
    FormProvider,
    useFieldArray,
    SubmitHandler,
} from "react-hook-form";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";

import ExerciseRow from "./ExerciseRow";
import FavoriteExercisesDropdown from "./FavoriteExercisesDropdown";
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

import { prepareAndAppendExerciseToForm } from "../../../utils/formHelpers";

import { splitDuration } from "../../../utils/timeHelpers";
import { useNavigate } from "react-router-dom";
import { GenericExerciseForm } from "../../favorite-exercises/GenericExerciseForm";
import { genericExerciseFormFieldConfigs } from "../../../constants/exerciseFormFields";
import ReusableDetailsList from "../../layouts/ReusableDetailsList";

type Props = {
    title: string;
    formId: string;
    onSubmit: SubmitHandler<SequenceFormInputs>;
    editSequence?: Sequence;
};

export default function SequenceForm({
    formId,
    onSubmit,
    editSequence,
}: Props) {
    const [backupSequence, setBackupSequence] =
        useState<SequenceFormInputs | null>(null);

    const [addNewExerciseModalIsOpen, setAddNewExerciseModalIsOpen] =
        useState<boolean>(false);
    const [editExerciseModalIsOpen, setEditExerciseModalIsOpen] =
        useState<boolean>(false);
    const [viewExerciseModalIsOpen, setViewExerciseModalIsOpen] =
        useState<boolean>(false);
    const [
        addFromFavoriteExercisesModalIsOpen,
        setAddFromFavoriteExercisesModalIsOpen,
    ] = useState<boolean>(false);

    const [editingExerciseFieldIndex, setEditingExerciseFieldIndex] = useState<
        number | null
    >(null);
    const [viewingExerciseFieldIndex, setViewingExerciseFieldIndex] = useState<
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

    // SEQUENCE FORM

    const formInitialInputs = editSequence
        ? {
              name: editSequence.name,
              description: editSequence.description,
              notes: editSequence.notes,
              exercises: editSequence.exercises.map((exercise) => {
                  return prepareInitialExercise(exercise);
              }),
          }
        : blankSequenceFormInputs;

    const sequenceFormMethods = useForm<SequenceFormInputs>({
        defaultValues: formInitialInputs,
    });

    const { control } = sequenceFormMethods;

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "exercises",
    });

    // useEffect to INITIALIZE AND BACKUP EDIT SEQUENCE FORM

    useEffect(() => {
        if (editSequence) {
            const initial: SequenceFormInputs = {
                name: editSequence.name,
                description: editSequence.description,
                notes: editSequence.notes,
                exercises: editSequence.exercises.map(prepareInitialExercise),
            };
            sequenceFormMethods.reset(initial); // Also sets form value5s
            setBackupSequence(initial);
        } else {
            sequenceFormMethods.reset(blankSequenceFormInputs);
            setBackupSequence(null);
        }
    }, [editSequence, sequenceFormMethods.reset]);

    // CREATE EXERCISE FORM

    const newExerciseFormMethods = useForm<ExerciseInputs>({
        defaultValues: blankNewExerciseInputs,
    });

    // EDIT EXERCISE FORM

    const isEditing = editingExerciseFieldIndex !== null;
    const editItem = isEditing
        ? sequenceFormMethods.getValues().exercises[editingExerciseFieldIndex]
        : null;

    const editExerciseInitialValues = editItem
        ? {
              name: editItem.name,
              direction: editItem.direction,
              duration_mins: editItem.duration_mins,
              duration_secs: editItem.duration_secs,
              resistance: editItem.resistance,
              notes: editItem.notes,
          }
        : undefined;

    const editExerciseFormMethods = useForm<ExerciseInputs>({
        defaultValues: editExerciseInitialValues,
    });

    // useEffect to INITIALIZE EDIT EXERCISE FORM

    useEffect(() => {
        if (editingExerciseFieldIndex !== null) {
            const editItem =
                sequenceFormMethods.getValues().exercises[
                    editingExerciseFieldIndex
                ];
            if (editItem) {
                const values = {
                    name: editItem.name,
                    direction: editItem.direction,
                    duration_mins: editItem.duration_mins,
                    duration_secs: editItem.duration_secs,
                    resistance: editItem.resistance,
                    notes: editItem.notes,
                };
                editExerciseFormMethods.reset(values);
            }
        }
    }, [editingExerciseFieldIndex, editExerciseFormMethods]);

    const onSequenceFormCancel = () => {
        if (backupSequence) {
            sequenceFormMethods.reset(backupSequence);
        } else sequenceFormMethods.reset(blankSequenceFormInputs);
        navigate("/sequences");
    };

    // MODAL CLOSE HANDLERS

    const handleCreateExerciseModalClose = () => {
        setAddNewExerciseModalIsOpen(false);
        newExerciseFormMethods.reset(blankNewExerciseInputs);
    };

    const handleAddFromFavoritesModalClose = () => {
        setAddFromFavoriteExercisesModalIsOpen(false);
    };

    const handleViewExerciseModalClose = () => {
        setViewExerciseModalIsOpen(false);
        setViewingExerciseFieldIndex(null);
    };

    const handleEditExerciseModalClose = () => {
        setEditExerciseModalIsOpen(false);
        setEditingExerciseFieldIndex(null);
    };

    // SUBMIT HANDLERS

    const handleNewExerciseSubmit = (data: ExerciseInputs) => {
        prepareAndAppendExerciseToForm(data, append);
        newExerciseFormMethods.reset(blankNewExerciseInputs);
        setAddNewExerciseModalIsOpen(false);
    };

    const handleAddFavoriteExercise = (
        newFavExerciseInputs: ExerciseInputs
    ) => {
        prepareAndAppendExerciseToForm(newFavExerciseInputs, append);
        setAddFromFavoriteExercisesModalIsOpen(false);
    };

    const handleEditExerciseSubmit = (data: ExerciseInputs) => {
        if (editingExerciseFieldIndex !== null) {
            // Update the specific exercise in the form
            const currentExercises = sequenceFormMethods.getValues().exercises;
            const updatedExercise = {
                ...currentExercises[editingExerciseFieldIndex],
                ...data,
                // Convert duration back to total seconds if needed
                duration_secs: data.duration_mins
                    ? data.duration_mins * 60 + (data.duration_secs || 0)
                    : data.duration_secs,
            };

            sequenceFormMethods.setValue(
                `exercises.${editingExerciseFieldIndex}`,
                updatedExercise
            );
            sequenceFormMethods.trigger(
                `exercises.${editingExerciseFieldIndex}`
            );

            setEditExerciseModalIsOpen(false);
            setEditingExerciseFieldIndex(null);
        }
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        move(result.source.index, result.destination.index);
    };

    const navigate = useNavigate();

    return (
        <div>
            {/* SEQUENCE FORM */}
            <FormProvider {...sequenceFormMethods}>
                <form
                    id={formId}
                    onSubmit={sequenceFormMethods.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div>
                        <label
                            htmlFor="name"
                            className={`text-white ${labelStyles}`}
                        >
                            Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            {...sequenceFormMethods.register("name", {
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
                        {sequenceFormMethods.formState.errors.name && (
                            <p className={errorMessageStyles}>
                                {
                                    sequenceFormMethods.formState.errors.name
                                        .message
                                }
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className={`text-white ${labelStyles}`}
                        >
                            Description
                        </label>
                        <input
                            id="description"
                            {...sequenceFormMethods.register("description", {
                                maxLength: {
                                    value: 100,
                                    message:
                                        "Description must be 100 characters or fewer",
                                },
                            })}
                            className={inputStyles}
                            placeholder="ex. glutes-focused"
                        />
                        {sequenceFormMethods.formState.errors.description && (
                            <p className={errorMessageStyles}>
                                {
                                    sequenceFormMethods.formState.errors
                                        .description.message
                                }
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="notes"
                            className={`text-white ${labelStyles}`}
                        >
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            {...sequenceFormMethods.register("notes", {
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
                        {sequenceFormMethods.formState.errors.notes && (
                            <p className={errorMessageStyles}>
                                {
                                    sequenceFormMethods.formState.errors.notes
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <div className={`text-white ${labelStyles}`}>
                            Exercises
                        </div>
                        <div className="flex flex-row gap-2">
                            <IconButton
                                onClick={() =>
                                    setAddNewExerciseModalIsOpen(true)
                                }
                                icon={<FiPlus size={16} />}
                                className={`bg-mt-green ${addExerciseButtonStyles}`}
                            >
                                Add New
                            </IconButton>
                            <IconButton
                                onClick={() =>
                                    setAddFromFavoriteExercisesModalIsOpen(true)
                                }
                                icon={<FiPlus size={16} />}
                                className={`bg-mt-green ${addExerciseButtonStyles}`}
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
                                                                            setViewingExerciseFieldIndex={
                                                                                setViewingExerciseFieldIndex
                                                                            }
                                                                            setEditingExerciseFieldIndex={
                                                                                setEditingExerciseFieldIndex
                                                                            }
                                                                            setEditExerciseModalIsOpen={
                                                                                setEditExerciseModalIsOpen
                                                                            }
                                                                            setViewExerciseModalIsOpen={
                                                                                setViewExerciseModalIsOpen
                                                                            }
                                                                            onRemove={() =>
                                                                                remove(
                                                                                    fieldIndex
                                                                                )
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
                {/* SEQUENCE FORM ACTIONS */}
                <div className="mt-8 flex flex-row gap-x-2">
                    <button
                        type="submit"
                        form={formId}
                        className="bg-blue-600 text-white font-extrabold px-4 py-2 rounded"
                        disabled={sequenceFormMethods.formState.isSubmitting}
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
            {/* ADD NEW EXERCISE MODAL */}
            <Modal
                isOpen={addNewExerciseModalIsOpen}
                onClose={handleCreateExerciseModalClose}
                title="Add a new exercise to the sequence."
                buttons={[
                    {
                        label: "Add",
                        onClick: () => {}, // Empty onClick for submit buttons
                        variant: "primary",
                        type: "submit",
                        form: "new-exercise-form",
                        disabled: newExerciseFormMethods.formState.isSubmitting,
                    },
                    {
                        label: "Cancel",
                        onClick: handleCreateExerciseModalClose,
                        variant: "secondary",
                    },
                ]}
            >
                <FormProvider {...newExerciseFormMethods}>
                    <GenericExerciseForm
                        id="new-exercise-form"
                        onSubmit={newExerciseFormMethods.handleSubmit(
                            handleNewExerciseSubmit
                        )}
                        fieldConfigs={genericExerciseFormFieldConfigs}
                    />
                </FormProvider>
            </Modal>
            {/* ADD FROM FAVORITES MODAL */}
            <Modal
                isOpen={addFromFavoriteExercisesModalIsOpen}
                onClose={handleAddFromFavoritesModalClose}
                title={"Add a favorite exercise to the sequence."}
                buttons={[
                    {
                        label: "Cancel",
                        onClick: handleAddFromFavoritesModalClose,
                        variant: "secondary",
                    },
                ]}
            >
                <FavoriteExercisesDropdown
                    handleAddFavoriteExercise={handleAddFavoriteExercise}
                />
            </Modal>
            {/* EDIT EXERCISE MODAL */}
            <Modal
                isOpen={editExerciseModalIsOpen}
                onClose={handleEditExerciseModalClose}
                title="Edit your exercise."
                buttons={[
                    {
                        label: "Save Changes",
                        onClick: () => {}, // Empty onClick for submit buttons
                        variant: "primary",
                        type: "submit",
                        form: "edit-exercise-form",
                        disabled:
                            editExerciseFormMethods.formState.isSubmitting,
                    },
                    {
                        label: "Cancel",
                        onClick: handleEditExerciseModalClose,
                        variant: "secondary",
                    },
                ]}
            >
                <FormProvider {...editExerciseFormMethods}>
                    <GenericExerciseForm
                        id="edit-exercise-form"
                        onSubmit={editExerciseFormMethods.handleSubmit(
                            handleEditExerciseSubmit
                        )}
                        fieldConfigs={genericExerciseFormFieldConfigs}
                    />
                </FormProvider>
            </Modal>
            {/* VIEW EXERCISE MODAL */}
            <Modal
                isOpen={
                    viewExerciseModalIsOpen &&
                    viewingExerciseFieldIndex !== null
                }
                onClose={handleViewExerciseModalClose}
                title="Exercise Details"
                buttons={[
                    {
                        label: "Close",
                        onClick: handleViewExerciseModalClose,
                        variant: "secondary",
                    },
                ]}
            >
                <ReusableDetailsList
                    item={
                        sequenceFormMethods.getValues().exercises[
                            viewingExerciseFieldIndex!
                        ]
                    }
                    fields={[
                        "name",
                        "direction",
                        "duration",
                        "resistance",
                        "notes",
                    ]}
                />
            </Modal>
        </div>
    );
}
