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
  description: string;
  notes: string;
  created_at: string;
  updated_at: string;
  exercises: Exercise[];
}

export interface SequenceFormInputs {
  name: string;
  description: string;
  notes: string;
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
  direction: string;
  duration_mins: number;
  duration_secs: number;
  resistance: string;
  notes: string;
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
  direction: string;
  durationMinutes: number;
  durationSeconds: number;
  resistance: string;
  notes: string;
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
