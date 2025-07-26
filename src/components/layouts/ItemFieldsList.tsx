import { useState } from "react";
import { Exercise } from "../../constants/types";
import { formatUtcToLocalTrimmed } from "../../utils/dateHelpers";
import { combineDuration, splitDuration } from "../../utils/timeHelpers";
import { ReusableTable } from "./ReusableTable";
import Modal from "./Modal";
import {
    commonFlexColStyles,
    detailsListFieldColStyles,
    detailsListInsideModalLabelStyles,
    detailsListInsideModalTextStyles,
    durationsPartTextStyles,
    responsiveTextStyles,
} from "../../constants/tailwindClasses";

interface ItemFieldsListProps {
    fields: string[];
    item: any;
    labelStyles?: string;
    textStyles?: string;
}

const ItemFieldsList = ({
    fields,
    item,
    labelStyles,
    textStyles,
}: ItemFieldsListProps) => {
    return (
        <div className="flex flex-col gap-y-4">
            {fields.map((field: any) => (
                <Field
                    labelStyles={labelStyles}
                    textStyles={textStyles}
                    field={field}
                    item={item}
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
}

const Field = ({ field, item, labelStyles, textStyles }: FieldProps) => {
    const [detailItem, setDetailItem] = useState<Exercise | null>(null);
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

    return (
        <div
            className={`${responsiveTextStyles}  ${detailsListFieldColStyles}`}
        >
            <div className={`font-extrabold capitalize ${labelStyles ?? ""}`}>
                {fieldLabel}
            </div>
            <div className="ml-3">
                {!isEmpty ? (
                    <div>
                        {isDateField ? (
                            <div className="flex flex-row gap-x-2 ">
                                <div
                                    className={
                                        textStyles
                                            ? `${textStyles} break-words`
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
                            <div className="flex items-end gap-x-0.5">
                                <div className="flex flex-col items-center">
                                    <div className={durationsPartTextStyles}>
                                        m
                                    </div>

                                    <div
                                        className={
                                            textStyles
                                                ? `${textStyles} break-words`
                                                : "break-words"
                                        }
                                    >
                                        {durationMinsString}
                                    </div>
                                </div>
                                <div>:</div>
                                <div className="flex flex-col items-center">
                                    <div className={durationsPartTextStyles}>
                                        s
                                    </div>
                                    <div
                                        className={
                                            textStyles
                                                ? `${textStyles} break-words`
                                                : "break-words"
                                        }
                                    >
                                        {durationSecsString}
                                    </div>
                                </div>
                            </div>
                        ) : isExercisesField ? (
                            <div>
                                {item.exercises.length > 0 ? (
                                    <div className="mt-2">
                                        <ReusableTable
                                            items={item.exercises}
                                            getActionButtonsForItem={(
                                                _,
                                                index
                                            ) => [
                                                {
                                                    title: "View",
                                                    action: () =>
                                                        handleViewItemClick(
                                                            index
                                                        ),
                                                },
                                            ]}
                                            standardFields={[
                                                "name",
                                                "direction",
                                                "duration",
                                                "resistance",
                                                "notes",
                                            ]}
                                            actionsFieldWidthStyle="w-[70px]"
                                            listType="exercises"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            textStyles
                                                ? `${textStyles} break-words`
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
                            textStyles
                                ? `${textStyles} break-words`
                                : "break-words"
                        }
                    >
                        -
                    </div>
                )}
            </div>
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
    );
};
