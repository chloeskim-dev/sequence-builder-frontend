import { SetStateAction, useState, useEffect } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";

import ExerciseRow from "./SequenceForms/ExerciseRow";
import FavoriteExercisesDropdown from "./SequenceForms/FavoriteExercisesDropdown";
import NewExerciseInputsRow from "./SequenceForms/NewExerciseInputsRow";
import { IconButton } from "../../components/ui/IconButton";
import Modal from "../../components/layouts/Modal";

import {
    ExerciseInputs,
    Sequence,
    SequenceFormInputs,
} from "../../constants/types";
import {
    blankNewExerciseInputs,
    blankSequenceFormInputs,
} from "../../constants/initialFormInputs";
import {
    addExerciseButtonStyles,
    labelStyles,
    inputStyles,
    sequenceExercisesListContainerStyles,
    sequenceExercisesListHeadRowStyles,
    sequenceExercisesListDroppableContainerStyles,
} from "../../constants/tailwindClasses";

import { api } from "../../utils/api";
import {
    handleToggleEditExercise,
    makeSequencePayloadFromFormData,
    prepareAndAppendExerciseToForm,
} from "../../utils/formHelpers";

import { useUser } from "../../contexts/UserContext";

type Props = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    setSequences: React.Dispatch<React.SetStateAction<Sequence[]>>;
    title: string;
    formId: string;
    // initialData: SequenceFormInputs;
    onSubmit: SubmitHandler<SequenceFormInputs>;
    editItem?: Sequence;
};

