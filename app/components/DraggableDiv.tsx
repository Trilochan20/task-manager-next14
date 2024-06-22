"use client";
import React, { useState } from "react";
import { Atropos } from "atropos/react";
import { useSpring, animated } from "@react-spring/web";

interface Task {
  id: string;
  content: string;
}

interface Column {
  name: string;
  items: Task[];
}

interface Columns {
  [key: string]: Column;
}

const tasks: Task[] = [
  { id: "1", content: "First task" },
  { id: "2", content: "Second task" },
  { id: "3", content: "Third task" },
  { id: "4", content: "Fourth task" },
  { id: "5", content: "Fifth task" },
];

const taskStatus: Columns = {
  requested: {
    name: "Requested",
    items: tasks,
  },
  toDo: {
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

const onDragStart = (
  event: React.DragEvent<HTMLDivElement>,
  itemId: string,
  sourceColumnId: string
) => {
  event.dataTransfer.setData("itemId", itemId);
  event.dataTransfer.setData("sourceColumnId", sourceColumnId);
};

const onDrop = (
  event: React.DragEvent<HTMLDivElement>,
  destinationColumnId: string,
  columns: Columns,
  setColumns: React.Dispatch<React.SetStateAction<Columns>>
) => {
  event.preventDefault();
  const itemId = event.dataTransfer.getData("itemId");
  const sourceColumnId = event.dataTransfer.getData("sourceColumnId");

  if (sourceColumnId !== destinationColumnId) {
    const sourceColumn = columns[sourceColumnId];
    const destColumn = columns[destinationColumnId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(
      sourceItems.findIndex((item) => item.id === itemId),
      1
    );
    destItems.splice(destItems.length, 0, removed);
    setColumns({
      ...columns,
      [sourceColumnId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destinationColumnId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[sourceColumnId];
    const copiedItems = [...column.items];
    const draggedItemIndex = copiedItems.findIndex(
      (item) => item.id === itemId
    );
    const [removed] = copiedItems.splice(draggedItemIndex, 1);

    // Get the drop index from the event's target
    const dropTarget = event.target as HTMLElement;
    const dropIndex = Array.from(
      dropTarget?.parentNode?.children || []
    ).indexOf(dropTarget);

    // Insert the item at the correct position
    copiedItems.splice(dropIndex, 0, removed);

    setColumns({
      ...columns,
      [sourceColumnId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
};

function DraggableDiv() {
  const [columns, setColumns] = useState<Columns>(taskStatus);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [springProps, setSpring] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 20 },
  }));

  const getItemClass = (columnId: string, itemId: string) => {
    const baseClass = `user-select-none cursor-grab p-4 mb-4 min-h-[50px] text-white 
      rounded-lg font-sm backdrop-filter backdrop-blur-lg bg-opacity-30`;
    const columnClass =
      {
        toDo: "bg-blue-500 border-blue-500",
        inProgress: "bg-orange-500 border-orange-500",
        done: "bg-green-500 border-green-500",
        default: "bg-gray-500 border-gray-500",
      }[columnId] || "bg-gray-500 border-gray-500";

    const draggingClass =
      draggingItem === itemId
        ? "transition-transform duration-300 ease-in-out"
        : "";

    return `${baseClass} ${columnClass} ${draggingClass}`;
  };

  const getTextColorClass = (columnId: string) => {
    switch (columnId) {
      case "toDo":
        return "text-blue-500";
      case "inProgress":
        return "text-orange-500";
      case "done":
        return "text-emerald-500";
      default:
        return "text-gray-500";
    }
  };

  const getBorderColorClass = (columnId: string) => {
    switch (columnId) {
      case "toDo":
        return "border-blue-500";
      case "inProgress":
        return "border-orange-500";
      case "done":
        return "border-emerald-500";
      default:
        return "border-gray-200";
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    itemId: string,
    columnId: string
  ) => {
    onDragStart(event, itemId, columnId);
    setDraggingItem(itemId);
    setSpring({ scale: 1.1 });
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
    setSpring({ scale: 1 });
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    columnId: string
  ) => {
    onDrop(event, columnId, columns, setColumns);
  };

  return (
    <div>
      <div className="flex justify-center h-screen items-center">
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              className="flex flex-col items-center"
              key={columnId}
              onDrop={(event) => onDrop(event, columnId, columns, setColumns)}
              onDragOver={onDragOver}
            >
              <h2
                className={`text-2xl font-bold ${getTextColorClass(columnId)}`}
              >
                {column.name}
              </h2>
              <Atropos
                activeOffset={40}
                shadowScale={0.5}
                rotate={true}
                rotateTouch={true}
                // onEnter={() => console.log("Enter")}
                // onLeave={() => console.log("Leave")}
                // onRotate={(x, y) => console.log("Rotate", x, y)}
              >
                <div
                  className={`m-4 bg-gray-200 p-4 w-[250px] min-h-[500px] 
                  rounded-lg backdrop-filter backdrop-blur-lg bg-opacity-30 border
                   ${getBorderColorClass(columnId)}`}
                >
                  {column.items.map((item, index) => {
                    return (
                      <animated.div
                        data-atropos-offset="15"
                        key={item.id}
                        draggable
                        onDragStart={(event) =>
                          handleDragStart(event, item.id, columnId)
                        }
                        onDragEnd={handleDragEnd}
                        onDrop={(event) => handleDrop(event, columnId)}
                        onDragOver={onDragOver}
                        data-index={index}
                        data-item-id={item.id}
                        className={`${getItemClass(
                          columnId,
                          item.id
                        )} ${getBorderColorClass(columnId)}`}
                        style={springProps}
                      >
                        {item.content}
                      </animated.div>
                    );
                  })}
                </div>
              </Atropos>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DraggableDiv;
