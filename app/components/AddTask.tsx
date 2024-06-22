"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function AddTaskButton() {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild className="fixed bottom-8 right-8">
        <Button variant="outline">Add</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="backdrop-filter backdrop-blur-lg bg-opacity-10 bg-gray-100 min-h-[500px] border-xs border-gray-600">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-100 flex justify-between">
            <div>Add New Task</div>
            <Button
              //   variant="ghost"
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
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        autoComplete="off"
        type="text"
        placeholder="Add your task"
        className="text-gray-100 bg-gray-500  placeholder:text-white-300 mt-4"
        {...register("task", { required: true })}
      />
      {errors.task && (
        <span className="text-red-500 text-sm pt-4">
          This field is required
        </span>
      )}
      <Button
        type="submit"
        className="bg-gray-500 hover:bg-gray-600 text-gray-100 mt-4 float-right"
      >
        Add
      </Button>
    </form>
  );
}
