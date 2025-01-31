// // AddTaskDialog.jsx

import "./AddTaskDialog.css"

import PropTypes from "prop-types"
import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { CSSTransition } from "react-transition-group"
import { toast } from "sonner"

import { LoaderIcon } from "../../assets/icons"
import { useAuth } from "../../components/auth/AuthContext"
import { useAddTask } from "../../hooks/data/use-add-task"
import Button from "../Button"
import Input from "../Input"
// import TimeSelect from "../TimeSelect";
import DatePicker from "./DatePicker"

const AddTaskDialog = ({ isOpen, handleClose }) => {
  const { userId } = useAuth()
  console.log("userId: ", userId)
  const { mutate: addTask } = useAddTask()
  const nodeRef = useRef()
  const [taskDate, setTaskDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const companies = ["Tech Solutions", "InnovateX", "CloudTech"] // Lista de empresas disponibles

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      user_id: userId,
      company: companies[0], // Selección por defecto
      project: "Website Redesign",
      task_type: "Development",
      task_description: "",
      entry_time: "09:00",
      exit_time: "18:00",
      lunch_hours: 1,
      status: "In Progress",
    },
  })

  const handleSaveClick = async (data) => {
    const userId = "123e4567-e89b-12d3-a456-426614174000" // Simulación de usuario (reemplazar con el real)

    const taskPayload = {
      company: data.company,
      project: data.project,
      task_type: data.task_type,
      task_description: data.task_description.trim(),
      entry_time: data.entry_time,
      exit_time: data.exit_time,
      lunch_hours: parseFloat(data.lunch_hours),
      status: data.status,
      task_date: taskDate,
      user_id: userId,
    }

    addTask(taskPayload, {
      onSuccess: () => {
        handleClose()
        reset()
        toast.success("¡Tarea agregada con éxito!")
      },
      onError: () => {
        toast.error("Error al agregar la tarea. Por favor, intentá de nuevo.")
      },
    })
  }

  const handleCancelClick = () => {
    reset()
    handleClose()
  }

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={500}
      classNames="add-task-dialog"
      unmountOnExit
    >
      <div>
        {createPortal(
          <div
            ref={nodeRef}
            className="fixed bottom-0 left-0 top-0 flex h-screen w-screen items-center justify-center backdrop-blur"
          >
            <div className="rounded-xl bg-white p-5 text-center shadow">
              <h2 className="text-xl font-semibold text-brand-dark-blue">
                Nueva Tarea
              </h2>
              <p className="mb-4 mt-1 text-sm text-brand-text-gray">
                Ingresá la información a continuación
              </p>

              <form
                onSubmit={handleSubmit(handleSaveClick)}
                className="flex w-[336px] flex-col space-y-4"
              >
                {/* Empresa */}
                <label className="text-sm font-medium text-gray-700">
                  Empresa
                </label>
                <select
                  {...register("company", {
                    required: "Seleccioná una empresa.",
                  })}
                  className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
                {errors.company && (
                  <p className="text-xs text-red-500">
                    {errors.company.message}
                  </p>
                )}

                {/* Proyecto */}
                <Input
                  id="project"
                  label="Proyecto"
                  placeholder="Ingresá el nombre del proyecto"
                  {...register("project", {
                    required: "El proyecto es obligatorio.",
                  })}
                  disabled={isSubmitting}
                />

                {/* Tipo de tarea */}
                <Input
                  id="task_type"
                  label="Tipo de Tarea"
                  placeholder="Ej: Desarrollo, Testing, Diseño..."
                  {...register("task_type", {
                    required: "El tipo de tarea es obligatorio.",
                  })}
                  disabled={isSubmitting}
                />

                {/* Descripción */}
                <Input
                  id="task_description"
                  label="Descripción"
                  placeholder="Describí la tarea"
                  {...register("task_description", {
                    required: "La descripción es obligatoria.",
                  })}
                  disabled={isSubmitting}
                />

                {/* Fecha */}
                <DatePicker value={taskDate} onChange={setTaskDate} />

                {/* Horario de Entrada */}
                <Input
                  id="entry_time"
                  label="Hora de Entrada"
                  type="time"
                  {...register("entry_time", {
                    required: "La hora de entrada es obligatoria.",
                  })}
                  disabled={isSubmitting}
                />

                {/* Horario de Salida */}
                <Input
                  id="exit_time"
                  label="Hora de Salida"
                  type="time"
                  {...register("exit_time", {
                    required: "La hora de salida es obligatoria.",
                  })}
                  disabled={isSubmitting}
                />

                {/* Horas de almuerzo */}
                <Input
                  id="lunch_hours"
                  label="Horas de Almuerzo"
                  type="number"
                  step="0.5"
                  min="0"
                  max="3"
                  {...register("lunch_hours", {
                    required: "Las horas de almuerzo son obligatorias.",
                    min: { value: 0, message: "Debe ser mínimo 0" },
                    max: { value: 3, message: "Máximo 3 horas" },
                  })}
                  disabled={isSubmitting}
                />

                {/* Estado */}
                <label className="text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  {...register("status", { required: "Seleccioná un estado." })}
                  className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={isSubmitting}
                >
                  <option value="Not Started">No Iniciada</option>
                  <option value="In Progress">En Progreso</option>
                  <option value="Completed">Completada</option>
                </select>
                {errors.status && (
                  <p className="text-xs text-red-500">
                    {errors.status.message}
                  </p>
                )}

                {/* Botones */}
                <div className="flex gap-3">
                  <Button
                    size="large"
                    className="w-full"
                    color="secondary"
                    onClick={handleCancelClick}
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="large"
                    className="w-full"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting && <LoaderIcon className="animate-spin" />}
                    Guardar
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
      </div>
    </CSSTransition>
  )
}

AddTaskDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}

export default AddTaskDialog
