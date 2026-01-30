import styles from "../../styles/global.module.scss";
import { formatUtcToLocalTrimmed } from "../../utils/timeHelpers";
import { combineDuration, splitDuration } from "../../utils/durationHelpers";
import {
    standardFieldContainerStyles,
    missingFieldDashStyles,
} from "../../constants/tailwindClasses";
import { SortDirection } from "../../utils/listHelpers";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";

// COMPACT TABLE = HEADER ROW + CONTENT ROWS

interface CompactTableProps {
    getActionButtonsForItem: (item: any, index: number) => React.ReactNode[];
    gridColStyles?: string;
    items: any;
    listType?: string;
    onEntireRowClick?: (rowItem: number) => void;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    setSortDirection: React.Dispatch<React.SetStateAction<SortDirection>>;
    sortBy: string;
    sortDirection: SortDirection;
    standardFields: string[];
}

export const CompactTable: React.FC<CompactTableProps> = ({
    getActionButtonsForItem,
    gridColStyles,
    items,
    listType,
    onEntireRowClick,
    setSortBy,
    setSortDirection,
    sortBy,
    sortDirection,
    standardFields,
}) => {
    return (
        <div className="flex flex-col gap-y-3 w-full h-full">
            {/* Header Row */}
            <div>
                <HeaderRow
                    gridColStyles={gridColStyles}
                    listType={listType}
                    onEntireRowClick={onEntireRowClick}
                    setSortBy={setSortBy}
                    setSortDirection={setSortDirection}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    standardFields={standardFields}
                />
            </div>

            {/* Main Rows */}
            {items.map((item: any, index: number) => (
                <ContentRow
                    actionButtons={getActionButtonsForItem(item, index)}
                    gridColStyles={gridColStyles}
                    key={item.id}
                    listType={listType}
                    onEntireRowClick={onEntireRowClick}
                    rowItem={item}
                    standardFields={standardFields}
                />
            ))}
        </div>
    );
};

// HEADER ROW -- enables sorting & is presented as a dropdown for small screens

interface HeaderRowProps {
    standardFields: string[];
    listType?: string;
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    sortDirection: SortDirection;
    setSortDirection: React.Dispatch<React.SetStateAction<SortDirection>>;
    onEntireRowClick?: (rowItem: number, rowIndex: number) => void;
    gridColStyles?: string;
}

