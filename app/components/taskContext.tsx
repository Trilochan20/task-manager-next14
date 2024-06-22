"use client";
import React, { createContext, useReducer, useContext } from "react";
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
  const [state, dispatch] = useReducer(taskReducer, initialTaskStatus);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
