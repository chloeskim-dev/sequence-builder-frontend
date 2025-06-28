import { UseFormGetValues } from "react-hook-form";
import { SequenceFormInputs } from "../../constants/types";

type ExerciseRowProps = {
  index: number;
  errors: any;
  getValues: UseFormGetValues<SequenceFormInputs>;
  register: any;
  isEditing: boolean;
  onToggleEdit: () => void;
  onRemove: (index: number) => void;
};

export default function ExerciseRow({
  index,
  errors,
  getValues,
  register,
  isEditing,
  onToggleEdit,
  onRemove,
}: ExerciseRowProps) {
  const _rowContainerStyles =
    "my-1.5 border flex flex-col items-start md:flex-row  md:gap-4 p-2 border-2";
  const _fieldsContainerStyles =
    "flex flex-col md:flex-row md:flex-wrap md:items-start md:gap-2 flex-1";
  const _actionButtonsContainerStyle = "mt-2 ml-2 md:m-0";
  const _actionButtonStyles = "text-xs font-bold p-2 border border-black";
  const _labelStyles = "text-xs font-bold md:hidden";
  const _rowTextStyles = "text-xs md:mt-1.5";
  const fullLengthInputStyles = "text-xs border py-1.5 px-1.5 w-full";
  const durationInputStyles = "text-xs border py-1.5 px-1.5 w-full";

  const currentValues = getValues();
  const exercise = currentValues.exercises?.[index];
  if (!exercise) {
    return <div>Exercise not found</div>;
  }

  return (
    <div id="rowContainer" className={_rowContainerStyles}>
      <div id="fieldsContainer" className={_fieldsContainerStyles}>
        <div className="flex-[2] px-2">
          {isEditing ? (
            <input
              {...register(`exercises.${index}.name`, {
                required: true,
              })}
              className={fullLengthInputStyles}
            />
          ) : (
            <div
              className={`${_rowTextStyles} my-2 md:m-0 uppercase md:normal-case font-extrabold text-[17px] md:text-xs md:font-normal flex gap-1.5 items-center`}
            >
              {currentValues.exercises[index].name}
            </div>
          )}
          {errors.exercises?.[index]?.name && (
            <span className="text-red-500 text-xs mt-1">
              This field is required
            </span>
          )}
        </div>
        <div className="flex-1 px-2 ">
          <label className={_labelStyles}>Direction</label>
          {isEditing ? (
            <input
              {...register(`exercises.${index}.direction`)}
              className={`${fullLengthInputStyles}`}
            />
          ) : (
            <div className={_rowTextStyles}>
              {currentValues.exercises[index].direction}
            </div>
          )}
        </div>
        <div className={`flex-[2] ${isEditing ? "px-2" : "p-2"} md:px-0`}>
          <label className={_labelStyles}>Duration</label>
          <div className="flex gap-1.5 items-center">
            <div className="flex flex-col">
              {isEditing ? (
                ""
              ) : (
                <label className="text-[9px] md:hidden font-medium">min</label>
              )}

              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="99"
                  {...register(`exercises.${index}.duration_mins`, {
                    valueAsNumber: true,
                  })}
                  placeholder="min"
                  className={durationInputStyles}
                />
              ) : (
                <div className={"text-xs"}>
                  {currentValues.exercises[index].duration_mins}
                </div>
              )}
            </div>
            {isEditing ? (
              <div className="text-sm self-end pb-1.5">:</div>
            ) : (
              <div className="text-sm self-end pb-0">:</div>
            )}
            <div className="flex flex-col">
              {isEditing ? (
                ""
              ) : (
                <label className="text-[9px] md:hidden font-medium">sec</label>
              )}
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="999"
                  {...register(`exercises.${index}.duration_secs`, {
                    valueAsNumber: true,
                  })}
                  placeholder="sec"
                  className={durationInputStyles}
                />
              ) : (
                <div className={"text-xs"}>
                  {currentValues.exercises[index].duration_secs}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 px-2">
          <label className={_labelStyles}>Resistance</label>
          {isEditing ? (
            <input
              {...register(`exercises.${index}.resistance`)}
              className={fullLengthInputStyles}
            />
          ) : (
            <div className={_rowTextStyles}>
              {currentValues.exercises[index].resistance}
            </div>
          )}
        </div>
        <div className="flex-[2] px-2">
          <label className={_labelStyles}>Notes</label>
          {isEditing ? (
            <input
              {...register(`exercises.${index}.notes`)}
              className={fullLengthInputStyles}
            />
          ) : (
            <div className={_rowTextStyles}>
              {currentValues.exercises[index].notes}
            </div>
          )}
        </div>
      </div>

      {/* ACTIONS  */}
      <div id="actionButtonsContainer" className={_actionButtonsContainerStyle}>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            className={_actionButtonStyles}
            onClick={onToggleEdit}
          >
            {isEditing ? "Done" : "Edit"}
          </button>
          <button
            className={_actionButtonStyles}
            onClick={() => onRemove(index)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
