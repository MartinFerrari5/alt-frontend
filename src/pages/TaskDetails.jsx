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
import TimeSelect from "../components/TimeSelect"
import { useDeleteTask } from "../hooks/data/use-delete-task"
import { useGetTask } from "../hooks/data/use-get-task"
import { useUpdateTask } from "../hooks/data/use-update-task"

const TaskDetailsPage = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      time: "",
    },
  })

  const { mutate: updateTask } = useUpdateTask(taskId)
  const { mutate: deleteTask } = useDeleteTask(taskId)

  const { data: task, isLoading } = useGetTask({
    taskId,
    onSuccess: (task) => {
      const taskDetails = task?.task?.[0]
      if (taskDetails) {
        reset({
          title: taskDetails.task_description || "",
          description: taskDetails.task_description || "",
          time: taskDetails.entry_time || "",
        })
      }
    },
  })

  console.log("📌 Tarea TaskDetailsPage:", task)

  const taskDetails = task?.task?.[0]

  const handleBackClick = () => navigate(-1)

  const handleSaveClick = async (data) => {
    updateTask(data, {
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

  if (!taskDetails) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span>No se encontró la tarea.</span>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full space-y-6 px-8 py-16">
        {/* Barra superior */}
        <div className="flex w-full justify-between">
          {/* Parte izquierda */}
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
                {taskDetails.task_description}
              </span>
            </div>

            <h1 className="mt-2 text-xl font-semibold">
              {taskDetails.task_description}
            </h1>
          </div>

          {/* Parte derecha */}
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
          {/* Datos de la tarea */}
          <div className="space-y-6 rounded-xl bg-brand-white p-6">
            <div>
              <Input
                id="title"
                label="Título"
                defaultValue={taskDetails.task_description}
                {...register("title", {
                  required: "El título es obligatorio.",
                  validate: (value) =>
                    value.trim() ? true : "El título no puede estar vacío.",
                })}
                errorMessage={errors?.title?.message}
              />
            </div>

            <div>
              <TimeSelect
                defaultValue={taskDetails.entry_time}
                {...register("time", {
                  required: "El horario es obligatorio.",
                })}
                errorMessage={errors?.time?.message}
              />
            </div>

            <div>
              <Input
                id="description"
                label="Descripción"
                defaultValue={taskDetails.task_description}
                {...register("description", {
                  required: "La descripción es obligatoria.",
                  validate: (value) =>
                    value.trim()
                      ? true
                      : "La descripción no puede estar vacía.",
                })}
                errorMessage={errors?.description?.message}
              />
            </div>
          </div>

          {/* Botón de guardar */}
          <div className="flex w-full justify-end gap-3">
            <Button
              size="large"
              color="primary"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting && <LoaderIcon className="animate-spin" />}
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskDetailsPage
