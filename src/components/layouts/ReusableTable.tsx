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
}

export const MainRow: React.FC<MainRowProps> = ({
    standardFields,
    actionsFieldWidthStyle,
    rowItem,
    actionButtons,
}) => {
    const standardFieldsDivs = standardFields.map((field) => {
        const isDurationField = field === "duration";
        const isCreatedField = field === "created_at";
        const isUpdatedField = field === "updated_at";
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

    return (
        <div
            id="mainRowContainer"
            className={`${commonFlexRowStyles} pt-4 md:py-2 bg-yellow-300 pb-4 rounded-xl gap-y-1 ${commonPaddingXForHeaderContainerAndMainRow}`}
        >
            {/* non-action fields */}
            {standardFieldsDivs}

            {/* actions field */}
            {actionButtons.length > 0 ? (
                <div
                    className={`${actionFieldContainerStyles} ${actionsFieldWidthStyle} ${actionButtonsContainerStyle}`}
                >
                    {actionButtons.map((actionButton) => {
                        return (
                            <button
                                className={actionButtonStyles}
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
}

export const ReusableTable: React.FC<ReusableTableProps> = ({
    items,
    standardFields,
    actionsFieldWidthStyle,
    getActionButtonsForItem,
}) => {
    return (
        <div>
            <div className="">
                {/* Header Row */}
                <div
                    className={`hidden md:block bg-orange-300 rounded-xl py-2 mb-2`}
                >
                    <HeaderRow
                        standardFields={standardFields}
                        actionsFieldWidthStyle={actionsFieldWidthStyle}
                    />
                </div>
                {/* Main Rows */}
                <div
                    id="allMainRowsContainer"
                    className={allMainRowsContainerStyles}
                >
                    {items.map((item: any, index: number) => (
                        <MainRow
                            key={index}
                            standardFields={standardFields}
                            actionsFieldWidthStyle={actionsFieldWidthStyle}
                            rowItem={item}
                            actionButtons={getActionButtonsForItem(item, index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
