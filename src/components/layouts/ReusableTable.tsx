import { ReactElement } from "react";
import { formatUtcToLocalTrimmed } from "../../utils/dateHelpers";
import { combineDuration, splitDuration } from "../../utils/timeHelpers";
import {
    standardFieldContainerStyles,
    actionFieldContainerStyles,
    actionButtonsContainerStyle,
    rightMarginSameWidthAsScrollbarStyle,
    commonPaddingXForHeaderContainerAndMainRow,
    commonFlexRowStyles,
    mainRowFieldTextStyles,
    mainRowFieldLabelStyles,
    headerRowTextStyles,
    missingFieldDashStyles,
    allMainRowsContainerStyles,
    actionButtonStyles,
} from "../../constants/tailwindClasses";

interface HeaderRowProps {
    standardFields: string[];
    actionsFieldWidthStyle: string;
    listType?: string;
}

export const HeaderRow: React.FC<HeaderRowProps> = ({
    standardFields,
    actionsFieldWidthStyle,
}) => {
    const standardFieldsDivs = standardFields.map((field) => {
        const isUpdatedField = field === "updated_at";
        const isCreatedField = field === "created_at";

        return (
            <div
                className={`capitalize ${standardFieldContainerStyles} ${headerRowTextStyles}`}
            >
                {isCreatedField
                    ? "Created"
                    : isUpdatedField
                    ? "Updated"
                    : field}
            </div>
        );
    });

    return (
        <div
            id="headerRowContainer"
            className={`${commonPaddingXForHeaderContainerAndMainRow} ${rightMarginSameWidthAsScrollbarStyle} ${commonFlexRowStyles}`}
        >
            {standardFieldsDivs}
            <div
                className={`${actionFieldContainerStyles} ${actionsFieldWidthStyle} ${headerRowTextStyles}`}
            >
                Actions
            </div>
        </div>
    );
};

interface ActionButton {
    title: string;
    action: (args: any) => any;
    content?: ReactElement;
}

interface MainRowProps {
    standardFields: string[];
    actionsFieldWidthStyle: string;
    rowItem: any;
    actionButtons: ActionButton[];
    listType?: string;
}

