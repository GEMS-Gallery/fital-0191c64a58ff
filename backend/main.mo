import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Int "mo:base/Int";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Option "mo:base/Option";

actor {
  type UserPreferences = {
    goals: [Text];
    fitnessLevel: Text;
    preferences: [Text];
    equipment: [Text];
  };

  type Exercise = {
    name: Text;
    description: Text;
    difficulty: Nat;
  };

  type WorkoutPlan = {
    exercises: [(Text, Nat, Nat)]; // (exercise name, sets, reps)
  };

  type WorkoutProgress = {
    date: Time.Time;
    completedExercises: [(Text, Nat, Nat, Bool)]; // (exercise name, sets, reps, completed)
  };

  let exerciseLibrary : [Exercise] = [
    { name = "Push-ups"; description = "Standard push-ups"; difficulty = 2 },
    { name = "Squats"; description = "Bodyweight squats"; difficulty = 2 },
    { name = "Lunges"; description = "Forward lunges"; difficulty = 2 },
    { name = "Plank"; description = "Standard plank hold"; difficulty = 3 },
    { name = "Burpees"; description = "Full body burpees"; difficulty = 4 },
  ];

  public func generateWorkoutPlan(preferences: UserPreferences) : async Result.Result<WorkoutPlan, Text> {
    let difficultyLevel = switch (preferences.fitnessLevel) {
      case "Beginner" 1;
      case "Intermediate" 2;
      case "Advanced" 3;
      case _ 1;
    };

    let filteredExercises = Array.filter(exerciseLibrary, func(ex: Exercise) : Bool {
      ex.difficulty <= difficultyLevel + 1
    });

    let selectedExercises = Array.tabulate<(Text, Nat, Nat)>(5, func(i) {
      let exercise = filteredExercises[i % filteredExercises.size()];
      let (sets, reps) = switch (preferences.fitnessLevel) {
        case "Beginner" (2, 8);
        case "Intermediate" (3, 10);
        case "Advanced" (4, 12);
        case _ (2, 8);
      };
      (exercise.name, sets, reps)
    });

    #ok({ exercises = selectedExercises })
  };

  public query func getExerciseLibrary() : async [Exercise] {
    exerciseLibrary
  };

  public func logWorkoutProgress(progress: WorkoutProgress) : async Result.Result<(), Text> {
    // Here you would typically save the progress to some persistent storage
    // For now, we'll just return a success result
    #ok(())
  };
}
