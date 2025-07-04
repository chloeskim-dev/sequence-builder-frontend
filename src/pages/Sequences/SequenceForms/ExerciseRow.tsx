import { UseFormGetValues } from "react-hook-form";
import { SequenceFormInputs } from "../../../constants/types";
import { sequenceExerciseActionsColumnWidth } from "../../../constants/tailwindClasses";

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
        "my-1.5 border flex flex-col items-start md:flex-row  md:gap-2 border-2 bg-white p-4 md:px-2 md:pt-4 md:pb-3";
    const _fieldsContainerStyles =
        "flex flex-col md:flex-row md:flex-wrap md:items-start md:gap-2 flex-1";
    const _actionButtonsContainerStyle = "ml-1 md:ml-2 mt-2 md:mt-0 ";
    const _actionButtonStyles =
        "text-xs font-bold p-2 bg-blue-500 text-white mr-2";
    const _labelStyles = "text-xs font-bold md:hidden";
    const _rowTextStyles = "text-xs md:mt-1.5 md:px-1.5";
    const fullLengthInputStyles = "text-xs border py-1.5 px-1.5 w-full";
    const durationInputStyles = "text-xs border py-1.5 px-1.5 w-full";
    const emptyFieldTextStyles = "text-gray-400 hidden md:block";
    const fieldColumnStyles = "self-start";
    const addMarginTopStyle = isEditing ? "mt-1 md:mt-0" : "mt-1 md:mt-0";
    const durationLabelStyles = isEditing
        ? "text-[8px] text-gray-400 font-medium md:-mt-[12px]"
        : "text-[8px] text-gray-400 font-medium md:-mt-[8px]";

    const currentValues = getValues();
    const exercise = currentValues.exercises?.[index];
    if (!exercise) {
        return <div>Exercise not found</div>;
    }

    if (!currentValues.exercises || !currentValues.exercises[index])
        return null;

    const hasDuration =
        typeof currentValues.exercises[index].duration_mins === "number" ||
        typeof currentValues.exercises[index].duration_secs === "number";

    return (
        <div id="rowContainer" className={_rowContainerStyles}>
            <div id="fieldsContainer" className={_fieldsContainerStyles}>
                <div
                    className={`flex-1 ${fieldColumnStyles} ${addMarginTopStyle}`}
                >
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

                <div
                    className={`flex-1 ${fieldColumnStyles} ${addMarginTopStyle}`}
                >
                    {(isEditing ||
                        (!!currentValues.exercises[index].direction &&
                            !isEditing)) && (
                        <label className={_labelStyles}>Direction</label>
                    )}
                    {isEditing ? (
                        <input
                            {...register(`exercises.${index}.direction`)}
                            className={fullLengthInputStyles}
                        />
                    ) : currentValues.exercises[index].direction ? (
                        <div className={_rowTextStyles}>
                            {currentValues.exercises[index].direction}
                        </div>
                    ) : (
                        <div className={emptyFieldTextStyles}>-</div>
                    )}
                </div>

                <div
                    className={`flex-1 ${fieldColumnStyles} 
                    
                      md:px-0`}
                >
                    {hasDuration ? (
                        <label className={_labelStyles}>Duration</label>
                    ) : !isEditing ? (
                        <div className={`${emptyFieldTextStyles}`}>-</div>
                    ) : (
                        ""
                    )}
                    {
                        <div className="flex gap-1.5 items-center">
                            {/*  */}
                            {/* min ----------------------------------------------*/}

                            <div className="flex flex-col">
                                {hasDuration && (
                                    <label className={durationLabelStyles}>
                                        min
                                    </label>
                                )}

                                {isEditing ? (
                                    <input
                                        type="number"
                                        min="0"
                                        max="99"
                                        // {...register(
                                        //     `exercises.${index}.duration_mins`,
                                        //     {
                                        //         valueAsNumber: true,
                                        //     }
                                        // )}
                                        {...register(
                                            `exercises.${index}.duration_mins`,
                                            {
                                                setValueAs: (v: any) => {
                                                    console.log(
                                                        "!!!!!!!!!!!!!!!!!!!!! HERE"
                                                    );
                                                    if (
                                                        v === "" ||
                                                        v === null ||
                                                        v === undefined
                                                    )
                                                        return undefined;
                                                    const num = Number(v);
                                                    console.log(num);
                                                    return isNaN(num)
                                                        ? undefined
                                                        : num;
                                                },
                                            }
                                        )}
                                        placeholder="min"
                                        className={durationInputStyles}
                                    />
                                ) : (
                                    <div className={"text-xs"}>
                                        {
                                            currentValues.exercises[index]
                                                .duration_mins
                                        }
                                    </div>
                                )}
                            </div>

                            {/* divider----------------------------------------*/}
                            {isEditing && hasDuration && (
                                <div className="text-xs self-end pb-1.5">:</div>
                            )}
                            {!isEditing && hasDuration && (
                                <div className="text-xs self-end pb-0">:</div>
                            )}

                            {/* sec ---------------------------------------------*/}
                            <div className="flex flex-col">
                                {hasDuration && (
                                    <label className={durationLabelStyles}>
                                        sec
                                    </label>
                                )}
                                {isEditing ? (
                                    <input
                                        type="number"
                                        min="0"
                                        max="999"
                                        {...register(
                                            `exercises.${index}.duration_secs`,
                                            {
                                                setValueAs: (v: any) => {
                                                    console.log(typeof v);
                                                    if (
                                                        v === "" ||
                                                        v === null ||
                                                        v === undefined
                                                    )
                                                        return undefined;
                                                    const num = Number(v);
                                                    return isNaN(num)
                                                        ? undefined
                                                        : num;
                                                },
                                            }
                                        )}
                                        placeholder="sec"
                                        className={durationInputStyles}
                                    />
                                ) : (
                                    <div className={"text-xs"}>
                                        {
                                            currentValues.exercises[index]
                                                .duration_secs
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                </div>

                <div
                    className={`flex-1 ${fieldColumnStyles} ${addMarginTopStyle}`}
                >
                    {(isEditing ||
                        (!!currentValues.exercises[index].resistance &&
                            !isEditing)) && (
                        <label className={_labelStyles}>Resistance</label>
                    )}
                    {isEditing ? (
                        <input
                            {...register(`exercises.${index}.resistance`)}
                            className={fullLengthInputStyles}
                        />
                    ) : currentValues.exercises[index].resistance ? (
                        <div className={_rowTextStyles}>
                            {currentValues.exercises[index].resistance}
                        </div>
                    ) : (
                        <div className={emptyFieldTextStyles}>-</div>
                    )}
                </div>

                <div
                    className={`flex-1 ${fieldColumnStyles} ${addMarginTopStyle}`}
                >
                    {(isEditing ||
                        (!!currentValues.exercises[index].notes &&
                            !isEditing)) && (
                        <label className={_labelStyles}>Notes</label>
                    )}
                    {isEditing ? (
                        <input
                            {...register(`exercises.${index}.notes`)}
                            className={fullLengthInputStyles}
                        />
                    ) : currentValues.exercises[index].notes ? (
                        <div className={_rowTextStyles}>
                            {currentValues.exercises[index].notes}
                        </div>
                    ) : (
                        <div className={emptyFieldTextStyles}>-</div>
                    )}
                </div>
            </div>

            {/* ACTIONS  */}
            <div
                id="actionButtonsContainer"
                className={`${_actionButtonsContainerStyle} ${sequenceExerciseActionsColumnWidth} bg-red-`}
            >
                <div className="flex justify-center">
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
