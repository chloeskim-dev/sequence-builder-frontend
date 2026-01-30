import { useState } from "react";
import { CleanedUpExercise } from "../../constants/types";
import Modal from "./Modal";
import {
    defaultItemFieldsListLabelStyles,
    defaultItemFieldsListTextStyles,
    durationsPartTextStyles,
    responsiveTextStyles,
} from "../../constants/tailwindClasses";
import { SortDirection } from "../../utils/listHelpers";
import { combineDuration, splitDuration } from "../../utils/durationHelpers";
import { formatUtcToLocalTrimmed } from "../../utils/timeHelpers";

interface ItemFieldsListProps {
    fields: string[];
    item: any;
    labelStyles?: string;
    textStyles?: string;
    isNestedList?: boolean;
}

const ItemFieldsList = ({
    fields,
    item,
    labelStyles,
    textStyles,
    isNestedList,
}: ItemFieldsListProps) => {
    if (isNestedList)
        return (
            <div className="flex justify-center mt-1 border-2 border-my-bg bg-white rounded-lg">
                <div
                    className={`flex flex-col w-full gap-1 rounded-md px-3 py-2 mb-4 break-words`}
                >
                    {fields.map((field: any) => (
                        <Field
                            labelStyles={labelStyles}
                            textStyles={textStyles}
                            field={field}
                            item={item}
                            isNestedList={isNestedList}
                        />
                    ))}
                </div>
            </div>
        );

    return (
        <div className={`w-full flex flex-col items-center gap-1`}>
            {fields.map((field: any) => (
                <Field
                    labelStyles={labelStyles}
                    textStyles={textStyles}
                    field={field}
                    item={item}
                    isNestedList={isNestedList}
                />
            ))}
        </div>
    );
};

export default ItemFieldsList;

interface FieldProps {
    field: string;
    item: any;
    labelStyles?: string;
    textStyles?: string;
    isNestedList?: boolean;
}

const Field = ({
    field,
    item,
    labelStyles,
    textStyles,
    isNestedList,
}: FieldProps) => {
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [detailItem, setDetailItem] = useState<CleanedUpExercise | null>(
        null
    );
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

    const isDurationField = field === "duration";
    const isCreatedField = field === "created_at";
    const isUpdatedField = field === "updated_at";
    const isExercisesField = field === "exercises";
    const isDateField = isCreatedField || isUpdatedField;

    const fieldLabel = isCreatedField
        ? "Created"
        : isUpdatedField
        ? "Updated"
        : field;

    const isEmpty = isDurationField
        ? item.duration_secs === undefined ||
          item.duration_secs === null ||
          !item.hasOwnProperty("duration_secs")
        : item[field] === undefined ||
          item[field] === null ||
          !item.hasOwnProperty(field);

    // durations field related

    const hasDuration = isDurationField && !isEmpty;

    const combinedDurationSecs = hasDuration
        ? combineDuration(
              item.duration_mins ? item.duration_mins : 0,
              item.duration_secs
          )
        : undefined;

    const durationMinsString = hasDuration
        ? String(splitDuration(combinedDurationSecs!).splitMinutes)
        : undefined;

    const durationSecsString = hasDuration
        ? String(splitDuration(combinedDurationSecs!).splitSeconds).padStart(
              2,
              "0"
          )
        : undefined;

    const date = isDateField
        ? formatUtcToLocalTrimmed(item[field]).date
        : undefined;

    const time = isDateField
        ? formatUtcToLocalTrimmed(item[field]).time
        : undefined;

    const handleViewItemClick = (index: number) => {
        setDetailItem(item.exercises[index]);
        console.log(item.exercises[index]);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setDetailItem(null);
    };

    const isExercisesFieldOfSequenceWithAtLeastOneExercise =
        isExercisesField && item.exercises && item.exercises.length > 0;

    return (
        <div className="w-full">
            <div
                className={`${responsiveTextStyles} ${
                    isExercisesFieldOfSequenceWithAtLeastOneExercise
                        ? ""
                        : "flex flex-col mt-2 lg:grid lg:grid-cols-2 lg:gap-4"
                }`}
            >
                {
                    <div
                        className={`${labelStyles ?? "break-words"} ${
                            isExercisesFieldOfSequenceWithAtLeastOneExercise
                                ? "mt-4 lg:text-center mt-6 text-mt-red"
                                : "lg:text-right"
                        }`}
                    >
                        {fieldLabel}
                    </div>
                }

                {!isEmpty ? (
                    <div className="overflow-hidden break-words">
                        {isDateField ? (
                            <div className="flex flex-row gap-x-2 ">
                                <div
                                    className={
                                        textStyles
                                            ? `${textStyles}`
                                            : "break-words"
                                    }
                                >
                                    {date}
                                </div>
                                <div
                                    className={
                                        textStyles
                                            ? `${textStyles}`
                                            : "break-words"
                                    }
                                >
                                    {time}
                                </div>
                            </div>
                        ) : isDurationField ? (
                            <div className="flex gap-x-2">
                                <div
                                    className={
                                        textStyles
                                            ? `${textStyles} flex gap-x-0.5`
                                            : " flex gap-x-0.5"
                                    }
                                >
                                    {durationMinsString}
                                    <span className={durationsPartTextStyles}>
                                        m
                                    </span>
                                </div>
                                <div
                                    className={
                                        textStyles
                                            ? `${textStyles} flex gap-x-0.5`
                                            : " flex gap-x-0.5"
                                    }
                                >
                                    {durationSecsString}
                                    <span className={durationsPartTextStyles}>
                                        s
                                    </span>
                                </div>
                            </div>
                        ) : isExercisesField ? (
                            <div className="w-full">
                                {item.exercises.length > 0 ? (
                                    <div className="">
                                        {item.exercises.map((exercise: any) => (
                                            <ItemFieldsList
                                                fields={[
                                                    "name",
                                                    "direction",
                                                    "duration",
                                                    "resistance",
                                                    "notes",
                                                ]}
                                                item={exercise}
                                                textStyles={"text-my-bg"}
                                                labelStyles={
                                                    "capitalize font-bold text-mt-red"
                                                }
                                                isNestedList={true}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            textStyles
                                                ? `${textStyles}`
                                                : "break-words"
                                        }
                                    >
                                        -
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className={
                                    textStyles
                                        ? `${textStyles} break-words`
                                        : "break-words"
                                }
                            >
                                {item[field]}
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        className={
                            textStyles ? `${textStyles} ` : "break-words"
                        }
                    >
                        -
                    </div>
                )}
            </div>
        </div>
    );
};
