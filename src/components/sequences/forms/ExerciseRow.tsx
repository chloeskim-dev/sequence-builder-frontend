import { useFormContext } from "react-hook-form";
import { MainRow } from "../../layouts/ReusableTable";
import { SequenceFormInputs } from "../../../constants/types";

type ExerciseRowProps = {
    index: number;
    onRemove: (index: number) => void;
    setViewingExerciseFieldIndex: (
        fieldIndex: React.SetStateAction<number | null>
    ) => void;
    setEditingExerciseFieldIndex: (
        fieldIndex: React.SetStateAction<number | null>
    ) => void;
    setEditExerciseModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setViewExerciseModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ExerciseRow({
    index,
    onRemove,
    setViewingExerciseFieldIndex,
    setEditingExerciseFieldIndex,
    setEditExerciseModalIsOpen,
    setViewExerciseModalIsOpen,
}: ExerciseRowProps) {
    const { getValues } = useFormContext<SequenceFormInputs>();

    const currentValues = getValues();
    const exercise = currentValues.exercises?.[index];
    if (!exercise) {
        return <div>Exercise not found</div>;
    }

    if (!currentValues.exercises || !currentValues.exercises[index])
        return null;

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
            <MainRow
                standardFields={[
                    "name",
                    "direction",
                    "duration",
                    "resistance",
                    "notes",
                ]}
                actionsFieldWidthStyle="md:w-[160px]"
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
                rowItem={exercise}
                listType="exercises"
                rowIndex={index}
            />
        </div>
    );
}
