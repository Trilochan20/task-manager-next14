"use client";
import React from "react";
import { Atropos } from "atropos/react";
import { useSpring, animated } from "@react-spring/web";
import { useTasks } from "./taskContext";

const onDragStart = (
  event: React.DragEvent<HTMLDivElement>,
  itemId: string,
  sourceColumnId: string
) => {
  event.dataTransfer.setData("itemId", itemId);
  event.dataTransfer.setData("sourceColumnId", sourceColumnId);
};

const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
};

function DraggableDiv() {
  const { state: columns, dispatch } = useTasks();
  const [draggingItem, setDraggingItem] = React.useState<string | null>(null);

  const getItemClass = (columnId: string, itemId: string) => {
    const baseClass = `user-select-none cursor-grab p-4 mb-4 min-h-[50px] text-white rounded-lg 
      text-xs font-playwrite-ng tracking-wider font-bold backdrop-filter backdrop-blur-lg bg-opacity-30`;
    const columnClass =
      {
        accepted: "bg-blue-500 border-blue-500",
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
    return (
      {
        accepted: "text-blue-500",
        inProgress: "text-orange-500",
        done: "text-emerald-500",
        default: "text-gray-200",
      }[columnId] || "text-gray-200"
    );
  };

  const getBorderColorClass = (columnId: string) => {
    return (
      {
        accepted: "border-blue-500",
        inProgress: "border-orange-500",
        done: "border-emerald-500",
        default: "border-gray-200",
      }[columnId] || "border-gray-200"
    );
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    itemId: string,
    columnId: string
  ) => {
    onDragStart(event, itemId, columnId);
    setDraggingItem(itemId);
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    columnId: string
  ) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("itemId");
    const sourceColumnId = event.dataTransfer.getData("sourceColumnId");

    const dropTarget = event.target as HTMLElement;
    const dropIndex = Array.from(dropTarget.parentNode?.children || []).indexOf(
      dropTarget
    );

    if (sourceColumnId === columnId) {
      dispatch({
        type: "REORDER_TASK",
        payload: {
          columnId: columnId,
          taskId: itemId,
          newIndex: dropIndex,
        },
      });
    } else {
      dispatch({
        type: "MOVE_TASK",
        payload: {
          sourceId: sourceColumnId,
          destinationId: columnId,
          taskId: itemId,
        },
      });
    }
  };
  const handleDelete = (columnId: string, taskId: string) => {
    dispatch({
      type: "DELETE_TASK",
      payload: { columnId, taskId },
    });
  };

  return (
    <div className="flex justify-center h-screen items-center">
      {Object.entries(columns).map(([columnId, column]) => (
        <div
          className="flex flex-col items-center"
          key={columnId}
          onDrop={(event) => handleDrop(event, columnId)}
          onDragOver={onDragOver}
        >
          <h2 className={`text-2xl font-bold ${getTextColorClass(columnId)}`}>
            {column.name}
          </h2>
          {/* <Atropos
            activeOffset={40}
            shadowScale={0.5}
            rotate={true}
            rotateTouch={true}
          > */}
          <div
            className={`m-4 bg-gray-200 p-4 w-[250px] min-h-[500px] h-full
              rounded-lg backdrop-filter backdrop-blur-lg bg-opacity-30 border   ${getBorderColorClass(
                columnId
              )}`}
          >
            {column.items.map((item, index) => (
              <animated.div
                // data-atropos-offset="15"
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
                className={getItemClass(columnId, item.id)}
                // style={springProps}
              >
                <div className="flex justify-between items-center">
                  <span>{item.content}</span>
                  <button
                    onClick={() => handleDelete(columnId, item.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </animated.div>
            ))}
          </div>
          {/* </Atropos> */}
        </div>
      ))}
    </div>
  );
}

import ClientSideComponent from "./ClientSideComponent";

export default function DraggableDivWrapped() {
  return (
    <ClientSideComponent>
      <DraggableDiv />
    </ClientSideComponent>
  );
}
