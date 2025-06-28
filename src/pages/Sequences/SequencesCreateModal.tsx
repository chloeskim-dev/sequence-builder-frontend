import { SetStateAction, useState, useEffect } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import ExerciseRow from "./ExerciseRow";
import FavoriteExercisesDropdown from "./FavoriteExercisesDropdown";
import NewExerciseInputsRow from "./NewExerciseInputsRow";
import { IconButton } from "../../components/ui/IconButton";
import Modal from "../../components/layouts/Modal";

import {
  Sequence,
  SequenceFormInputs,
  ExerciseInputs,
} from "../../constants/types";
import {
  labelStyles,
  inputStyles,
  sequenceExercisesListContainerStyles,
  sequenceExercisesListHeadRowStyles,
  sequenceExercisesListDroppableContainerStyles,
} from "../../constants/tailwindClasses";
import { splitDuration, combineDuration } from "../../utils/timeHelpers";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";

type SequencesCreateModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
  setSequences: React.Dispatch<React.SetStateAction<Sequence[]>>;
};

export default function SequencesCreateModal({
  isModalOpen,
  setIsModalOpen,
  setSequences,
}: SequencesCreateModalProps) {
  const { user } = useUser();
  const userId = user?.id ?? null;

  const blankNewExerciseInputs: ExerciseInputs = {
    name: "",
    direction: "",
    duration_mins: 0,
    duration_secs: 0,
    resistance: "",
    notes: "",
  };

  const [newExerciseInputs, setNewExerciseInputs] = useState(
    blankNewExerciseInputs
  );
  const [showAddNewExerciseRow, setShowAddNewExerciseRow] = useState(false);
  const [showAddNewExerciseRowErrors, setShowAddNewExerciseRowErrors] =
    useState(false);

  const [showFavoritesDropdown, setShowFavoritesDropdown] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(
    null
  );

  const formInitialInputs = {
    name: "",
    description: "",
    notes: "",
    exercises: [],
  };
  const {
    control,
    getValues,
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
  }, [reset, isModalOpen]);

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "exercises",
  });

  const resetAddNewExerciseRow = () => {
    setNewExerciseInputs(blankNewExerciseInputs);
  };

  const appendExerciseToFieldArray = (ex: ExerciseInputs) => {
    const { splitMinutes, splitSeconds } = splitDuration(ex.duration_secs);
    append({
      name: ex.name,
      direction: ex.direction,
      duration_mins: splitMinutes,
      duration_secs: splitSeconds,
      resistance: ex.resistance,
      notes: ex.notes,
    });
  };

  const handleAddNewExerciseOptionClick = () => {
    setShowFavoritesDropdown(false);
    setShowAddNewExerciseRow(true);
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
    appendExerciseToFieldArray(newExerciseInputs);
    setShowAddNewExerciseRow(false);
    resetAddNewExerciseRow();
  };

  const cancelAddNewExercise = () => {
    setShowAddNewExerciseRowErrors(false);
    setShowAddNewExerciseRow(false);
    resetAddNewExerciseRow();
  };

  const handleAddFavoriteExercise = (newFavExercise: ExerciseInputs) => {
    appendExerciseToFieldArray(newFavExercise);
    setShowFavoritesDropdown(false);
  };

  const onSubmit: SubmitHandler<SequenceFormInputs> = async (formData) => {
    const transformedData = {
      ...formData,
      user_id: userId,
      exercises: formData.exercises.map((exercise) => ({
        name: exercise.name,
        direction: exercise.direction,
        resistance: exercise.resistance,
        notes: exercise.notes,
        duration_secs: combineDuration(
          exercise.duration_mins,
          exercise.duration_secs
        ),
      })),
    };
    console.log(userId);
    console.log("transformed form data:", transformedData);

    try {
      const res = await api.post(
        `/v1/sequences/user/${userId}`,
        transformedData
      );
      console.log("API response:", res);
    } catch (err: any) {
      console.error("Error creating sequence:", err.message);
    }

    const updatedSequences = await api.get(`/v1/sequences/user/${userId}`);
    console.log(
      "fetched updated sequences for user after creation: ",
      updatedSequences
    );
    setSequences(updatedSequences);
    setIsModalOpen(false);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const handleModalClose = () => {
    setShowFavoritesDropdown(false);
    setIsModalOpen(false);
    setShowAddNewExerciseRow(false);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => handleModalClose()}
      title="Create a new sequence."
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
          form: "create-sequence-form",
          disabled: isSubmitting,
        },
      ]}
    >
      <form
        id="create-sequence-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label htmlFor="name" className={labelStyles}>
            Name
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
                className="bg-blue-600 text-xs md:text-sm md:w-[250px]"
              >
                {showAddNewExerciseRow ? "Hide create new" : "Create new"}
              </IconButton>

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
                  showAddNewExerciseRow ? "hidden md:flex" : ""
                }`}
              >
                {showFavoritesDropdown
                  ? "Hide favorites list"
                  : "Add from favorites"}
              </IconButton>
            </div>
          </div>

          {showAddNewExerciseRow && (
            <div className="bg-blue-600 px-2">
              <div className="hidden md:flex md:gap-2 w-full text-left pt-2 text-white text-xs font-bold">
                <div className="flex-[2] p-2 overflow-hidden">
                  New Exercise Name
                </div>
                <div className="flex-[1] p-2 overflow-hidden">Direction</div>
                <div className="flex-[2] p-2 overflow-hidden flex gap-x-1">
                  <span>Duration</span>
                  <span className="hidden md:block">(m:s)</span>
                </div>
                <div className="flex-[1] p-2 overflow-hidden">Resistance</div>
                <div className="flex-[2] p-2 overflow-hidden">Notes</div>
                <div className="w-[126px] p-2 overflow-hidden"></div>
              </div>
              <div>
                <NewExerciseInputsRow
                  newExerciseInputs={newExerciseInputs}
                  setNewExerciseInputs={setNewExerciseInputs}
                  handleAddNewExercise={handleAddNewExercise}
                  showAddNewExerciseRowErrors={showAddNewExerciseRowErrors}
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
            {showFavoritesDropdown ? "Hide favorites" : "Add from favorites"}
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
              <div className="flex-[2] px-2 overflow-hidden flex">
                Exercise Name
              </div>
              <div className="flex-[1] px-2 overflow-hidden flex">
                Direction
              </div>
              <div className="flex-[2] px-2 overflow-hidden flex">Duration</div>
              <div className="flex-[1] px-2 overflow-hidden flex">
                Resistance
              </div>
              <div className="flex-[2] px-2 overflow-hidden flex">Notes</div>
              <div className="w-[130px] px-2 overflow-hidden flex"></div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="list">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={sequenceExercisesListDroppableContainerStyles}
                  >
                    {fields.map((field, fieldIndex) => {
                      const isEditing = editingExerciseId === field.id;
                      return (
                        <Draggable
                          key={field.id}
                          draggableId={field.id}
                          index={fieldIndex}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className=" bg-gray-50"
                            >
                              <ExerciseRow
                                index={fieldIndex}
                                register={register}
                                isEditing={isEditing}
                                errors={errors}
                                getValues={getValues}
                                onToggleEdit={async () => {
                                  if (isEditing) {
                                    const valid = await trigger([
                                      `exercises.${fieldIndex}.name`,
                                      `exercises.${fieldIndex}.direction`,
                                      `exercises.${fieldIndex}.duration_mins`,
                                      `exercises.${fieldIndex}.duration_secs`,
                                      `exercises.${fieldIndex}.resistance`,
                                      `exercises.${fieldIndex}.notes`,
                                    ]);
                                    if (valid) {
                                      setEditingExerciseId(null); // to
                                    }
                                  } else {
                                    setEditingExerciseId(field.id);
                                  }
                                }}
                                onRemove={() => remove(fieldIndex)}
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
