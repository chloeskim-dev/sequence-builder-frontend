import { useState, useEffect } from "react";
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

import DraggableExerciseRow from "../sequences/forms/DraggableExerciseRow";
import FavoriteExercisesDropdown from "../sequences/forms/FavoriteExercisesDropdown";
import Modal from "../layouts/Modal";
import {
  ExerciseInputs,
  FieldConfig,
  CleanedFullSequence,
  SequenceFormInputs,
} from "../../constants/types";
import {
  allMainRowsContainerStyles,
  errorMessageStyles,
  formTextInputStyles,
  commonLabelStyles,
  headerRowTextStyles,
  standardFieldContainerStyles,
  sequenceExercisesListContainerStyles,
  formFieldsFlexColStyles,
  responsiveTextStyles,
  formTextAreaInputStyles,
  labelForTextAreaStyles,
  sequenceFormExerciseGridColStyles,
  defaultItemFieldsListLabelStyles,
  defaultItemFieldsListTextStyles,
} from "../../constants/tailwindClasses";

import {
  blankExerciseFormInputs,
  blankSequenceFormInputs,
} from "../../constants/initialFormInputs";

import {
  getInitialEditSequenceFormValues,
  normalizeDurationsIfAnyInExerciseData,
} from "../../utils/formHelpers";

import { ExerciseForm } from "./ExerciseForm";
import {
  exerciseFormFieldConfigs,
  sequenceFormFieldConfigs,
} from "../../constants/formFieldConfigs";
import ItemFieldsList from "../layouts/ItemFieldsList";
import Button from "../ui/Button/Button";
import HintText from "../ui/HintText";

