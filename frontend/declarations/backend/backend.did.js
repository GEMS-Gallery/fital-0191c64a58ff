export const idlFactory = ({ IDL }) => {
  const UserPreferences = IDL.Record({
    'fitnessLevel' : IDL.Text,
    'equipment' : IDL.Vec(IDL.Text),
    'preferences' : IDL.Vec(IDL.Text),
    'goals' : IDL.Vec(IDL.Text),
  });
  const WorkoutPlan = IDL.Record({
    'exercises' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat, IDL.Nat)),
  });
  const Result_1 = IDL.Variant({ 'ok' : WorkoutPlan, 'err' : IDL.Text });
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
    'date' : Time,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'generateWorkoutPlan' : IDL.Func([UserPreferences], [Result_1], []),
    'getExerciseLibrary' : IDL.Func([], [IDL.Vec(Exercise)], ['query']),
    'logWorkoutProgress' : IDL.Func([WorkoutProgress], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
