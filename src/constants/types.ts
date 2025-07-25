import { RegisterOptions } from "react-hook-form";

export interface Item {
    id: string;
    name: string;
    direction: "left" | "right" | null;
    duration: {
        min: number;
        sec: number;
    };
    textColor: string;
}

export interface User {
    username: string;
    email: string;
    active: string;
    roles: string;
    created_at: string;
    updated_at: string;
}

export interface Sequence {
    id: string;
    userId: string;
    name: string;
    description?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    exercises: Exercise[];
}

export interface SequenceFormInputs {
    name: string;
    description?: string;
    notes?: string;
    exercises: ExerciseInputs[];
}
export interface SequenceRequest {
    name: string;
    description: string;
    notes: string;
    exercises: ExerciseRequest[];
}

export interface ExerciseRequest {
    name: string;
    direction: string;
    duration_secs: number;
    resistance: string;
    notes: string;
    order_index: number;
}
export interface ExerciseInputs {
    id?: string;
    name: string;
    direction?: string;
    duration_mins?: number;
    duration_secs?: number;
    resistance?: string;
    notes?: string;
}

export interface Exercise {
    id: string;
    name: string;
    direction?: string;
    duration_secs?: number;
    resistance?: string;
    notes?: string;
    created_at: string;
    orderIndex: number;
}

export interface FavoriteExercise {
    id: string;
    user_id: string;
    name: string;
    direction: string;
    duration_secs: number;
    resistance: string;
    notes: string;
    created_at: string;
}

export interface FavoriteExerciseFormInputs {
    name: string;
    direction?: string;
    duration_mins?: number;
    duration_secs?: number;
    resistance?: string;
    notes?: string;
}

export interface FavoriteExerciseRequest {
    id?: string;
    name: string;
    direction: string;
    duration_secs: number;
    resistance: string;
    notes: string;
}

export interface UserSettings {
    preferred_interval_secs: number;
    use_dark_theme: boolean;
}

export interface SequencePayload {
    user_id: string;
    name: string;
    description?: string;
    notes?: string;
    exercises: {
        name: string;
        description?: string;
        resistance?: string;
        notes?: string;
        duration_secs?: number;
        order_index: number;
    }[];
}

export interface FieldConfig {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    rules?: RegisterOptions;
    rows?: number; // for textarea
    inputClassName?: string;
}

export interface RawFullSequence {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    exercises: RawExercise[];
}

export interface RawExercise {
    id: string;
    name: string;
    direction: string | null;
    duration_secs: number | null;
    resistance: string | null;
    notes: string | null;
    created_at: string;
    orderIndex: number;
}

export interface CleanedFullSequence {
    id: string;
    userId: string;
    name: string;
    description?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    exercises: CleanedUpExercise[];
}

export interface CleanedUpExercise {
    id: string;
    name: string;
    direction?: string;
    duration_secs?: number;
    resistance?: string;
    notes?: string;
    created_at: string;
    orderIndex: number;
    user_id: string;
}

export interface RawFavoriteExercise {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    direction: string | null;
    duration_secs: number | null;
    resistance: string | null;
    notes: string | null;
}
export interface CleanedUpFavoriteExercise {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    direction?: string;
    duration_secs?: number;
    resistance?: string;
    notes?: string;
}
export interface FavoriteExerciseBasePayload {
    user_id: string;
    name: string;
    direction?: string;
    duration_secs?: number;
    resistance?: string;
    notes?: string;
}