type Props = {
  title: string;
  formId: string;
  onSubmit: SubmitHandler<SequenceFormInputs>;
  editSequence?: CleanedFullSequence;
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
  const {
    fields: exerciseFields,
    append,
    remove,
    move,
  } = useFieldArray({
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
      ? sequenceFormMethods.getValues().exercises[editingExerciseFieldIndex]
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
      normalizedData,
    ); // update the specific exercise in the overall sequence form
    setEditExerciseModalIsOpen(false);
    setEditingExerciseFieldIndex(null);
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

  const standardExerciseFieldNames = [
    "name",
    "direction",
    "duration",
    "resistance",
    "notes",
  ];

  // Function for rendering the "individual" (non-array) form fields: Name, Description, and Notes
  const renderIndividualFormField = (fc: FieldConfig) => {
    const error =
      sequenceFormMethods.formState.errors[fc.name as keyof SequenceFormInputs];

    return (
      <div key={fc.name} className={"flex flex-col"}>
        <label
          htmlFor={fc.name}
          className={` mt-1 text-left ${commonLabelStyles} ${
            fc.type === "textarea" && labelForTextAreaStyles
          }
                    }`}
        >
          {fc.label}
          {fc.rules?.required && <span className="text-my-red">*</span>}
        </label>

        {fc.type === "textarea" ? (
          <textarea
            id={fc.name}
            {...sequenceFormMethods.register(
              fc.name as keyof SequenceFormInputs,
              fc.rules as RegisterOptions<
                SequenceFormInputs,
                keyof SequenceFormInputs
              >,
            )}
            rows={fc.rows || 3}
            className={`${formTextAreaInputStyles} text-gb-bg`}
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
              >,
            )}
            className={`${formTextInputStyles} text-gb-bg`}
            placeholder={fc.placeholder}
          />
        )}

        {error && <p className={errorMessageStyles}>{error.message}</p>}
      </div>
    );
  };

  return (
    <div className="">
      {/* SEQUENCE FORM */}
      <FormProvider {...sequenceFormMethods}>
        <div className="flex flex-col items-center">
          <div className="flex flex-col rounded-xl w-[80%]">
            <form
              id={formId}
              onSubmit={sequenceFormMethods.handleSubmit(onSubmit)}
              className={`flex-1 flex flex-col overflow-y-auto px-10 py-8 ${responsiveTextStyles}`}
            >
              <div className={formFieldsFlexColStyles}>
                {/* ------------------------------ NAME, DESCRIPTION, NOTES -------------------------------- */}

                {sequenceFormFieldConfigs.map(renderIndividualFormField)}

                {/* ------------------------------ EXERCISES -------------------------------- */}
                <div className="flex-1 flex flex-col gap-2 items-center w-full">
                  <div className={"flex flex-col w-full justify-center"}>
                    <div className={`  ${commonLabelStyles} `}>Exercises</div>
                    <div className={"mt-1 flex gap-2"}>
                      <Button
                        text="add new"
                        onClick={() => setAddNewExerciseModalIsOpen(true)}
                        buttonType="compact"
                      />
                      <Button
                        text="add from favorites"
                        onClick={() =>
                          setAddFromFavoriteExercisesModalIsOpen(true)
                        }
                        buttonType="compact"
                      />
                    </div>
                  </div>

                  {exerciseFields.length === 0 ? (
                    <HintText>
                      No exercises have been added to this class so far.
                    </HintText>
                  ) : (
                    <div
                      id="sequenceExercisesListContainer"
                      className={sequenceExercisesListContainerStyles}
                    >
                      {exerciseFields.length > 1 && (
                        <HintText>Drag and drop to reorder exercises.</HintText>
                      )}
                      {/* Exercises List Header Row - visible only for large screens */}
                      <div className={`hidden lg:block rounded-xl w-full`}>
                        <div
                          id="headerRowContainer"
                          className={`lg:grid lg:items-center lg:gap-4 rounded-xl p-6 lg:py-3 capitalize ${sequenceFormExerciseGridColStyles}`}
                        >
                          {standardExerciseFieldNames.map(
                            (standardFieldName) => {
                              return (
                                <div
                                  className={`${standardFieldContainerStyles} ${headerRowTextStyles}`}
                                >
                                  {standardFieldName}
                                </div>
                              );
                            },
                          )}
                          <div className={`${headerRowTextStyles}`}>
                            Actions
                          </div>
                        </div>
                      </div>
                      {/* Exercises List DND Main Rows */}
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="list">
                          {(provided) => (
                            <div
                              id="sequenceExercisesListDroppableContainer"
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`${allMainRowsContainerStyles}`}
                            >
                              {exerciseFields.map((exField, exFieldIndex) => {
                                return (
                                  <Draggable
                                    key={exField.id}
                                    draggableId={exField.id}
                                    index={exFieldIndex}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <DraggableExerciseRow
                                          index={exFieldIndex}
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
                                          onRemove={() => remove(exFieldIndex)}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {/* Following line is required for DnD */}
                              {provided.placeholder}
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
        </div>
      </FormProvider>

      {/* MODALS */}
      {/* ADD NEW EXERCISE MODAL */}
      <Modal
        isOpen={addNewExerciseModalIsOpen}
        onClose={onAddNewExerciseModalClose}
        title="Add a new exercise to the class."
        buttons={[
          {
            label: "Add",
            onClick: () => {}, // Empty onClick for submit buttons
            buttonType: "compact",
            type: "submit",
            form: "new-exercise-form",
            disabled: newExerciseFormMethods.formState.isSubmitting,
          },
          {
            label: "Cancel",
            onClick: onAddNewExerciseModalClose,
            buttonType: "compact",
          },
        ]}
      >
        <FormProvider {...newExerciseFormMethods}>
          <ExerciseForm
            id="new-exercise-form"
            onSubmit={newExerciseFormMethods.handleSubmit(
              handleNewExerciseSubmit,
            )}
            fieldConfigs={exerciseFormFieldConfigs}
          />
        </FormProvider>
      </Modal>
      {/* ADD FROM FAVORITES MODAL */}
      <Modal
        isOpen={addFromFavoriteExercisesModalIsOpen}
        onClose={onAddFromFavoritesModalClose}
        title={"Add a favorite exercise."}
        buttons={[
          {
            label: "Cancel",
            onClick: onAddFromFavoritesModalClose,
            buttonType: "compact",
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
            buttonType: "compact",
            type: "submit",
            form: "edit-exercise-form",
            disabled: editExerciseFormMethods.formState.isSubmitting,
          },
          {
            label: "Cancel",
            onClick: onEditExerciseModalClose,
            buttonType: "compact",
          },
        ]}
      >
        <FormProvider {...editExerciseFormMethods}>
          <ExerciseForm
            id="edit-exercise-form"
            onSubmit={editExerciseFormMethods.handleSubmit(
              handleEditExerciseSubmit,
            )}
            fieldConfigs={exerciseFormFieldConfigs}
          />
        </FormProvider>
      </Modal>
      {/* VIEW EXERCISE MODAL */}
      <Modal
        isOpen={viewExerciseModalIsOpen && viewingExerciseFieldIndex !== null}
        onClose={onViewExerciseModalClose}
        title="Exercise Details"
        buttons={[
          {
            label: "Close",
            onClick: onViewExerciseModalClose,
            buttonType: "compact",
          },
        ]}
      >
        <ItemFieldsList
          item={
            sequenceFormMethods.getValues().exercises[
              viewingExerciseFieldIndex!
            ]
          }
          fields={["name", "direction", "duration", "resistance", "notes"]}
          textStyles={defaultItemFieldsListTextStyles}
          labelStyles={defaultItemFieldsListLabelStyles}
        />
      </Modal>
    </div>
  );
}
