import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import {
    useForm,
    FormProvider,
    useFieldArray,
    SubmitHandler,
    RegisterOptions,
} from "react-hook-form";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";

import ExerciseRow from "../sequences/forms/ExerciseRow";
import FavoriteExercisesDropdown from "../sequences/forms/FavoriteExercisesDropdown";
import { IconButton } from "../ui/IconButton";
import Modal from "../layouts/Modal";
import { IoMdBulb } from "react-icons/io";
import {
    ExerciseInputs,
    FieldConfig,
    Sequence,
    SequenceFormInputs,
} from "../../constants/types";
import {
    actionFieldContainerStyles,
    actionsFieldWidthStyle,
    allMainRowsContainerStyles,
    commonFlexRowStyles,
    commonPaddingXForHeaderContainerAndMainRow,
    errorMessageStyles,
    formTextInputStyles,
    commonLabelStyles,
    headerRowTextStyles,
    rightMarginSameWidthAsScrollbarStyle,
    standardFieldContainerStyles,
    createNewButtonStyles,
    sequenceExercisesListContainerStyles,
    formFieldsFlexColStyles,
    responsiveTextStyles,
    formTextAreaInputStyles,
} from "../../constants/tailwindClasses";

import {
    blankExerciseFormInputs,
    blankSequenceFormInputs,
} from "../../constants/initialFormInputs";

import {
    getInitialEditSequenceFormValues,
    normalizeDurationsIfAnyInExerciseData,
} from "../../utils/formHelpers";

