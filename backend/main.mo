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

  type WorkoutExercise = {
    name: Text;
    sets: Nat;
    reps: Nat;
    completed: Bool;
    userDifficulty: Text;
  };

  type WorkoutPlan = {
    exercises: [WorkoutExercise];
    date: Time.Time;
  };

  type WorkoutProgress = {
    date: Time.Time;
    completedExercises: [WorkoutExercise];
  };

  let exerciseLibrary : [Exercise] = [
    { name = "Push-ups"; description = "Standard push-ups"; difficulty = 2 },
    { name = "Squats"; description = "Bodyweight squats"; difficulty = 2 },
    { name = "Lunges"; description = "Forward lunges"; difficulty = 2 },
    { name = "Plank"; description = "Standard plank hold"; difficulty = 3 },
    { name = "Burpees"; description = "Full body burpees"; difficulty = 4 },
  ];

  var currentWorkoutPlan : ?WorkoutPlan = null;
  var workoutProgress : [WorkoutProgress] = [];

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

    let selectedExercises = Array.tabulate<WorkoutExercise>(5, func(i) {
      let exercise = filteredExercises[i % filteredExercises.size()];
      let (sets, reps) = switch (preferences.fitnessLevel) {
        case "Beginner" (2, 8);
        case "Intermediate" (3, 10);
        case "Advanced" (4, 12);
        case _ (2, 8);
      };
      {
        name = exercise.name;
        sets = sets;
        reps = reps;
        completed = false;
        userDifficulty = "Medium";
      }
    });

    let plan = {
      exercises = selectedExercises;
      date = Time.now();
    };
    currentWorkoutPlan := ?plan;
    #ok(plan)
  };

  public query func getCurrentWorkoutPlan() : async ?WorkoutPlan {
    currentWorkoutPlan
  };

  public func updateExerciseStatus(exerciseName: Text, completed: Bool, difficulty: Text) : async Result.Result<(), Text> {
    switch (currentWorkoutPlan) {
      case null #err("No current workout plan");
      case (?plan) {
        let updatedExercises = Array.map<WorkoutExercise, WorkoutExercise>(plan.exercises, func(ex) {
          if (ex.name == exerciseName) {
            {
              name = ex.name;
              sets = ex.sets;
              reps = ex.reps;
              completed = completed;
              userDifficulty = difficulty;
            }
          } else {
            ex
          }
        });
        currentWorkoutPlan := ?{ exercises = updatedExercises; date = plan.date };
        #ok(())
      };
    }
  };

  public func saveWorkoutProgress() : async Result.Result<(), Text> {
    switch (currentWorkoutPlan) {
      case null #err("No current workout plan to save");
      case (?plan) {
        let progress : WorkoutProgress = {
          date = Time.now();
          completedExercises = Array.filter<WorkoutExercise>(plan.exercises, func(ex) { ex.completed });
        };
        workoutProgress := Array.append<WorkoutProgress>(workoutProgress, [progress]);
        currentWorkoutPlan := null;
        #ok(())
      };
    }
  };

  public query func getWorkoutProgress() : async [WorkoutProgress] {
    workoutProgress
  };

  public query func getExerciseLibrary() : async [Exercise] {
    exerciseLibrary
  };
}
