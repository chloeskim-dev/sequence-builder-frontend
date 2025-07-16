import { useState } from "react";
import { Exercise } from "../../constants/types";
import { formatUtcToLocalTrimmed } from "../../utils/dateHelpers";
import { combineDuration, splitDuration } from "../../utils/timeHelpers";
import { ReusableTable } from "./ReusableTable";
import Modal from "./Modal";
import { commonFlexColStyles } from "../../constants/tailwindClasses";

interface FieldProps {
    field: string;
    item: any;
}

const Field = ({ field, item }: FieldProps) => {
    const [detailItem, setDetailItem] = useState<Exercise | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

    const isDurationField = field === "duration";
    const isCreatedField = field === "created_at";
    const isUpdatedField = field === "updated_at";
    const isExercisesField = field === "exercises";
    const isDateField = isCreatedField || isUpdatedField;

    const isEmpty = isDurationField
        ? item.duration_secs === undefined ||
          item.duration_secs === null ||
          !item.hasOwnProperty("duration_secs")
        : item[field] === undefined ||
          item[field] === null ||
          !item.hasOwnProperty(field);

    const hasDuration = isDurationField && !isEmpty;
    const combinedDurationSecs = hasDuration
        ? combineDuration(
              item.duration_mins ? item.duration_mins : 0,
              item.duration_secs
          )
        : undefined;

    const durationStringMin = hasDuration
        ? String(splitDuration(combinedDurationSecs!).splitMinutes)
        : undefined;
    const durationStringSecs = hasDuration
        ? String(splitDuration(combinedDurationSecs!).splitSeconds).padStart(
              2,
              "0"
          )
        : undefined;

    const fieldLabel = isCreatedField
        ? "Created"
        : isUpdatedField
        ? "Updated"
        : field;
    let date = isDateField
        ? formatUtcToLocalTrimmed(item[field]).date
        : undefined;
    let time = isDateField
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
        <div className={commonFlexColStyles}>
            <div>
                <div className="font-extrabold capitalize text-sm text-gb-yellow">
                    {fieldLabel}
                </div>
                {!isEmpty ? (
                    <div>
                        {isDateField ? (
                            <div className="flex flex-row gap-x-2 text-mt-orange">
                                <div>{date}</div>
                                <div>{time}</div>
                            </div>
                        ) : isDurationField ? (
                            <div className="flex items-end gap-x-0.5">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={
                                            "text-gray-500 text-[10px] -mb-2 -mt-1.5"
                                        }
                                    >
                                        m
                                    </div>
                                    <div>{durationStringMin}</div>
                                </div>
                                <div>:</div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={
                                            "text-gray-500 text-[10px] -mb-2 -mt-1"
                                        }
                                    >
                                        s
                                    </div>
                                    <div>{durationStringSecs}</div>
                                </div>
                            </div>
                        ) : isExercisesField ? (
                            <div>
                                {item.exercises.length > 0 ? (
                                    <ReusableTable
                                        items={item.exercises}
                                        getActionButtonsForItem={(
                                            item,
                                            index
                                        ) => [
                                            {
                                                title: "View",
                                                action: () =>
                                                    handleViewItemClick(index),
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
                                    />
                                ) : (
                                    <div className="font-normal text-sm text-gray-400">
                                        No exercises have been added.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-mt-orange">{item[field]}</div>
                        )}
                    </div>
                ) : (
                    <div className="text-mt-orange">-</div>
                )}
            </div>
            {detailItem && isDetailModalOpen && (
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
                        <ReusableDetailsList
                            fields={[
                                "name",
                                "direction",
                                "duration",
                                "resistance",
                                "notes",
                            ]}
                            item={detailItem}
                        />
                    </Modal>
                </div>
            )}
        </div>
    );
};

interface ReusableDetailsListProps {
    fields: string[];
    item: any;
    labelStyles?: string;
}
const ReusableDetailsList = ({
    fields,
    item,
    labelStyles,
}: ReusableDetailsListProps) => {
    return (
        <div className="flex flex-col gap-y-2">
            {/* ReusableDetailsList */}
            {fields.map((field: any) => (
                <Field field={field} item={item} />
            ))}
        </div>
    );
};

export default ReusableDetailsList;
