import React from "react";
import { SetStateAction } from "react";
import { ExerciseInputs } from "../../constants/types";

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
  handleAddNewExercise,
  showAddNewExerciseRowErrors,
  cancelAddNewExercise,
}: RowProps) {
  const _rowContainerStyles =
    "flex flex-col items-start md:flex-row  md:gap-4 pb-4 pt-4 md:pt-0";
  const _fieldsContainerStyles =
    "flex flex-col md:flex-row md:flex-wrap md:items-start md:gap-2 flex-1";
  const _actionButtonsContainerStyle = "mt-2 ml-2 md:mr-2 md:m-0";
  const _actionButtonStyles = "text-xs font-bold p-2 bg-white";
  const _labelStyles = "text-xs font-bold md:hidden";
  const fullLengthInputStyles = "text-sm p-1.5 w-full";
  const durationInputStyles = "text-sm p-1.5 w-full";

  return (
    <div id="rowContainer" className={_rowContainerStyles}>
      <div id="fieldsContainer" className={_fieldsContainerStyles}>
        <div className="flex-[2] px-2">
          <label className={_labelStyles}>Name</label>

          <input
            value={newExerciseInputs.name}
            onChange={(e) =>
              setNewExerciseInputs((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className={fullLengthInputStyles}
          />

          {showAddNewExerciseRowErrors && (
            <span className="text-red-500 text-xs mt-1">
              This field is required
            </span>
          )}
        </div>
        <div className="flex-1 px-2 ">
          <label className={_labelStyles}>Direction</label>

          <input
            value={newExerciseInputs.direction}
            onChange={(e) =>
              setNewExerciseInputs((prev) => ({
                ...prev,
                direction: e.target.value,
              }))
            }
            className={`${fullLengthInputStyles}`}
          />
        </div>
        <div className={`flex-[2] px-2 md:px-0`}>
          <label className={_labelStyles}>Duration</label>
          <div className="flex gap-1.5 items-center">
            <div className="flex flex-col">
              <label className="text-[9px] md:hidden font-medium">min</label>

              <input
                type="number"
                min="0"
                max="99"
                value={newExerciseInputs.duration_mins}
                onChange={(e) =>
                  setNewExerciseInputs((prev) => ({
                    ...prev,
                    duration_mins: Number(e.target.value),
                  }))
                }
                placeholder="min"
                className={durationInputStyles}
              />
            </div>
            <div className="text-xs text-white font-bold self-end pb-2">:</div>
            <div className="flex flex-col">
              <label className="text-[9px] md:hidden font-medium">sec</label>

              <input
                type="number"
                min="0"
                max="999"
                value={newExerciseInputs.duration_secs}
                onChange={(e) =>
                  setNewExerciseInputs((prev) => ({
                    ...prev,
                    duration_secs: Number(e.target.value),
                  }))
                }
                placeholder="sec"
                className={durationInputStyles}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 px-2">
          <label className={_labelStyles}>Resistance</label>
          <input
            value={newExerciseInputs.resistance}
            onChange={(e) =>
              setNewExerciseInputs((prev) => ({
                ...prev,
                resistance: e.target.value,
              }))
            }
            className={fullLengthInputStyles}
          />
        </div>
        <div className="flex-[2] px-2">
          <label className={_labelStyles}>Notes</label>
          <input
            value={newExerciseInputs.notes}
            onChange={(e) =>
              setNewExerciseInputs((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            className={fullLengthInputStyles}
          />
        </div>
      </div>

      <div id="actionButtonsContainer" className={_actionButtonsContainerStyle}>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            className={_actionButtonStyles}
            onClick={() => {
              handleAddNewExercise(newExerciseInputs);
            }}
          >
            Add
          </button>
          <button
            className={_actionButtonStyles}
            onClick={cancelAddNewExercise}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
