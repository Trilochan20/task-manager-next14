import DraggableDivWrapped from "./components/DraggableDiv";
import { AddTaskButton } from "./components/AddTask";

export default function Home() {
  return (
    <main>
      <div className="h-screen">
        <DraggableDivWrapped />
        <AddTaskButton />
      </div>
    </main>
  );
}
