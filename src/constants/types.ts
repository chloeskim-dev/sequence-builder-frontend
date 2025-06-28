// export interface Sequence {
//   name: string;
//   items: Item[];
//   createdDate: number;
//   lastEditDate: number | null;
// }

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
  createdAt: string;
  updatedAt: string;
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
  name: string;
  direction: string;
  durationMins: number;
  durationSecs: number;
  resistance: string;
  notes: string;
}

export interface Exercise {
  id: string;
  name: string;
  direction: string;
  durationSecs: number;
  resistance: string;
  notes: string;
  createdAt: string;
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

// let exercise_1: Exercise = {
//   id: "2222222-2222-2222-2222-222222222222",
//   name: "exercise 1 name",
//   direction: "exercise 1 direction",
//   duration_secs: 30,
//   resistance: "left",
//   notes: "exercise 1 notes",
//   created_at: "2025-06-13 21:38:17.099782",
//   order_index: 1,
// };

// let exercise_2: Exercise = {
//   id: "3333333-3333-3333-3333-333333333333",
//   name: "exercise 1 name",
//   direction: "exercise 1 direction",
//   duration_secs: 30,
//   resistance: "left",
//   notes: "exercise 1 notes",
//   created_at: "2025-06-13 21:38:17.099782",
//   order_index: 1,
// };

// let sequence_1: _Sequence = {
//   id: "1111111-1111-1111-1111-111111111111",
//   name: "sequence 1 name",
//   description: "sequence 1 description",
//   notes: "sequence 1 notes",
//   created_at: "2025-06-13 21:38:17.099782",
//   updated_at: "2025-06-13 21:38:17.099782",
//   exercises: [exercise_1, exercise_2],
// };

// let favorite_exercise_1: FavoriteExercise = {
//   id: "44444444-4444-4444-444444444444",
//   name: "favorite exercise 1 name",
//   direction: "favorite exercise 1 direction",
//   duration_secs: 20,
//   resistance: "favorite exercise 1 resistance",
//   notes: "favorite exercise 1 notes",
//   created_at: "2025-06-13 21:38:17.099782",
// };
