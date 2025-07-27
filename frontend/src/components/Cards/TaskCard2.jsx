import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";

const TaskCard2 = ({ title, description, status, createdAt, assignedTo, attachmentCount, completedTodoCount, onClick, isLocked = false, isCompleted = false }) => {
  return (
    <div
      className={`rounded-4xl py-4 px-6 shadow-md border border-gray-200 relative transition-all duration-200 ${
        isLocked ? "opacity-50 cursor-not-allowed bg-white" : isCompleted ? "bg-blue-500 text-white hover:shadow-lg cursor-pointer" : "bg-white hover:shadow-lg cursor-pointer"
      }`}
      onClick={() => {
        if (!isLocked) onClick();
      }}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-xl">
          <span className="text-sm font-medium text-black">Tugas sebelumnya belum selesai</span>
        </div>
      )}

      <div className="flex flex-col gap-1 z-10 relative">
        <div className="flex justify-center items-center">
          <h3 className="text-sm md:text-lg font-semibold truncate md:whitespace-normal">{title}</h3>
        </div>
      </div>
    </div>
  );
};

export default TaskCard2;
