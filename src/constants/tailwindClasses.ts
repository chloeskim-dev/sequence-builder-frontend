// Page Layout
export const pageOutermostFlexColStyles =
    "mx-4 flex flex-col gap-y-4 items-center h-full";

// Text
export const responsiveTextStyles = "text-sm md:text-md xl:text-lg";
export const infoTextStyles = "text-hmx-light-option4 font-semibold";
export const warningTextStyles = "text-my-red font-semibold";
export const errorTextStyles = "text-red-600 font-semibold";

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
export const createNewButtonStyles = `text-[16px] bg-my-green rounded text-nv-bg font-extrabold py-2`;
export const dashboardButtonTextStyles =
    "bg-gb-yellow text-lg font-extrabold px-6 py-2 flex items-center justify-center gap-3 rounded-xl";

// ItemFieldsList
export const detailsListFieldStyles = "";
// export const defaultItemFieldsListTextStyles = "font-semibold text-nv-green";
// export const defaultItemFieldsListLabelStyles =
//     "capitalize font-extrabold text-nv-yellow";
export const defaultItemFieldsListTextStyles = "text-gb-bg";
export const defaultItemFieldsListLabelStyles =
    // "capitalize font-bold text-hmt-dark-option4";
    "capitalize font-bold text-gray-500";

// Delete Confirm Modal
export const deleteItemNameHighlightTextStyles = "font-extrabold text-my-red";
export const deleteConfirmModalTextStyles = `flex flex-col gap-y-2 text-sm text-hmt-dark-option2 font-semibold text-center break-words`;

// Form related
export const labelForTextAreaStyles = "";
export const formGridColStyles = "grid grid-cols-2 gap-4 items-center";
export const detailsListGridColStyles = "grid grid-cols-2 gap-4";
export const commonLabelStyles = `font-extrabold text-gray-5 ${responsiveTextStyles}`;
export const commonTextStyles = "";
export const formTextInputStyles = `${commonTextStyles} ${responsiveTextStyles} w-full truncate border-gray-5 focus:shadow-none`;
export const formTextAreaInputStyles = `${commonTextStyles} ${responsiveTextStyles} w-full truncate border-b-gray-5 focus:shadow-none`;
export const formFieldsFlexColStyles = "flex-1 flex flex-col space-y-6";
export const errorMessageStyles = "text-gb-red text-sm font-bold mt-1";
export const durationsPartTextStyles = `${responsiveTextStyles} font-bold text-gray-6"`;

// Etc
export const fieldColumnStyles = "self-start";
export const commonFlexColStyles = "flex flex-col gap-y-0.5";

export const sequencesTableGridColStyles =
    "lg:grid-cols-[minmax(100px,_1fr)_minmax(100px,_1fr)_minmax(100px,_1fr)_minmax(100px,_1fr)_minmax(100px,_1fr)_270px]";
// action button width = 47.63px
// gap between action buttons = 10px
// last col === action buttons col, so the last col width should be set to
// = ( # action buttons - 1 ) * ( 10px ) + ( # of action buttons ) * (47.63px)

export const favoriteExercisesTableGridColStyles =
    "lg:grid-cols-[minmax(100px,_1fr)_minmax(100px,_1fr)_minmax(50px,_1fr)_minmax(100px,_1fr)_minmax(100px,_1fr)_185px]";
export const favoriteExercisesDropdownTableGridColStyles =
    "lg:grid-cols-[minmax(100px,_1fr)_minmax(100px,_1fr)_minmax(50px,_1fr)_minmax(100px,_1fr)_minmax(100px,_1fr)_0px]";
export const sequenceFormExerciseGridColStyles =
    "lg:grid-cols-[minmax(70px,_1fr)_minmax(70px,_1fr)_minmax(50px,_1fr)_minmax(70px,_1fr)_minmax(70px,_1fr)_175px]";
