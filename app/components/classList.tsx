export const getItemClass = (
  columnId: string,
  itemId: string,
  draggingItem: string | null
) => {
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

export const getTextColorClass = (columnId: string) => {
  return (
    {
      accepted: "text-blue-500",
      inProgress: "text-orange-500",
      done: "text-emerald-500",
      default: "text-gray-200",
    }[columnId] || "text-gray-200"
  );
};

export const getBorderColorClass = (columnId: string) => {
  return (
    {
      accepted: "border-blue-500",
      inProgress: "border-orange-500",
      done: "border-emerald-500",
      default: "border-gray-200",
    }[columnId] || "border-gray-200"
  );
};
