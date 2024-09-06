import React, { createContext, useContext, useState, ReactNode } from 'react';

type WorkoutExercise = {
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
  userDifficulty: string;
};

type WorkoutPlan = {
  exercises: WorkoutExercise[];
  date: bigint;
};

type WorkoutContextType = {
  workoutPlan: WorkoutPlan | null;
  setWorkoutPlan: (plan: WorkoutPlan | null) => void;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

type WorkoutProviderProps = {
  children: ReactNode;
};

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);

  return (
    <WorkoutContext.Provider value={{ workoutPlan, setWorkoutPlan }}>
      {children}
    </WorkoutContext.Provider>
  );
};