export const MainRow: React.FC<MainRowProps> = ({
    standardFields,
    actionsFieldWidthStyle,
    rowItem,
    actionButtons,
    listType,
}) => {
    const standardFieldsDivs = standardFields.map((field) => {
        const isDurationField = field === "duration";
        const isCreatedField = field === "created_at";
        const isUpdatedField = field === "updated_at";
        const isExercisesField = field === "exercises";
        const isDateField = isCreatedField || isUpdatedField;

        const isEmpty = isDurationField
            ? rowItem.duration_secs === undefined ||
              rowItem.duration_secs === null ||
              !rowItem.hasOwnProperty("duration_secs")
            : rowItem[field] === undefined ||
              rowItem[field] === null ||
              !rowItem.hasOwnProperty(field);

        const hasDuration = isDurationField && !isEmpty;
        const combinedDurationSecs = hasDuration
            ? combineDuration(
                  rowItem.duration_mins ? rowItem.duration_mins : 0,
                  rowItem.duration_secs
              )
            : undefined;

        const durationStringMin = hasDuration
            ? String(splitDuration(combinedDurationSecs!).splitMinutes)
            : undefined;
        const durationStringSecs = hasDuration
            ? String(
                  splitDuration(combinedDurationSecs!).splitSeconds
              ).padStart(2, "0")
            : undefined;

        const fieldLabel = isCreatedField
            ? "Created"
            : isUpdatedField
            ? "Updated"
            : field;
        let date = isDateField
            ? formatUtcToLocalTrimmed(rowItem[field]).date
            : undefined;
        let time = isDateField
            ? formatUtcToLocalTrimmed(rowItem[field]).time
            : undefined;

        let exercisesTotalDurationSecs = isExercisesField
            ? rowItem[field].reduce(
                  (acc: any, exercise: any) =>
                      acc + (exercise.duration_secs ?? 0),
                  0
              )
            : undefined;

        return (
            <div className={standardFieldContainerStyles} key={field}>
                {!isEmpty ? (
                    <div>
                        <div className={mainRowFieldLabelStyles}>
                            {fieldLabel}
                        </div>
                        <div className={mainRowFieldTextStyles}>
                            {isDateField ? (
                                <div className="flex md:flex-col gap-x-2">
                                    <div className="truncate">{date}</div>
                                    <div className="truncate">{time}</div>
                                </div>
                            ) : isDurationField ? (
                                <div className="flex items-end gap-x-0.5 md:justify-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={
                                                "text-gray-500 text-[10px] -mb-2 -mt-1 md:mt-0"
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
                                                "text-gray-500 text-[10px] -mb-2 -mt-1 md:mt-0"
                                            }
                                        >
                                            s
                                        </div>
                                        <div>{durationStringSecs}</div>
                                    </div>
                                </div>
                            ) : isExercisesField ? (
                                <>
                                    <div>
                                        {" "}
                                        {rowItem[field].length} exercises
                                    </div>
                                    <div>
                                        {exercisesTotalDurationSecs} sec total
                                    </div>
                                </>
                            ) : (
                                <div> {rowItem[field]}</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        className={`hidden md:block ${missingFieldDashStyles}`}
                    >
                        -
                    </div>
                )}
            </div>
        );
    });

    const mainRowColorStylesByListType =
        listType && listType === "sequences"
            ? "bg-mt-orange"
            : listType && listType === "exercises"
            ? // ? "bg-gb-blue"
              //   "bg-hmt-light-blue"
              "bg-my-lime"
            : listType && listType === "favorites"
            ? "bg-my-pink"
            : "mg-mt-yellow";
    const mainRowButtonColorStylesByListType =
        listType && listType === "sequences"
            ? // ? "bg-my-red"
              //   "bg-gb-blue"
              "bg-my-red hover:bg-gb-red"
            : listType && listType === "exercises"
            ? // ? "bg-gb-blue"
              "bg-my-red hover:bg-gb-red"
            : listType && listType === "favorites"
            ? "bg-my-red hover:bg-gb-red"
            : "bg-mt-yellow";

    return (
        <div
            id="mainRowContainer"
            // className={`${commonFlexRowStyles} py-5 md:py-2 bg-my-yellow rounded-xl gap-y-1 ${commonPaddingXForHeaderContainerAndMainRow}`}
            className={`${commonFlexRowStyles}  py-5 md:py-2 rounded-xl gap-y-1 ${commonPaddingXForHeaderContainerAndMainRow} ${mainRowColorStylesByListType}`}
        >
            {/* non-action fields */}
            {standardFieldsDivs}

            {/* actions field */}
            {actionButtons.length > 0 ? (
                <div
                    className={`${actionFieldContainerStyles} ${actionsFieldWidthStyle} ${actionButtonsContainerStyle}`}
                >
                    {actionButtons.map((actionButton, index) => {
                        return (
                            <button
                                key={index}
                                className={`${actionButtonStyles} ${mainRowButtonColorStylesByListType}`}
                                onClick={actionButton.action}
                                type="button"
                            >
                                {actionButton.title}
                            </button>
                        );
                    })}
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

interface ReusableTableProps {
    items: any;
    standardFields: string[];
    actionsFieldWidthStyle: string;
    getActionButtonsForItem: (item: any, index: number) => ActionButton[];
    listType?: string;
}

export const ReusableTable: React.FC<ReusableTableProps> = ({
    items,
    standardFields,
    actionsFieldWidthStyle,
    getActionButtonsForItem,
    listType,
}) => {
    const headerRowColorStylesByListType =
        listType && listType === "sequences"
            ? "bg-my-yellow"
            : listType && listType === "exercises"
            ? "bg-my-yellow"
            : listType && listType === "favorites"
            ? "bg-my-yellow"
            : "";

    return (
        <div>
            <div className="">
                {/* Header Row */}
                <div
                    // className={`hidden md:block bg-orange-300 rounded-xl py-2 mb-2`}
                    // className={`hidden md:block bg-gb-blue rounded-xl py-2 mb-2`}
                    // className={`hidden md:block bg-gb-orange rounded-xl py-2 mb-2`}
                    className={`hidden md:block ${headerRowColorStylesByListType} rounded-xl py-2 mb-2`}
                >
                    <HeaderRow
                        standardFields={standardFields}
                        actionsFieldWidthStyle={actionsFieldWidthStyle}
                        listType={listType}
                    />
                </div>
                {/* Main Rows */}
                <div
                    id="allMainRowsContainer"
                    className={allMainRowsContainerStyles}
                >
                    {items.map((item: any, index: number) => (
                        <MainRow
                            key={item.id}
                            standardFields={standardFields}
                            actionsFieldWidthStyle={actionsFieldWidthStyle}
                            rowItem={item}
                            actionButtons={getActionButtonsForItem(item, index)}
                            listType={listType}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
