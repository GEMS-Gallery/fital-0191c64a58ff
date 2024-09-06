import Hash "mo:base/Hash";

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
  type UserProfile = {
    id: Nat;
    goals: Text;
    fitnessLevel: Nat;
    preferences: [Text];
  };

  type Exercise = {
    name: Text;
    description: Text;
    difficulty: Nat;
  };

  type WorkoutPlan = {
    userId: Nat;
    exercises: [(Text, Nat, Nat)]; // (exercise name, sets, reps)
  };

  type WorkoutProgress = {
    userId: Nat;
    date: Time.Time;
    completedExercises: [(Text, Nat, Nat)]; // (exercise name, sets, reps)
  };

  type PlanAdjustments = {
    addExercises: [Text];
    removeExercises: [Text];
  };

  stable var nextUserId : Nat = 0;
  let userProfiles = HashMap.HashMap<Nat, UserProfile>(0, Nat.equal, Hash.hash);
  let workoutPlans = HashMap.HashMap<Nat, WorkoutPlan>(0, Nat.equal, Hash.hash);
  let progressHistory = HashMap.HashMap<Nat, [WorkoutProgress]>(0, Nat.equal, Hash.hash);

  let exerciseLibrary : [Exercise] = [
    { name = "Push-ups"; description = "Standard push-ups"; difficulty = 2 },
    { name = "Squats"; description = "Bodyweight squats"; difficulty = 2 },
    { name = "Lunges"; description = "Forward lunges"; difficulty = 2 },
    { name = "Plank"; description = "Standard plank hold"; difficulty = 3 },
    { name = "Burpees"; description = "Full body burpees"; difficulty = 4 },
  ];

  public func createUserProfile(profile: UserProfile) : async Result.Result<Nat, Text> {
    let userId = nextUserId;
    nextUserId += 1;
    let newProfile = {
      id = userId;
      goals = profile.goals;
      fitnessLevel = profile.fitnessLevel;
      preferences = profile.preferences;
    };
    userProfiles.put(userId, newProfile);
    #ok(userId)
  };

  public query func getUserProfile(userId: Nat) : async ?UserProfile {
    userProfiles.get(userId)
  };

  public func generateWorkoutPlan(userId: Nat) : async Result.Result<WorkoutPlan, Text> {
    switch (userProfiles.get(userId)) {
      case null { #err("User not found") };
      case (?profile) {
        let exercises = Array.tabulate<(Text, Nat, Nat)>(5, func(i) {
          let exercise = exerciseLibrary[i % exerciseLibrary.size()];
          (exercise.name, 3, 10) // Default to 3 sets of 10 reps
        });
        let plan = {
          userId = userId;
          exercises = exercises;
        };
        workoutPlans.put(userId, plan);
        #ok(plan)
      };
    }
  };

  public query func getExerciseLibrary() : async [Exercise] {
    exerciseLibrary
  };

  public func logWorkoutProgress(userId: Nat, progress: WorkoutProgress) : async Result.Result<(), Text> {
    switch (progressHistory.get(userId)) {
      case null {
        progressHistory.put(userId, [progress]);
      };
      case (?history) {
        progressHistory.put(userId, Array.append(history, [progress]));
      };
    };
    #ok(())
  };

  public query func getProgressHistory(userId: Nat) : async [WorkoutProgress] {
    switch (progressHistory.get(userId)) {
      case null { [] };
      case (?history) { history };
    }
  };

  public func adjustWorkoutPlan(userId: Nat, adjustments: PlanAdjustments) : async Result.Result<WorkoutPlan, Text> {
    switch (workoutPlans.get(userId)) {
      case null { #err("Workout plan not found") };
      case (?plan) {
        let updatedExercises = Array.filter<(Text, Nat, Nat)>(plan.exercises, func(ex) {
          not Array.exists<Text>(adjustments.removeExercises, func(name) { name == ex.0 })
        });
        let newExercises = Array.map<Text, (Text, Nat, Nat)>(adjustments.addExercises, func(name) {
          (name, 3, 10) // Default to 3 sets of 10 reps for new exercises
        });
        let finalExercises = Array.append<(Text, Nat, Nat)>(updatedExercises, newExercises);
        let updatedPlan = {
          userId = userId;
          exercises = finalExercises;
        };
        workoutPlans.put(userId, updatedPlan);
        #ok(updatedPlan)
      };
    }
  };
}
