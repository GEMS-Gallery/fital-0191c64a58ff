export const idlFactory = ({ IDL }) => {
  const UserPreferences = IDL.Record({
    'fitnessLevel' : IDL.Text,
    'equipment' : IDL.Vec(IDL.Text),
    'preferences' : IDL.Vec(IDL.Text),
    'goals' : IDL.Vec(IDL.Text),
  });
  const Time = IDL.Int;
  const WorkoutExercise = IDL.Record({
    'name' : IDL.Text,
    'reps' : IDL.Nat,
    'sets' : IDL.Nat,
    'completed' : IDL.Bool,
    'userDifficulty' : IDL.Text,
  });
  const WorkoutPlan = IDL.Record({
    'date' : Time,
    'exercises' : IDL.Vec(WorkoutExercise),
  });
  const Result_1 = IDL.Variant({ 'ok' : WorkoutPlan, 'err' : IDL.Text });
  const Exercise = IDL.Record({
    'difficulty' : IDL.Nat,
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  const WorkoutProgress = IDL.Record({
    'completedExercises' : IDL.Vec(WorkoutExercise),
    'date' : Time,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'generateWorkoutPlan' : IDL.Func([UserPreferences], [Result_1], []),
    'getCurrentWorkoutPlan' : IDL.Func([], [IDL.Opt(WorkoutPlan)], ['query']),
    'getExerciseLibrary' : IDL.Func([], [IDL.Vec(Exercise)], ['query']),
    'getWorkoutProgress' : IDL.Func([], [IDL.Vec(WorkoutProgress)], ['query']),
    'saveWorkoutProgress' : IDL.Func([], [Result], []),
    'updateExerciseStatus' : IDL.Func(
        [IDL.Text, IDL.Bool, IDL.Text],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
