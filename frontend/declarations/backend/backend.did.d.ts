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
export interface WorkoutPlan { 'exercises' : Array<[string, bigint, bigint]> }
export interface WorkoutProgress {
  'completedExercises' : Array<[string, bigint, bigint, boolean]>,
  'date' : Time,
}
export interface _SERVICE {
  'generateWorkoutPlan' : ActorMethod<[UserPreferences], Result_1>,
  'getExerciseLibrary' : ActorMethod<[], Array<Exercise>>,
  'logWorkoutProgress' : ActorMethod<[WorkoutProgress], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