export default function SequencesFormModalBase({
    isModalOpen,
    setIsModalOpen,
    setSequences,
    title,
    formId,
    onSubmit,
    editItem,
}: Props) {
    const { user } = useUser();
    const userId = user?.id ?? null;
    const [showAddNewExerciseRow, setShowAddNewExerciseRow] =
        useState<boolean>(false);
    const [showAddNewExerciseRowErrors, setShowAddNewExerciseRowErrors] =
        useState(false);
    const [showFavoritesDropdown, setShowFavoritesDropdown] = useState(false);

    const [newExerciseInputs, setNewExerciseInputs] = useState<ExerciseInputs>(
        blankNewExerciseInputs
    );
    const [editingExerciseId, setEditingExerciseId] = useState<string | null>(
        null
    );

    const formInitialInputs = editItem
        ? {
              name: editItem.name,
              description: editItem.description,
              notes: editItem.notes,
              exercises: editItem.exercises,
          }
        : blankSequenceFormInputs;

    const {
        control,
        getValues,
        setValue,
        handleSubmit,
        register,
        reset,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<SequenceFormInputs>({
        defaultValues: formInitialInputs,
    });

    useEffect(() => {
        reset(formInitialInputs);
    }, [editItem, reset, isModalOpen]);

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "exercises",
    });

    const resetAddNewExerciseRow = () => {
        setNewExerciseInputs(blankNewExerciseInputs);
    };

    const handleAddNewExerciseOptionClick = () => {
        setShowFavoritesDropdown(false);
        setShowAddNewExerciseRow(!showAddNewExerciseRow);
    };

    const handleAddFromFavoriteExercisesOptionClick = () => {
        setShowAddNewExerciseRow(false);
        setShowFavoritesDropdown(!showFavoritesDropdown);
    };

    const handleAddNewExercise = () => {
        if (newExerciseInputs.name === "") {
            setShowAddNewExerciseRowErrors(true);
            return;
        }
        setShowAddNewExerciseRowErrors(false);
        prepareAndAppendExerciseToForm(newExerciseInputs, append);
        setShowAddNewExerciseRow(false);
        resetAddNewExerciseRow();
    };

    const cancelAddNewExercise = () => {
        setShowAddNewExerciseRowErrors(false);
        setShowAddNewExerciseRow(false);
        resetAddNewExerciseRow();
    };

    const handleAddFavoriteExercise = (
        newFavExerciseInputs: ExerciseInputs
    ) => {
        prepareAndAppendExerciseToForm(newFavExerciseInputs, append);
        setShowFavoritesDropdown(false);
    };

    // const onSubmit: SubmitHandler<SequenceFormInputs> = async (formData) => {
    //     const payload = makeSequencePayloadFromFormData(
    //         formData,
    //         userId as string
    //     );
    //     console.log(
    //         `submitting form data for editing sequence with id ${editItem.id}: `,
    //         payload
    //     );
    //     try {
    //         const res = await api.put(`/v1/sequences/${editItem.id}`, payload);
    //         console.log("API response:", res);
    //     } catch (err: any) {
    //         console.error("Error editing sequence:", err.message);
    //     }

    //     const updatedSequences = await api.get(`/v1/sequences/user/${userId}`);
    //     console.log(
    //         "fetched updated sequences for user after editing sequence: ",
    //         updatedSequences
    //     );
    //     setSequences(updatedSequences);
    //     setIsModalOpen(false);
    // };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        move(result.source.index, result.destination.index);
    };

    const handleModalClose = () => {
        setShowFavoritesDropdown(false);
        setShowAddNewExerciseRow(false);
        setIsModalOpen(false);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            title={title}
            buttons={[
                {
                    label: "Cancel",
                    onClick: handleModalClose,
                    variant: "secondary",
                },
                {
                    label: "Submit",
                    onClick: () => {},
                    variant: "primary",
                    type: "submit",
                    form: formId,
                    disabled: isSubmitting,
                },
            ]}
        >
            <form
                id={formId}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <div>
                    <label htmlFor="name" className={labelStyles}>
                        Sequence Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        {...register("name", { required: true })}
                        className={inputStyles}
                        placeholder="ex. club pilates monday 9am class"
                    />
                    {errors.name && (
                        <span className="text-red-500 text-sm -mt-1">
                            This field is required
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="direction" className={labelStyles}>
                        Description
                    </label>
                    <input
                        id="direction"
                        {...register("description")}
                        className={inputStyles}
                        placeholder="ex. glutes-focused"
                    />
                </div>
                <div>
                    <label htmlFor="notes" className={labelStyles}>
                        Notes
                    </label>
                    <textarea
                        id="notes"
                        {...register("notes")}
                        rows={1}
                        className={inputStyles}
                        placeholder="ex. Need resistance bands."
                    ></textarea>
                </div>

                <div className="">
                    <div className="flex flex-col md:flex-row  mt-1 md:items-center md:gap-x-3">
                        <div className="font-bold text-sm">Exercises</div>
                        <div className="flex flex-col md:flex-row gap-x-2">
                            <IconButton
                                onClick={handleAddNewExerciseOptionClick}
                                icon={
                                    showAddNewExerciseRow ? (
                                        <FiMinus size={14} />
                                    ) : (
                                        <FiPlus size={14} />
                                    )
                                }
                                className={`bg-blue-600 ${addExerciseButtonStyles}`}
                            >
                                {showAddNewExerciseRow
                                    ? "Hide create new"
                                    : "Create new"}
                            </IconButton>

                            <IconButton
                                onClick={
                                    handleAddFromFavoriteExercisesOptionClick
                                }
                                icon={
                                    showFavoritesDropdown ? (
                                        <FiMinus size={14} />
                                    ) : (
                                        <FiPlus size={14} />
                                    )
                                }
                                className={`bg-red-600 ${addExerciseButtonStyles} ${
                                    showAddNewExerciseRow
                                        ? "hidden md:flex"
                                        : ""
                                }`}
                            >
                                {showFavoritesDropdown
                                    ? "Hide favorites"
                                    : "Add from favorites"}
                            </IconButton>
                        </div>
                    </div>

                    {showAddNewExerciseRow && (
                        <div className="bg-blue-600 px-2">
                            <div className="hidden md:flex md:gap-2 w-full text-left pt-2 text-white text-xs font-bold">
                                <div className="flex-[1] p-2 overflow-hidden">
                                    New Exercise Name
                                    <span className="text-red-500">*</span>
                                </div>
                                <div className="flex-[1] p-2 overflow-hidden">
                                    Direction
                                </div>
                                <div className="flex-[1] p-2 overflow-hidden flex gap-x-1">
                                    <span>Duration</span>
                                </div>
                                <div className="flex-[1] p-2 overflow-hidden">
                                    Resistance
                                </div>
                                <div className="flex-[1] p-2 overflow-hidden">
                                    Notes
                                </div>
                                <div className="w-[126px] p-2 overflow-hidden"></div>
                            </div>
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
                        </div>
                    )}

                    <IconButton
                        onClick={handleAddFromFavoriteExercisesOptionClick}
                        icon={
                            showFavoritesDropdown ? (
                                <FiMinus size={14} />
                            ) : (
                                <FiPlus size={14} />
                            )
                        }
                        className={`bg-red-600 text-xs md:text-sm md:w-[250px] ${
                            showAddNewExerciseRow ? "md:hidden" : ""
                        } ${showFavoritesDropdown ? "hidden" : "hidden"}`}
                    >
                        {showFavoritesDropdown
                            ? "Hide favorites"
                            : "Add from favorites"}
                    </IconButton>

                    <FavoriteExercisesDropdown
                        showFavoritesDropdown={showFavoritesDropdown}
                        setShowFavoritesDropdown={setShowFavoritesDropdown}
                        handleAddFavoriteExercise={handleAddFavoriteExercise}
                    />

                    <div
                        id="sequenceExercisesListContainer"
                        className={sequenceExercisesListContainerStyles}
                    >
                        <div className={sequenceExercisesListHeadRowStyles}>
                            <div className="flex-1 px-1.5 overflow-hidden">
                                Exercise Name
                                <span className="text-red-500">*</span>
                            </div>
                            <div className="flex-1 px-1.5 overflow-hidden">
                                Direction
                            </div>
                            <div className="flex-1 px-1.5 overflow-hidden">
                                Duration
                            </div>
                            <div className="flex-1 px-1.5 overflow-hidden">
                                Resistance
                            </div>
                            <div className="flex-1 px-1.5 overflow-hidden">
                                Notes
                            </div>
                            <div className={`w-[130px] overflow-hidden`}></div>
                        </div>

                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="list">
                                {(provided) => (
                                    <div
                                        id="sequenceExercisesListDroppableContainer"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={
                                            sequenceExercisesListDroppableContainerStyles
                                        }
                                    >
                                        {fields.map((field, fieldIndex) => {
                                            const isEditing =
                                                editingExerciseId === field.id;
                                            return (
                                                <Draggable
                                                    key={field.id}
                                                    draggableId={field.id}
                                                    index={fieldIndex}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className=" bg-gray-50"
                                                        >
                                                            <ExerciseRow
                                                                index={
                                                                    fieldIndex
                                                                }
                                                                register={
                                                                    register
                                                                }
                                                                isEditing={
                                                                    isEditing
                                                                }
                                                                errors={errors}
                                                                getValues={
                                                                    getValues
                                                                }
                                                                onToggleEdit={() =>
                                                                    handleToggleEditExercise(
                                                                        {
                                                                            fieldIndex,
                                                                            fieldId:
                                                                                field.id,
                                                                            isEditing,
                                                                            getValues,
                                                                            setValue,
                                                                            trigger,
                                                                            setEditingExerciseId,
                                                                        }
                                                                    )
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
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
