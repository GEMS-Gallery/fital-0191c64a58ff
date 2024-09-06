import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Exercise {
  'difficulty' : bigint,
  'name' : string,
  'description' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : WorkoutPlan } |
  { 'err' : string };
export type Time = bigint;
export interface UserPreferences {
  'fitnessLevel' : string,
  'equipment' : Array<string>,
  'preferences' : Array<string>,
  'goals' : Array<string>,
}
export interface WorkoutExercise {
  'name' : string,
  'reps' : bigint,
  'sets' : bigint,
  'completed' : boolean,
  'userDifficulty' : string,
}
export interface WorkoutPlan {
  'date' : Time,
  'exercises' : Array<WorkoutExercise>,
}
export interface WorkoutProgress {
  'completedExercises' : Array<WorkoutExercise>,
  'date' : Time,
}
export interface _SERVICE {
  'generateWorkoutPlan' : ActorMethod<[UserPreferences], Result_1>,
  'getCurrentWorkoutPlan' : ActorMethod<[], [] | [WorkoutPlan]>,
  'getExerciseLibrary' : ActorMethod<[], Array<Exercise>>,
  'getWorkoutProgress' : ActorMethod<[], Array<WorkoutProgress>>,
  'saveWorkoutProgress' : ActorMethod<[], Result>,
  'updateExerciseStatus' : ActorMethod<[string, boolean, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
