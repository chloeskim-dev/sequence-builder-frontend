import { FieldConfig } from "./types";

export const genericExerciseFormFieldConfigs: FieldConfig[] = [
    {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "ex. reverse lunge",
        rules: {
            required: "Name is required",
            maxLength: {
                value: 100,
                message: "Name cannot exceed 100 chars",
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
                message: "Direction cannot exceed 100 chars",
            },
        },
    },
    {
        name: "duration_mins",
        label: "Minutes",
        type: "number",
        rules: {
            min: { value: 0, message: "Must be at least 0" },
            max: { value: 99, message: "Must be less than 100" },
        },
    },
    {
        name: "duration_secs",
        label: "Seconds",
        type: "number",
        rules: {
            min: { value: 0, message: "Must be at least 0" },
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
                message: "Resistance must be 100 characters or fewer",
            },
        },
    },
    {
        name: "notes",
        label: "Notes",
        type: "textarea",
        placeholder: "ex. Keep knees over ankles.",
        rules: {
            maxLength: {
                value: 500,
                message: "Notes must be 500 characters or fewer",
            },
        },
        rows: 3,
    },
];
