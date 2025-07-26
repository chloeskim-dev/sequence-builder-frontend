// Page Layout
export const pageOutermostFlexColStyles = "mx-4 flex flex-col gap-y-4";

// Font size
export const responsiveTextStyles = "text-sm md:text-md xl:text-lg";

// Reusable Table
export const headerRowTextStyles =
    "truncate text-xs lg:text-sm text-center font-bold";
export const mainRowFieldTextStyles =
    "line-clamp-2 overflow-hidden break-words text-sm md:text-xs lg:text-sm font-normal md:text-center";
export const mainRowFieldLabelStyles =
    "md:hidden text-sm font-extrabold capitalize";
export const missingFieldDashStyles = "text-sm text-center text-gray-800";
export const allMainRowsContainerStyles = `flex flex-col gap-y-2`;
export const actionButtonStyles =
    "text-white py-1.5 px-2.5 rounded text-xs font-semibold uppercase";
export const standardFieldContainerStyles =
    "flex-1 flex-shrink-0 overflow-hidden";
export const actionsFieldWidthStyle = "w-[150px]";
export const actionFieldContainerStyles = `${actionsFieldWidthStyle}`;
export const actionButtonsContainerStyle =
    "flex gap-x-2 md:justify-center pt-1 md:pt-0";
export const rightMarginSameWidthAsScrollbarStyle = "mr-[12px]"; // scrollbar for main rows container is set to exactly 12px
export const commonPaddingXForHeaderContainerAndMainRow = "px-6 md:px-8";
export const commonFlexRowStyles =
    "flex flex-col md:flex-row gap-x-12 md:items-center justify-center";

// Sequence Exercises DnD List
export const sequenceExercisesListDroppableContainerStyles =
    "space-y-4 scrollbar-custom p-2";
export const sequenceExercisesListContainerStyles = "mt-2";
export const sequenceExercisesListHeadRowStyles =
    "hidden md:flex md:gap-2 text-left text-xs font-bold items-end pb-2 md:ml-[20px] md:mr-[40px] bg-red-400";
export const sequenceExerciseActionsColumnWidth = "w-[80px]";

// Buttons
export const createNewButtonStyles = `${responsiveTextStyles} bg-hmx-dark-aqua rounded text-white font-extrabold uppercase`;
export const dashboardButtonTextStyles =
    "bg-gb-yellow text-lg font-extrabold px-6 py-2 flex items-center justify-center gap-3 rounded-xl";

// ItemFieldsList
export const detailsListFieldColStyles = "flex flex-col gap-y-0.5";
export const detailsListInsideModalTextStyles = "font-semibold text-gb-bg";
export const detailsListInsideModalLabelStyles =
    "font-extrabold text-hmt-dark-option4";

// Delete Confirm Modal
export const deleteItemNameHighlightTextStyles = "font-extrabold text-my-red";
export const deleteConfirmModalTextStyles =
    "flex flex-col gap-y-2 font-semibold text-hmt-dark-option2 text-center break-words";

// Form related
export const commonLabelStyles = "font-extrabold";
export const commonTextStyles = "font-semibold ";
export const formTextInputStyles = `${commonTextStyles} w-full border-b-2 pt-0.5 truncate`;
export const formTextAreaInputStyles = `${commonTextStyles} w-full border-b-2 pt-0.5`;
export const formFieldsFlexColStyles = "flex-1 flex flex-col space-y-6";
export const errorMessageStyles = "text-gb-red text-sm font-bold mt-1";
export const durationsPartTextStyles =
    "text-hmt-dark-option4 text-[12px] -mb-2 -mt-2 font-bold";

// Etc
export const fieldColumnStyles = "self-start";
export const commonFlexColStyles = "flex flex-col gap-y-0.5";