export const HeaderRow: React.FC<HeaderRowProps> = ({
    standardFields,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    onEntireRowClick,
    listType,
    gridColStyles,
}) => {
    const headerRowTextStyles =
        "text-nv-bg text-[14px] capitalize text-center font-bold";

    const updateSort = (field: string) => {
        setSortBy(field);
        setSortDirection(
            sortDirection === null
                ? "asc"
                : sortBy !== field
                  ? "asc"
                  : sortDirection === "asc"
                    ? "dsc"
                    : "asc",
        );
    };

    const getFieldDisplayName = (field: string) => {
        const displayName =
            field === "updated_at"
                ? "updated"
                : field === "created_at"
                  ? "created"
                  : field === "total_duration"
                    ? "total duration"
                    : field;
        return displayName;
    };

    const standardFieldsDivs = standardFields.map((field) => {
        const isTotalDurationField = field === "total_duration";
        return (
            <button
                className={`${
                    isTotalDurationField ? "break-words" : "break-all"
                }${standardFieldContainerStyles} ${headerRowTextStyles} hover:text-my-red my-2 flex gap-1 justify-center items-center`}
                onClick={() => updateSort(field)}
            >
                <div>{getFieldDisplayName(field)}</div>
                <div>
                    {sortBy === field && sortDirection === "asc" && (
                        <RxCaretUp size={20} color="red" />
                    )}
                    {sortBy === field && sortDirection === "dsc" && (
                        <RxCaretDown size={20} color="red" />
                    )}
                </div>
            </button>
        );
    });

    return (
        <>
            {/* Large Screen "Row" Version */}
            <div
                id="headerRowContainer"
                className={`hidden lg:block uppercase lg:grid lg:items-center lg:gap-4 rounded-xl px-6 py-1  ${styles["bordered--gray"]} ${gridColStyles}`}
            >
                {standardFieldsDivs}
                {!onEntireRowClick && (
                    <div className={`${headerRowTextStyles}`}>Actions</div>
                )}
            </div>
            {/* Small Screen "Dropdown" Version */}
            <div className="lg:hidden grid grid-cols-2 gap-2 items-center">
                <div className="text-right font-bold">Sorting by:</div>
                <div className="justify-self-start">
                    <select
                        onChange={(e) => updateSort(e.target.value)}
                        className="capitalize w-auto p-2 bg-transparent border-2 border-black rounded-lg"
                    >
                        {standardFields.map((field) => (
                            <option key={field} value={field}>
                                {getFieldDisplayName(field)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    );
};

// CONTENT ROW = STANDARD INFO {FIELDS} + (OPTIONAL) ACTION BUTTONS "FIELD"

interface ContentRowProps {
    actionButtons: React.ReactNode[];
    gridColStyles?: string;
    listType?: string;
    onEntireRowClick?: (rowItem: number) => void;
    rowItem: any;
    standardFields: string[];
}
export const ContentRow: React.FC<ContentRowProps> = ({
    actionButtons,
    gridColStyles,
    listType,
    onEntireRowClick,
    rowItem,
    standardFields,
}) => {
    console.log(rowItem);
    // STANDARD FIELD DIVS
    const standardFieldsDivs = standardFields.map((field) => {
        const isDurationField = field === "duration"; // duration of individual exercise
        const isCreatedField = field === "created_at";
        const isUpdatedField = field === "updated_at";
        const isTotalDurationField = field === "total_duration"; // total duration of a class
        const isDateField = isCreatedField || isUpdatedField;

        let exercisesTotalDurationSecs = isTotalDurationField
            ? rowItem["exercises"].reduce(
                  (acc: any, exercise: any) =>
                      acc + (exercise.duration_secs ?? 0),
                  0,
              )
            : undefined;

        const isEmpty = isTotalDurationField
            ? false // always displays since it determines whether class can be run
            : isDurationField
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
                  rowItem.duration_secs,
              )
            : undefined;

        const durationStringMin = hasDuration
            ? String(splitDuration(combinedDurationSecs!).splitMinutes)
            : undefined;
        const durationStringSecs = hasDuration
            ? String(
                  splitDuration(combinedDurationSecs!).splitSeconds,
              ).padStart(2, "0")
            : undefined;

        const fieldLabel = isCreatedField
            ? "created"
            : isUpdatedField
              ? "updated"
              : isTotalDurationField
                ? "total duration"
                : field;
        let date = isDateField
            ? formatUtcToLocalTrimmed(rowItem[field]).date
            : undefined;
        let time = isDateField
            ? formatUtcToLocalTrimmed(rowItem[field]).time
            : undefined;

        // for field empty values, present "-" for large screens and omit for small screens
        if (isEmpty)
            return (
                <div
                    className={`hidden lg:block lg:flex-1 lg:flex-shrink-0 overflow-hidden`}
                    key={field}
                >
                    <div className={`${missingFieldDashStyles}`}>-</div>
                </div>
            );

        return (
            <div className={`flex-1 flex-shrink-0 overflow-hidden`} key={field}>
                <div className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr] sm:gap-2 lg:block mb-1 lg:mb-0 text-nv-bg">
                    {/* field label only for small screens */}
                    <div
                        className={`lg:hidden text-sm font-extrabold text-hmt-dark-option4 capitalize sm:text-right ${
                            isDurationField && "mt-2"
                        }`}
                    >
                        {fieldLabel}
                    </div>

                    {/* field */}
                    <div
                        className={
                            "line-clamp-3 overflow-hidden break-words text-sm font-normal lg:text-center"
                        }
                    >
                        {isDateField ? (
                            <div className="flex lg:flex-col gap-x-2">
                                <div className="truncate">{date}</div>
                                <div className="truncate">{time}</div>
                            </div>
                        ) : isDurationField ? (
                            <div className="flex items-end gap-x-0.5 lg:justify-center">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={
                                            "text-gray-500 text-[10px] -mb-2 lg:mt-0"
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
                                            "text-gray-500 text-[10px] -mb-2 -mt-1 lg:mt-0"
                                        }
                                    >
                                        s
                                    </div>
                                    <div>{durationStringSecs}</div>
                                </div>
                            </div>
                        ) : isTotalDurationField ? (
                            exercisesTotalDurationSecs !== 0 ? (
                                <div className="lg:justify-center flex gap-x-2">
                                    <div
                                        className={
                                            " items-center flex gap-x-0.5"
                                        }
                                    >
                                        {String(
                                            splitDuration(
                                                exercisesTotalDurationSecs,
                                            ).splitMinutes,
                                        )}
                                        <span
                                            className={
                                                "text-hmt-dark-option4 font-bold"
                                            }
                                        >
                                            m
                                        </span>
                                    </div>
                                    <div
                                        className={
                                            "items-center flex gap-x-0.5"
                                        }
                                    >
                                        {String(
                                            splitDuration(
                                                exercisesTotalDurationSecs,
                                            ).splitSeconds,
                                        )}
                                        <span
                                            className={
                                                "text-hmt-dark-option4 font-bold"
                                            }
                                        >
                                            s
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                "-"
                            )
                        ) : (
                            <div> {rowItem[field]}</div>
                        )}
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div
            id="mainRowContainer"
            className={`w-full flex flex-col gap-2 lg:grid lg:items-center lg:gap-4 rounded-xl p-6 lg:py-5 ${gridColStyles} ${
                styles["bordered--gray"]
            }  ${onEntireRowClick ? "hover:bg-red-100 hover:cursor-pointer" : ""}`}
            onClick={() => {
                if (onEntireRowClick) onEntireRowClick(rowItem);
            }}
        >
            {standardFieldsDivs}
            {actionButtons.length > 0 ? (
                <div
                    className={`mt-2 w-full flex justify-center gap-x-[10px] lg:-mt-[8px]`}
                >
                    {actionButtons}
                </div>
            ) : (
                ""
            )}
        </div>
    );
};
