import { FieldConfig } from "./types";

export const exerciseFormFieldConfigs: FieldConfig[] = [
    {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "ex. reverse lunge",
        rules: {
            required: "Name is required",
            maxLength: {
                value: 100,
                message: "Name cannot exceed 100 characters",
            },
        },
    },
    {
        name: "direction",
        label: "Direction",
        type: "text",
        placeholder: "ex. left",
        rules: {
            maxLength: {
                value: 100,
                message: "Direction cannot exceed 100 characters",
            },
        },
    },
    {
        name: "duration_mins",
        label: "Minutes",
        type: "number",
        rules: {
            min: { value: 0, message: "Cannot be negative" },
            max: { value: 999, message: "Must be less than 1000" },
        },
    },
    {
        name: "duration_secs",
        label: "Seconds",
        type: "number",
        rules: {
            min: { value: 0, message: "Cannot be negative" },
            max: { value: 999, message: "Must be less than 1000" },
        },
    },

    {
        name: "resistance",
        label: "Resistance",
        type: "text",
        placeholder: "ex. 2 yellow springs",
        rules: {
            maxLength: {
                value: 100,
                message: "Resistance cannot exceed 100 characters",
            },
        },
    },
    {
        name: "notes",
        label: "Notes",
        type: "textarea",
        rows: 3,
        placeholder: "ex. Keep knees over ankles.",
        rules: {
            maxLength: {
                value: 500,
                message: "Notes cannot exceed 500 characters",
            },
        },
    },
];

export const sequenceFormFieldConfigs: FieldConfig[] = [
    {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "ex. club pilates monday 9am class",
        rules: {
            required: "Name is required",
            maxLength: {
                value: 100,
                message: "Name cannot exceed 100 characters",
            },
        },
    },
    {
        name: "description",
        label: "Description",
        type: "text",
        placeholder: "ex. glutes-focused",
        rules: {
            maxLength: {
                value: 100,
                message: "Description cannot exceed 100 characters",
            },
        },
    },
    {
        name: "notes",
        label: "Notes",
        type: "textarea",
        rows: 3,
        placeholder: "ex. Need resistance bands.",
        rules: {
            maxLength: {
                value: 500,
                message: "Notes cannot exceed 500 characters",
            },
        },
    },
];
