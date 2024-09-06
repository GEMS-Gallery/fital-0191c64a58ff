export const idlFactory = ({ IDL }) => {
  const PlanAdjustments = IDL.Record({
    'addExercises' : IDL.Vec(IDL.Text),
    'removeExercises' : IDL.Vec(IDL.Text),
  });
  const WorkoutPlan = IDL.Record({
    'userId' : IDL.Nat,
    'exercises' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat, IDL.Nat)),
  });
  const Result_1 = IDL.Variant({ 'ok' : WorkoutPlan, 'err' : IDL.Text });
  const UserProfile = IDL.Record({
    'id' : IDL.Nat,
    'fitnessLevel' : IDL.Nat,
    'preferences' : IDL.Vec(IDL.Text),
    'goals' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Exercise = IDL.Record({
    'difficulty' : IDL.Nat,
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  const Time = IDL.Int;
  const WorkoutProgress = IDL.Record({
    'completedExercises' : IDL.Vec(
      IDL.Tuple(IDL.Text, IDL.Nat, IDL.Nat, IDL.Bool)
    ),
    'userId' : IDL.Nat,
    'date' : Time,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'adjustWorkoutPlan' : IDL.Func([IDL.Nat, PlanAdjustments], [Result_1], []),
    'createUserProfile' : IDL.Func([UserProfile], [Result_2], []),
    'generateWorkoutPlan' : IDL.Func([IDL.Nat], [Result_1], []),
    'getExerciseLibrary' : IDL.Func([], [IDL.Vec(Exercise)], ['query']),
    'getProgressHistory' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(WorkoutProgress)],
        ['query'],
      ),
    'getUserProfile' : IDL.Func([IDL.Nat], [IDL.Opt(UserProfile)], ['query']),
    'logWorkoutProgress' : IDL.Func([IDL.Nat, WorkoutProgress], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
