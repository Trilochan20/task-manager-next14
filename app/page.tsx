import DraggableDiv from "./components/DraggableDiv";
import { AddTaskButton } from "./components/AddTask";

export default function Home() {
  return (
    <main>
      <div className="bg-gray-900 h-screen">
        <DraggableDiv />
        <AddTaskButton />
      </div>
    </main>
  );
}
