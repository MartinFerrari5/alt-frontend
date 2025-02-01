// src/components/Tasks/TaskItem.jsx

import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import {
  CheckIcon,
  DetailsIcon,
  LoaderIcon,
  TrashIcon,
} from "../../assets/icons"
import { useDeleteTask } from "../../hooks/data/use-delete-task"
import { useUpdateTask } from "../../hooks/data/use-update-task"
import Button from "../Button"

const TaskItem = ({ task }) => {
  const { mutate: deleteTask, isPending: deleteTaskIsLoading } = useDeleteTask(
    task.id
  )
  const { mutate } = useUpdateTask(task.id)

  const getStatusClasses = () => {
    switch (task.status) {
      case 2:
        return "bg-brand-custom-green text-brand-custom-green"
      case 1:
        return "bg-brand-process text-brand-process"
      default:
        return "bg-brand-dark-blue bg-opacity-5 text-brand-dark-blue"
    }
  }

  const handleDeleteClick = () => {
    deleteTask(undefined, {
      onSuccess: () => toast.success("¡Tarea eliminada exitosamente!"),
      onError: () =>
        toast.error("Error al eliminar la tarea. Inténtalo de nuevo."),
    })
  }

  const getNewStatus = () => {
    return task.status === 0 ? 1 : task.status === 1 ? 2 : 0
  }

  const handleCheckboxClick = () => {
    mutate(
      { status: getNewStatus() },
      {
        onSuccess: () => toast.success("¡Estado de la tarea actualizado!"),
        onError: () =>
          toast.error("Error al actualizar la tarea. Inténtalo de nuevo."),
      }
    )
  }

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-lg bg-opacity-10 px-4 py-3 text-sm transition ${getStatusClasses()}`}
    >
      <div className="flex items-center gap-2">
        <label
          className={`relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg ${getStatusClasses()}`}
        >
          <input
            type="checkbox"
            checked={task.status === 2}
            className="absolute h-full w-full cursor-pointer opacity-0"
            onChange={handleCheckboxClick}
          />
          {task.status === 2 && <CheckIcon />}
          {task.status === 1 && (
            <LoaderIcon className="animate-spin text-brand-white" />
          )}
        </label>
        {task.project} - {task.task_type}
      </div>

      <div className="flex items-center gap-2">
        <Button
          color="ghost"
          onClick={handleDeleteClick}
          disabled={deleteTaskIsLoading}
        >
          {deleteTaskIsLoading ? (
            <LoaderIcon className="animate-spin text-brand-text-gray" />
          ) : (
            <TrashIcon className="text-brand-text-gray" />
          )}
        </Button>

        <Link to={`/task/${task.id}`}>
          <DetailsIcon />
        </Link>
      </div>
    </div>
  )
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired,
    task_type: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
  }).isRequired,
}

export default TaskItem
