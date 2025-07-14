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
        const isDurationField = field === "duration";
        const isCreatedField = field === "created_at";

        return isDurationField ? (
            <div
                className={`${standardFieldContainerStyles} ${headerRowTextStyles}`}
            >
                {"Duration (m:s)"}
            </div>
        ) : isCreatedField ? (
            <div
                className={`${standardFieldContainerStyles} ${headerRowTextStyles}`}
            >
                {"Created"}
            </div>
        ) : (
            <div
                className={`capitalize ${standardFieldContainerStyles} ${headerRowTextStyles}`}
            >
                {field}
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

        const isEmpty = isDurationField
            ? rowItem.duration_secs === undefined ||
              rowItem.duration_secs === null ||
              !rowItem.hasOwnProperty("duration_secs")
            : rowItem[field] === undefined ||
              rowItem[field] === null ||
              !rowItem.hasOwnProperty(field);

        if (isDurationField) {
            const combinedDurationSecs = combineDuration(
                rowItem.duration_mins ? rowItem.duration_mins : 0,
                rowItem.duration_secs
            );

            const durationString = `${
                splitDuration(combinedDurationSecs).splitMinutes
            }:${String(
                splitDuration(combinedDurationSecs).splitSeconds
            ).padStart(2, "0")}`;

            return (
                <div className={standardFieldContainerStyles} key={field}>
                    {!isEmpty ? (
                        <div>
                            <div className={mainRowFieldLabelStyles}>
                                {field}
                            </div>
                            <div className="text-sm truncate break-all md:text-center overflow-hidden">
                                {durationString}
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
        }

        if (isCreatedField) {
            const { date, time } = formatUtcToLocalTrimmed(rowItem[field]);

            return (
                <div className={standardFieldContainerStyles} key={field}>
                    <div className={mainRowFieldLabelStyles}>{field}</div>
                    <div className="flex md:flex-col gap-x-2 text-sm break-words md:text-center overflow-hidden">
                        <div className="truncate">{date}</div>
                        <div>{time}</div>
                    </div>
                </div>
            );
        }

        return (
            <div className={standardFieldContainerStyles} key={field}>
                {!isEmpty ? (
                    <div className="flex flex-col">
                        <div className={mainRowFieldLabelStyles}>{field}</div>

                        <div className={mainRowFieldTextStyles}>
                            {rowItem[field]}
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
            className={`bg-red-200 ${commonFlexRowStyles} py-4 md:py-2 bg-yellow-300 rounded-xl gap-y-1 ${commonPaddingXForHeaderContainerAndMainRow}`}
        >
            {/* non-action fields */}
            {standardFieldsDivs}

            {/* actions field */}
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
        </div>
    );
};

interface ReusableListProps {
    items: any;
    standardFields: string[];
    actionsFieldWidthStyle: string;
    getActionButtonsForItem: (item: any, index: number) => ActionButton[];
}

export const ReusableList: React.FC<ReusableListProps> = ({
    items,
    standardFields,
    actionsFieldWidthStyle,
    getActionButtonsForItem,
}) => {
    return (
        <div>
            <div className="px-4 mt-2">
                {/* Header Row */}
                <div
                    className={`hidden md:block bg-orange-300 rounded-xl py-2`}
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
