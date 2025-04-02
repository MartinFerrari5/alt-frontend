// src/components/Tasks/TaskFormSkeleton.jsx
import Loader from "./Loader"

const TaskFormSkeleton = () => (
    <div className="bg-brand-white animate-pulse space-y-6 rounded-xl p-6">
        <div className="h-10 rounded-md bg-gray-300"></div>
        <div className="h-10 rounded-md bg-gray-300"></div>
        <div className="h-10 rounded-md bg-gray-300"></div>
        <div className="h-10 rounded-md bg-gray-300"></div>
        <div className="h-10 rounded-md bg-gray-300"></div>
        <div className="h-10 rounded-md bg-gray-300"></div>
        <div className="h-10 rounded-md bg-gray-300"></div>
        <div className="h-10 rounded-md bg-gray-300"></div>
        <div className="h-10 rounded-md bg-gray-300"></div>

        <div className="flex w-full justify-end gap-3">
            <div className="h-12 w-24 rounded-md bg-gray-300"></div>
        </div>

        <Loader text="Cargando formulario..." />
    </div>
)

export default TaskFormSkeleton
