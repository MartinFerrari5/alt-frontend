// /src/pages/TaskDetails.jsx

import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  LoaderIcon,
  TrashIcon,
} from "../assets/icons"
import Button from "../components/Button"
import Input from "../components/Input"
import Sidebar from "../components/Sidebar"
import DatePicker from "../components/Tasks/DatePicker"
import { useDeleteTask } from "../hooks/data/use-delete-task"
import { useGetTask } from "../hooks/data/use-get-task"
import { useUpdateTask } from "../hooks/data/use-update-task"
import { useState } from "react"

const statusMap = {
  0: "No iniciado",
  1: "En progreso",
  2: "Completado",
}

const TaskDetailsPage = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [taskDate, setTaskDate] = useState("")

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm()

  const { mutate: updateTask } = useUpdateTask(taskId)
  const { mutate: deleteTask } = useDeleteTask(taskId)

  const { data: task, isLoading } = useGetTask({
    taskId,
    onSuccess: (task) => {
      const taskDetails = task?.task?.[0]
      if (taskDetails) {
        const formattedDate = taskDetails.task_date
          ? taskDetails.task_date.split("T")[0]
          : ""
        setTaskDate(formattedDate)
        reset({
          company: taskDetails.company || "",
          project: taskDetails.project || "",
          task_type: taskDetails.task_type || "",
          task_description: taskDetails.task_description || "",
          entry_time: taskDetails.entry_time || "09:00",
          exit_time: taskDetails.exit_time || "18:00",
          lunch_hours: taskDetails.lunch_hours
            ? taskDetails.lunch_hours.toString()
            : "1",
          status: taskDetails.status?.toString() || "0",
        })
      }
    },
  })

  const handleBackClick = () => navigate(-1)

  const handleSaveClick = async (data) => {
    if (data.entry_time >= data.exit_time) {
      toast.error(
        "La hora de entrada no puede ser mayor o igual a la de salida."
      )
      return
    }

    const updatedTask = {
      ...data,
      lunch_hours: Number(data.lunch_hours),
      status: Number(data.status),
      task_date: taskDate,
    }

    updateTask(updatedTask, {
      onSuccess: () => toast.success("¡Tarea guardada con éxito!"),
      onError: () => toast.error("Ocurrió un error al guardar la tarea."),
    })
  }

  const handleDeleteClick = async () => {
    deleteTask(undefined, {
      onSuccess: () => {
        toast.success("¡Tarea eliminada con éxito!")
        navigate(-1)
      },
      onError: () => toast.error("Ocurrió un error al eliminar la tarea."),
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderIcon className="animate-spin" />
        <span className="ml-2">Cargando tarea...</span>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full space-y-6 px-8 py-16">
        <div className="flex w-full justify-between">
          <div>
            <button
              onClick={handleBackClick}
              className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-custom-green"
            >
              <ArrowLeftIcon />
            </button>
            <div className="flex items-center gap-1 text-xs">
              <Link className="cursor-pointer text-brand-text-gray" to="/">
                Mis tareas
              </Link>
              <ChevronRightIcon className="text-brand-text-gray" />
              <span className="font-semibold text-brand-custom-green">
                {task?.task?.[0]?.task_description}
              </span>
            </div>
            <h1 className="mt-2 text-xl font-semibold">
              {task?.task?.[0]?.task_description}
            </h1>
          </div>
          <Button
            className="h-fit self-end"
            color="danger"
            onClick={handleDeleteClick}
          >
            <TrashIcon />
            Eliminar tarea
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleSaveClick)}>
          <div className="space-y-6 rounded-xl bg-brand-white p-6">
            <Input
              id="company"
              label="Empresa"
              {...register("company")}
              errorMessage={errors.company?.message}
            />
            <Input
              id="project"
              label="Proyecto"
              {...register("project")}
              errorMessage={errors.project?.message}
            />
            <Input
              id="task_type"
              label="Tipo de Tarea"
              {...register("task_type")}
              errorMessage={errors.task_type?.message}
            />
            <Input
              id="task_description"
              label="Descripción"
              {...register("task_description")}
              errorMessage={errors.task_description?.message}
            />
            <Input
              id="entry_time"
              label="Hora de Entrada"
              type="time"
              {...register("entry_time")}
              errorMessage={errors.entry_time?.message}
            />
            <Input
              id="exit_time"
              label="Hora de Salida"
              type="time"
              {...register("exit_time")}
              errorMessage={errors.exit_time?.message}
            />
            <Input
              id="lunch_hours"
              label="Horas de Almuerzo"
              type="number"
              {...register("lunch_hours")}
              errorMessage={errors.lunch_hours?.message}
            />
            <DatePicker value={taskDate} onChange={setTaskDate} />
            <select
              {...register("status")}
              value={task?.task?.[0]?.status?.toString() || "0"}
              className="form-select"
            >
              {Object.entries(statusMap).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.status && <p className="error">{errors.status.message}</p>}
          </div>
          <div className="flex w-full justify-end gap-3">
            <Button
              size="large"
              color="primary"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting && <LoaderIcon className="animate-spin" />} Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskDetailsPage
