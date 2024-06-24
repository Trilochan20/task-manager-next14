"use client";
import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react";
import { Columns } from "../types/types";
import { taskReducer } from "./taskReducer";

interface TaskContextType {
  state: Columns;
  dispatch: React.Dispatch<any>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialTaskStatus: Columns = {
  requested: {
    name: "Requested",
    items: [],
  },
  accepted: {
    name: "Accepted",
    items: [],
  },
  inProgress: {
    name: "In Progress",
    items: [],
  },
  done: {
    name: "Done",
    items: [],
  },
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<Columns>(initialTaskStatus);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTasksFromLocalStorage = () => {
      if (typeof window !== "undefined") {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
          setState(JSON.parse(savedTasks));
        }
      }
      setIsLoaded(true);
    };

    loadTasksFromLocalStorage();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("tasks", JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const contextValue = React.useMemo(() => {
    return {
      state,
      dispatch: (action: any) => {
        const newState = taskReducer(state, action);
        setState(newState);
      },
    };
  }, [state]);

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
