import { useFormContext } from "react-hook-form";
import { ContentRow } from "../../layouts/CompactTable";
import { SequenceFormInputs } from "../../../constants/types";
import { sequenceFormExerciseGridColStyles } from "../../../constants/tailwindClasses";
import Button from "../../ui/Button/Button";

type ExerciseRowProps = {
  index: number;
  onRemove: (index: number) => void;
  setViewingExerciseFieldIndex: (
    fieldIndex: React.SetStateAction<number | null>,
  ) => void;
  setEditingExerciseFieldIndex: (
    fieldIndex: React.SetStateAction<number | null>,
  ) => void;
  setEditExerciseModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setViewExerciseModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DraggableExerciseRow({
  index,
  onRemove,
  setViewingExerciseFieldIndex,
  setEditingExerciseFieldIndex,
  setEditExerciseModalIsOpen,
  setViewExerciseModalIsOpen,
}: ExerciseRowProps) {
  const { getValues } = useFormContext<SequenceFormInputs>();

  const currentValues = getValues();
  const exercise = currentValues.exercises[index];

  const handleEditExerciseClick = (fieldIndex: number) => {
    setEditingExerciseFieldIndex(fieldIndex);
    setEditExerciseModalIsOpen(true);
  };

  const handleViewExerciseClick = (fieldIndex: number) => {
    setViewingExerciseFieldIndex(fieldIndex);
    setViewExerciseModalIsOpen(true);
  };

  return (
    <div>
      <ContentRow
        standardFields={[
          "name",
          "direction",
          "duration",
          "resistance",
          "notes",
        ]}
        actionButtons={[
          <Button
            buttonType="compact"
            text="view"
            onClick={() => handleViewExerciseClick(index)}
          />,

          <Button
            buttonType="compact"
            text="edit"
            onClick={() => handleEditExerciseClick(index)}
          />,
          <Button
            buttonType="compact"
            text="del"
            onClick={() => onRemove(index)}
          />,
        ]}
        rowItem={exercise}
        listType="exercises"
        gridColStyles={sequenceFormExerciseGridColStyles}
      />
    </div>
  );
}
