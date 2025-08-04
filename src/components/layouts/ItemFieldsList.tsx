import { useState } from "react";
import { CleanedUpExercise } from "../../constants/types";
import { ReusableTable } from "./ReusableTable";
import Modal from "./Modal";
import {
    commonFlexColStyles,
    detailsListFieldStyles,
    detailsListGridColStyles,
    detailsListInsideModalLabelStyles,
    detailsListInsideModalTextStyles,
    durationsPartTextStyles,
    formGridColStyles,
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
            <div className="flex justify-center break-words">
                <div
                    className={`flex flex-col gap-y-2 border w-[80%] rounded-xl p-4 mb-4 break-words`}
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
        <div className={`flex flex-col gap-y-6  break-words`}>
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
        <div className={`text-center`}>
            <div
                className={`${responsiveTextStyles} ${
                    isExercisesFieldOfSequenceWithAtLeastOneExercise
                        ? "flex flex-col"
                        : "flex flex-col"
                }`}
            >
                {
                    <div
                        className={`${labelStyles ?? ""} ${
                            isExercisesFieldOfSequenceWithAtLeastOneExercise
                                ? "text-center"
                                : "text-center"
                        }`}
                    >
                        {fieldLabel}
                    </div>
                }

                {!isEmpty ? (
                    <div>
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
                                            ? `${textStyles} break-words`
                                            : "break-words"
                                    }
                                >
                                    {time}
                                </div>
                            </div>
                        ) : isDurationField ? (
                            <div className="flex gap-x-2 justify-center">
                                <div
                                    className={
                                        textStyles
                                            ? `${textStyles} break-words flex gap-x-0.5`
                                            : "break-words flex gap-x-0.5"
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
                                            ? `${textStyles} break-words flex gap-x-0.5`
                                            : "break-words flex gap-x-0.5"
                                    }
                                >
                                    {durationSecsString}
                                    <span className={durationsPartTextStyles}>
                                        s
                                    </span>
                                </div>
                            </div>
                        ) : isExercisesField ? (
                            <div>
                                {item.exercises.length > 0 ? (
                                    <div>
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
                                                textStyles={
                                                    textStyles
                                                        ? `${textStyles} break-words`
                                                        : "break-words"
                                                }
                                                labelStyles={`${
                                                    labelStyles && labelStyles
                                                }`}
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
                                    textStyles ? `${textStyles}` : "break-words"
                                }
                            >
                                {item[field]}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={textStyles ? `${textStyles} ` : ""}>-</div>
                )}
            </div>
            <div>
                {detailItem && isDetailModalOpen && (
                    // this is only used in Sequence Details Page
                    <div>
                        <Modal
                            isOpen={isDetailModalOpen}
                            onClose={closeDetailModal}
                            title={"Exercise Details"}
                            buttons={[
                                {
                                    label: "Close",
                                    onClick: () => setIsDetailModalOpen(false),
                                    variant: "secondary",
                                },
                            ]}
                        >
                            <ItemFieldsList
                                fields={[
                                    "name",
                                    "direction",
                                    "duration",
                                    "resistance",
                                    "notes",
                                ]}
                                item={detailItem}
                                textStyles={detailsListInsideModalTextStyles}
                                labelStyles={detailsListInsideModalLabelStyles}
                            />
                        </Modal>
                    </div>
                )}
            </div>
        </div>
    );
};
