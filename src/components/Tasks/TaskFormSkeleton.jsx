// src/components/Tasks/TaskFormSkeleton.jsx
import Loader from "./Loader";

const TaskFormSkeleton = () => (
    <div className="space-y-6 rounded-xl bg-brand-white p-6 animate-pulse">
        <div className="h-10 bg-gray-300 rounded-md"></div>
        <div className="h-10 bg-gray-300 rounded-md"></div>
        <div className="h-10 bg-gray-300 rounded-md"></div>
        <div className="h-10 bg-gray-300 rounded-md"></div>
        <div className="h-10 bg-gray-300 rounded-md"></div>
        <div className="h-10 bg-gray-300 rounded-md"></div>
        <div className="h-10 bg-gray-300 rounded-md"></div>
        <div className="h-10 bg-gray-300 rounded-md"></div>
        <div className="h-10 bg-gray-300 rounded-md"></div>

        <div className="flex w-full justify-end gap-3">
            <div className="h-12 w-24 bg-gray-300 rounded-md"></div>
        </div>

        <Loader text="Cargando formulario..." />
    </div>
);

export default TaskFormSkeleton;
