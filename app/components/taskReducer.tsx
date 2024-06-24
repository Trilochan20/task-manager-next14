"use client";

import { Columns } from "../types/types";

type Action =
  | {
      type: "MOVE_TASK";
      payload: { sourceId: string; destinationId: string; taskId: string };
    }
  | {
      type: "ADD_TASK";
      payload: { columnId: string; task: { id: string; content: string } };
    }
  | {
      // Add this block
      type: "REORDER_TASK";
      payload: { columnId: string; taskId: string; newIndex: number };
    };

export const taskReducer = (state: Columns, action: Action): Columns => {
  switch (action.type) {
    case "MOVE_TASK":
      const { sourceId, destinationId, taskId } = action.payload;
      const sourceColumn = state[sourceId];
      const destinationColumn = state[destinationId];
      const foundTask = sourceColumn.items.find((item) => item.id === taskId);
      if (!foundTask) return state;

      return {
        ...state,
        [sourceId]: {
          ...sourceColumn,
          items: sourceColumn.items.filter((item) => item.id !== taskId),
        },
        [destinationId]: {
          ...destinationColumn,
          items: [...destinationColumn.items, foundTask],
        },
      };

    case "ADD_TASK":
      const { columnId, task } = action.payload;
      return {
        ...state,
        [columnId]: {
          ...state[columnId],
          items: [...state[columnId].items, task].filter(
            (item) => item !== undefined
          ), // Ensure no undefined items
        },
      };
    case "REORDER_TASK": {
      const { columnId, taskId, newIndex } = action.payload;
      const column = state[columnId];
      const currentItems = [...column.items];
      const currentItemIndex = currentItems.findIndex(
        (item) => item.id === taskId
      );
      const [reorderedItem] = currentItems.splice(currentItemIndex, 1);
      currentItems.splice(newIndex, 0, reorderedItem);

      return {
        ...state,
        [columnId]: {
          ...column,
          items: currentItems,
        },
      };
    }

    default:
      return state;
  }
};
