import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Exercise {
  'difficulty' : bigint,
  'name' : string,
  'description' : string,
}
export interface PlanAdjustments {
  'addExercises' : Array<string>,
  'removeExercises' : Array<string>,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : WorkoutPlan } |
  { 'err' : string };
export type Result_2 = { 'ok' : bigint } |
  { 'err' : string };
export type Time = bigint;
export interface UserProfile {
  'id' : bigint,
  'fitnessLevel' : bigint,
  'preferences' : Array<string>,
  'goals' : string,
}
export interface WorkoutPlan {
  'userId' : bigint,
  'exercises' : Array<[string, bigint, bigint]>,
}
export interface WorkoutProgress {
  'completedExercises' : Array<[string, bigint, bigint, boolean]>,
  'userId' : bigint,
  'date' : Time,
}
export interface _SERVICE {
  'adjustWorkoutPlan' : ActorMethod<[bigint, PlanAdjustments], Result_1>,
  'createUserProfile' : ActorMethod<[UserProfile], Result_2>,
  'generateWorkoutPlan' : ActorMethod<[bigint], Result_1>,
  'getExerciseLibrary' : ActorMethod<[], Array<Exercise>>,
  'getProgressHistory' : ActorMethod<[bigint], Array<WorkoutProgress>>,
  'getUserProfile' : ActorMethod<[bigint], [] | [UserProfile]>,
  'logWorkoutProgress' : ActorMethod<[bigint, WorkoutProgress], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
