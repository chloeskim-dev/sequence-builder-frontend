// Page Layout
export const pageOutermostFlexColStyles = "mx-4 flex flex-col gap-y-4";

// Font size
export const responsiveTextStyles = "text-sm md:text-md xl:text-lg";

// Reusable Table
export const headerRowTextStyles =
    "truncate text-xs lg:text-sm text-center font-bold";
export const mainRowFieldTextStyles =
    "line-clamp-2 overflow-hidden break-words text-xs font-normal lg:text-center";
export const mainRowFieldLabelStyles =
    "lg:hidden text-sm font-extrabold capitalize";
export const missingFieldDashStyles = "text-sm text-center text-gray-800";
export const allMainRowsContainerStyles = `flex flex-col gap-y-2`;
export const actionButtonStyles =
    "text-white md:flex-1 py-1.5 px-2.5 rounded text-xs font-semibold uppercase";
export const standardFieldContainerStyles =
    "flex-1 flex-shrink-0 overflow-hidden";
export const actionsFieldWidthStyle = "w-[250px]";
export const actionFieldContainerStyles = `lg:w-[250px]`;
export const actionButtonsContainerStyle =
    "flex gap-x-2 lg:justify-center mt-1 lg:mt-0";
export const rightMarginSameWidthAsScrollbarStyle = "mr-[12px]"; // scrollbar for main rows container is set to exactly 12px
export const commonPaddingXForHeaderContainerAndMainRow = "px-6 lg:px-8";
export const commonFlexRowStyles =
    "flex flex-col lg:flex-row gap-x-12 lg:items-center justify-center";

// Sequence Exercises DnD List
export const sequenceExercisesListDroppableContainerStyles =
    "space-y-4 scrollbar-custom p-2";
export const sequenceExercisesListContainerStyles = "mt-2 w-full";
export const sequenceExercisesListHeadRowStyles =
    "hidden lg:flex lg:gap-2 text-left text-xs font-bold items-end pb-2 lg:ml-[20px] lg:mr-[40px] bg-red-400";
export const sequenceExerciseActionsColumnWidth = "w-[80px]";

// Buttons
export const createNewButtonStyles = `${responsiveTextStyles} bg-hmx-dark-aqua rounded text-white font-extrabold`;
export const dashboardButtonTextStyles =
    "bg-gb-yellow text-lg font-extrabold px-6 py-2 flex items-center justify-center gap-3 rounded-xl";

// ItemFieldsList
export const detailsListFieldStyles = "";
export const detailsListInsideModalTextStyles = "font-semibold text-gb-bg";
export const detailsListInsideModalLabelStyles =
    "capitalize font-extrabold text-hmt-dark-option4";

// Delete Confirm Modal
export const deleteItemNameHighlightTextStyles = "font-extrabold text-my-red";
export const deleteConfirmModalTextStyles =
    "flex flex-col gap-y-2 font-semibold text-hmt-dark-option2 text-center break-words";

// Form related
export const labelForTextAreaStyles = "";
export const formGridColStyles = "grid grid-cols-2 gap-4 items-center";
export const detailsListGridColStyles = "grid grid-cols-2 gap-4";
export const commonLabelStyles = "font-extrabold";
export const commonTextStyles = "font-semibold ";
export const formTextInputStyles = `${commonTextStyles} ${responsiveTextStyles} w-full truncate border-b-hmt-dark-option4`;
export const formTextAreaInputStyles = `${commonTextStyles} ${responsiveTextStyles} w-full truncate border-b-hmt-dark-option4`;
export const formFieldsFlexColStyles = "flex-1 flex flex-col space-y-6";
export const errorMessageStyles = "text-gb-red text-sm font-bold mt-1";
export const durationsPartTextStyles = `${responsiveTextStyles} text-hmt-dark-option4 font-bold`;

// Etc
export const fieldColumnStyles = "self-start";
export const commonFlexColStyles = "flex flex-col gap-y-0.5";