import { useNavigate } from "react-router-dom";
import { ExerciseForm } from "./ExerciseForm";
import {
    exerciseFormFieldConfigs,
    sequenceFormFieldConfigs,
} from "../../constants/formFieldConfigs";
import ItemFieldsList from "../layouts/ItemFieldsList";

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

    // SEQUENCE FORM
    const formInitialInputs = editSequence
        ? getInitialEditSequenceFormValues(editSequence)
        : blankSequenceFormInputs;
    const sequenceFormMethods = useForm<SequenceFormInputs>({
        defaultValues: formInitialInputs,
        mode: "onSubmit", // only validate on submit
        reValidateMode: "onChange",
    });
    const { control } = sequenceFormMethods;
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "exercises",
    });

    // CREATE EXERCISE FORM
    const newExerciseFormMethods = useForm<ExerciseInputs>({
        defaultValues: blankExerciseFormInputs,
        mode: "onSubmit", // only validate on submit
        reValidateMode: "onChange",
    });

    // EDIT EXERCISE FORM

    const editExerciseInitialValues =
        editingExerciseFieldIndex !== null
            ? sequenceFormMethods.getValues().exercises[
                  editingExerciseFieldIndex
              ]
            : undefined;

    const editExerciseFormMethods = useForm<ExerciseInputs>({
        defaultValues: editExerciseInitialValues,
        mode: "onSubmit", // only validate on submit
        reValidateMode: "onChange",
    });

    useEffect(() => {
        if (editingExerciseFieldIndex !== null) {
            editExerciseFormMethods.reset(editExerciseInitialValues);
        }
    }, [editingExerciseFieldIndex]);

    // FORM SUBMIT HANDLERS

    const handleNewExerciseSubmit = (data: ExerciseInputs) => {
        const normalizedData = normalizeDurationsIfAnyInExerciseData(data);
        append(normalizedData);
        setAddNewExerciseModalIsOpen(false);
        newExerciseFormMethods.reset(blankExerciseFormInputs); // reset the new exercise form
    };

    const handleAddFavoriteExercise = (data: ExerciseInputs) => {
        const normalizedData = normalizeDurationsIfAnyInExerciseData(data);
        append(normalizedData);
        setAddFromFavoriteExercisesModalIsOpen(false);
    };

    const handleEditExerciseSubmit = (data: ExerciseInputs) => {
        const normalizedData = normalizeDurationsIfAnyInExerciseData(data);
        sequenceFormMethods.setValue(
            `exercises.${editingExerciseFieldIndex!}`,
            normalizedData
        ); // update the specific exercise in the overall sequence form
        setEditExerciseModalIsOpen(false);
        setEditingExerciseFieldIndex(null);
    };

    // FORM CANCEL
    const navigate = useNavigate();
    const onSequenceFormCancel = () => {
        navigate("/sequences");
    };

    // MODAL CLOSE HANDLERS

    const onAddNewExerciseModalClose = () => {
        setAddNewExerciseModalIsOpen(false);
        newExerciseFormMethods.reset(blankExerciseFormInputs);
    };

    const onAddFromFavoritesModalClose = () => {
        setAddFromFavoriteExercisesModalIsOpen(false);
    };

    const onEditExerciseModalClose = () => {
        setEditExerciseModalIsOpen(false);
        setEditingExerciseFieldIndex(null);
    };

    const onViewExerciseModalClose = () => {
        setViewExerciseModalIsOpen(false);
        setViewingExerciseFieldIndex(null);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        move(result.source.index, result.destination.index);
    };

    const standardFields = [
        "Name",
        "Direction",
        "Duration",
        "Resistance",
        "Notes",
    ];
    const standardFieldsDivs = standardFields.map((field) => {
        const isUpdatedField = field === "updated_at";
        const isCreatedField = field === "created_at";

        return (
            <div
                className={`capitalize ${standardFieldContainerStyles} ${headerRowTextStyles}`}
            >
                {isCreatedField
                    ? "Created"
                    : isUpdatedField
                    ? "Updated"
                    : field}
            </div>
        );
    });

    const renderFormField = (fc: FieldConfig) => {
        const error =
            sequenceFormMethods.formState.errors[
                fc.name as keyof SequenceFormInputs
            ];

        return (
            <div key={fc.name}>
                <label
                    htmlFor={fc.name}
                    className={`text-my-fg ${commonLabelStyles}`}
                >
                    {fc.label}
                    {fc.rules?.required && (
                        <span className="text-my-red">*</span>
                    )}
                </label>

                {fc.type === "textarea" ? (
                    <textarea
                        id={fc.name}
                        {...sequenceFormMethods.register(
                            fc.name as keyof SequenceFormInputs,
                            fc.rules as RegisterOptions<
                                SequenceFormInputs,
                                keyof SequenceFormInputs
                            >
                        )}
                        rows={fc.rows || 3}
                        className={`${formTextAreaInputStyles} text-my-yellow border-b-my-fg`}
                        placeholder={fc.placeholder}
                    />
                ) : (
                    <input
                        id={fc.name}
                        {...sequenceFormMethods.register(
                            fc.name as keyof SequenceFormInputs,
                            fc.rules as RegisterOptions<
                                SequenceFormInputs,
                                keyof SequenceFormInputs
                            >
                        )}
                        className={`text-my-yellow border-b-my-fg ${formTextInputStyles}`}
                        placeholder={fc.placeholder}
                    />
                )}

                {error && <p className={errorMessageStyles}>{error.message}</p>}
            </div>
        );
    };

    return (
        <div className="h-full">
            {/* SEQUENCE FORM */}
            <FormProvider {...sequenceFormMethods}>
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto flex flex-col">
                        <form
                            id={formId}
                            onSubmit={sequenceFormMethods.handleSubmit(
                                onSubmit
                            )}
                            className={`flex-1 flex flex-col overflow-y-auto px-4 ${responsiveTextStyles}`}
                        >
                            <div className={formFieldsFlexColStyles}>
                                {sequenceFormFieldConfigs.map(renderFormField)}

                                <div className="flex flex-col gap-y-1 flex-1">
                                    <div
                                        className={`text-my-fg ${commonLabelStyles}`}
                                    >
                                        Exercises
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <IconButton
                                            onClick={() =>
                                                setAddNewExerciseModalIsOpen(
                                                    true
                                                )
                                            }
                                            icon={<FiPlus size={16} />}
                                            className={`${createNewButtonStyles}`}
                                        >
                                            Add New
                                        </IconButton>
                                        <IconButton
                                            onClick={() =>
                                                setAddFromFavoriteExercisesModalIsOpen(
                                                    true
                                                )
                                            }
                                            icon={<FiPlus size={16} />}
                                            className={`${createNewButtonStyles}`}
                                        >
                                            Add from Favorites
                                        </IconButton>
                                    </div>

                                    {fields.length === 0 ? (
                                        <div className="text-gray-400 text-sm mt-2">
                                            No exercises have been added to the
                                            sequence.
                                        </div>
                                    ) : (
                                        <div
                                            id="sequenceExercisesListContainer"
                                            className={
                                                sequenceExercisesListContainerStyles
                                            }
                                        >
                                            {fields.length > 1 && (
                                                <div className="text-xs text-mt-yellow flex gap-x-1 my-1">
                                                    <IoMdBulb size={14} />{" "}
                                                    <span>
                                                        {" "}
                                                        Exercises in the
                                                        sequence can be
                                                        reordered by dragging
                                                        and dropping
                                                    </span>
                                                </div>
                                            )}
                                            {/* Exercises List Header Row */}
                                            <div
                                                className={`hidden md:block bg-my-yellow rounded-xl py-2`}
                                            >
                                                <div
                                                    id="headerRowContainer"
                                                    className={`${commonPaddingXForHeaderContainerAndMainRow} ${rightMarginSameWidthAsScrollbarStyle} ${commonFlexRowStyles}`}
                                                >
                                                    {standardFieldsDivs}
                                                    <div
                                                        className={`${actionFieldContainerStyles} ${actionsFieldWidthStyle} ${headerRowTextStyles}`}
                                                    >
                                                        Actions
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Exercises List DND Main Rows */}
                                            <DragDropContext
                                                onDragEnd={onDragEnd}
                                            >
                                                <Droppable droppableId="list">
                                                    {(provided) => (
                                                        <div
                                                            id="sequenceExercisesListDroppableContainer"
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.droppableProps}
                                                            className={`${allMainRowsContainerStyles} mt-2`}
                                                        >
                                                            {fields.map(
                                                                (
                                                                    field,
                                                                    fieldIndex
                                                                ) => {
                                                                    return (
                                                                        <Draggable
                                                                            key={
                                                                                field.id
                                                                            }
                                                                            draggableId={
                                                                                field.id
                                                                            }
                                                                            index={
                                                                                fieldIndex
                                                                            }
                                                                        >
                                                                            {(
                                                                                provided
                                                                            ) => (
                                                                                <div
                                                                                    ref={
                                                                                        provided.innerRef
                                                                                    }
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
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
                                                            {
                                                                provided.placeholder
                                                            }
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </DragDropContext>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* SEQUENCE FORM ACTIONS */}
                    <div className="mt-6 mb-10 flex flex-row gap-x-2 justify-center">
                        <button
                            type="submit"
                            form={formId}
                            className="bg-mt-yellow hover:bg-gb-yellow font-extrabold px-4 py-2 rounded"
                            disabled={
                                sequenceFormMethods.formState.isSubmitting
                            }
                        >
                            <text className={"uppercase text-xl"}>Submit</text>
                        </button>
                        <button
                            type="button"
                            onClick={onSequenceFormCancel}
                            className="bg-gray-300 text-black px-4 py-2 rounded font-extrabold"
                        >
                            <text className={"uppercase text-xl"}>Cancel</text>
                        </button>
                    </div>
                </div>
            </FormProvider>
            {/* MODALS */}
            {/* ADD NEW EXERCISE MODAL */}
            <Modal
                isOpen={addNewExerciseModalIsOpen}
                onClose={onAddNewExerciseModalClose}
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
                        onClick: onAddNewExerciseModalClose,
                        variant: "secondary",
                    },
                ]}
            >
                <FormProvider {...newExerciseFormMethods}>
                    <ExerciseForm
                        id="new-exercise-form"
                        onSubmit={newExerciseFormMethods.handleSubmit(
                            handleNewExerciseSubmit
                        )}
                        fieldConfigs={exerciseFormFieldConfigs}
                    />
                </FormProvider>
            </Modal>
            {/* ADD FROM FAVORITES MODAL */}
            <Modal
                isOpen={addFromFavoriteExercisesModalIsOpen}
                onClose={onAddFromFavoritesModalClose}
                title={"Add a favorite exercise to the sequence."}
                buttons={[
                    {
                        label: "Cancel",
                        onClick: onAddFromFavoritesModalClose,
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
                onClose={onEditExerciseModalClose}
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
                        onClick: onEditExerciseModalClose,
                        variant: "secondary",
                    },
                ]}
            >
                <FormProvider {...editExerciseFormMethods}>
                    <ExerciseForm
                        id="edit-exercise-form"
                        onSubmit={editExerciseFormMethods.handleSubmit(
                            handleEditExerciseSubmit
                        )}
                        fieldConfigs={exerciseFormFieldConfigs}
                    />
                </FormProvider>
            </Modal>
            {/* VIEW EXERCISE MODAL */}
            <Modal
                isOpen={
                    viewExerciseModalIsOpen &&
                    viewingExerciseFieldIndex !== null
                }
                onClose={onViewExerciseModalClose}
                title="Exercise Details"
                buttons={[
                    {
                        label: "Close",
                        onClick: onViewExerciseModalClose,
                        variant: "secondary",
                    },
                ]}
            >
                <ItemFieldsList
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
                    textStyles="font-semibold text-gb-bg"
                    labelStyles="font-extrabold text-hmt-dark-option4"
                />
            </Modal>
        </div>
    );
}
