"use client";
import React from "react";
import { animated } from "@react-spring/web";
import { useTasks } from "./taskContext";
import {
  getItemClass,
  getTextColorClass,
  getBorderColorClass,
} from "./classList";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
                className={getItemClass(columnId, item.id, draggingItem)}
                // style={springProps}
              >
                <div className="flex justify-between items-center">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger className="text-left w-[75%] truncate ...">
                        {item.content}
                      </TooltipTrigger>
                      <TooltipContent className=" max-w-[320px] p-4 bg-slate-900 backdrop-filter backdrop-blur-lg bg-opacity-90 leading-5 ">
                        {item.content}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* <span className="w-[75%] truncate ...">{item.content}</span> */}
                  <Button
                    size="sm"
                    onClick={() => handleDelete(columnId, item.id)}
                    className="ml-2 text-red-500 hover:text-red-700 bg-transparent "
                  >
                    ×
                  </Button>
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
import { Button } from "@/components/ui/button";

export default function DraggableDivWrapped() {
  return (
    <ClientSideComponent>
      <DraggableDiv />
    </ClientSideComponent>
  );
}
