"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTasks } from "./taskContext";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function AddTaskButton() {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild className="fixed bottom-8 right-8">
        <Button className="bg-transparent hover:bg-gray-100 border border-gray-100 text-gray-100 hover:text-gray-900 ">
          Add
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="backdrop-filter backdrop-blur-lg bg-opacity-10 bg-gray-100 min-h-[500px] border-xs border-gray-600">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-100 flex justify-between">
            <div>Add New Task</div>
            <Button
              className=" bg-transparent text-gray-200 hover:text-gray-200"
              onClick={() => setOpen(false)}
            >
              X
            </Button>
          </AlertDialogTitle>
          <AddTaskForm />
          <AlertDialogDescription className="sr-only">
            Add your task
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AddTaskForm() {
  interface FormData {
    task: string;
    columnId: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      task: "",
      columnId: "",
    },
  });

  const { dispatch } = useTasks();

  const columnId = watch("columnId");

  const onSubmit = (data: FormData) => {
    const newTaskId = crypto.randomUUID();
    dispatch({
      type: "ADD_TASK",
      payload: {
        columnId: data.columnId,
        task: { id: newTaskId, content: data.task },
      },
    });

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        autoComplete="off"
        type="text"
        placeholder="Add your task"
        className="text-gray-100 bg-gray-500 placeholder:text-white-300 mt-4"
        {...register("task", { required: true })}
      />
      {errors.task && (
        <span className="text-red-500 text-sm pt-4">
          This field is required
        </span>
      )}
      <ColumnSelector
        value={columnId}
        onChange={(value) => setValue("columnId", value)}
        error={errors.columnId?.message}
      />
      <input
        type="hidden"
        {...register("columnId", { required: "Please select a column" })}
      />
      {/* {errors.columnId && (
        <span className="text-red-500 text-sm pt-4">
          {errors.columnId.message}
        </span>
      )} */}
      <Button
        type="submit"
        className="bg-gray-500 hover:bg-gray-600 text-gray-100 mt-4 float-right"
      >
        Add
      </Button>
    </form>
  );
}

export function ColumnSelector({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const { state } = useTasks();

  const columns = Object.entries(state).map(([key, value]) => ({
    value: key,
    label: value.name,
  }));

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between   bg-gray-500 
          placeholder:text-gray-400 mt-4 hover:bg-gray-500 hover:text-gray-400 ${
            value ? "text-gray-100" : "text-gray-400"
          }`}
          >
            {value
              ? columns.find((column) => column.value === value)?.label
              : "Select column..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 " />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full placeholder:text-white-300 bg-gray-100 p-0 bg-opacity-10 backdrop-filter backdrop-blur-lg
       "
        >
          <Command className="bg-gray-900 bg-opacity-10 backdrop-filter backdrop-blur-lg ">
            <CommandInput
              placeholder="Search column..."
              className="h-9 text-gray-100"
            />
            <CommandList>
              <CommandEmpty className="text-gray-100 min-h-[120px] flex justify-center items-center">
                No column found.
              </CommandEmpty>
              <CommandGroup className=" bg-opacity-10 backdrop-filter backdrop-blur-lg text-gray-100">
                {columns.map((column) => (
                  <CommandItem
                    key={column.value}
                    value={column.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {column.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === column.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <span className="text-red-500 text-sm pt-2">{error}</span>}
    </>
  );
}
