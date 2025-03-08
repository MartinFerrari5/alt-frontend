// src/components/Tasks/TaskItem.jsx
import PropTypes from "prop-types"
import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { Link } from "react-router-dom"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaEdit, FaTrash } from "react-icons/fa"

import StatusIndicator from "./StatusIndicator"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import { useTasks } from "../../hooks/data/task/useTasks"
import useAuthStore from "../../store/authStore"
import Button from "../Button"

// Función auxiliar para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return "Fecha no disponible"
  const parsedDate = new Date(dateString)
  if (isNaN(parsedDate.getTime())) {
    console.warn(`⚠️ Fecha inválida recibida: ${dateString}`)
    return "Fecha inválida"
  }
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate)
}

const TaskItem = ({ task }) => {
  const role = useAuthStore((state) => state.role)
  const { deleteTaskMutation, updateTaskMutation } = useTasks()
  const { mutate: deleteTask, isLoading: deleteTaskIsLoading } = deleteTaskMutation
  const { mutate: updateTask, isLoading: updateTaskIsLoading } = updateTaskMutation

  const [showConfirm, setShowConfirm] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState(task.status)

  // Actualiza el estado inicial del modal al cambiar la tarea
  useEffect(() => {
    setNewStatus(task.status)
  }, [task.status])

  // Muestra el modal de eliminación
  const handleDeleteClick = useCallback(() => setShowConfirm(true), [])

  // Función para confirmar la eliminación
  const confirmDelete = useCallback(() => {
    deleteTask(task.id, {
      onSuccess: () => {
        toast.success("¡Tarea eliminada exitosamente!")
        setShowConfirm(false)
      },
      onError: (error) => {
        console.error("🔴 Error al eliminar tarea:", error)
        toast.error("Error al eliminar la tarea. Inténtalo de nuevo.")
      },
    })
  }, [deleteTask, task.id])

  // Abre el modal de actualización de estado
  const openStatusModal = useCallback(() => {
    setNewStatus(task.status) // Reinicia el valor al estado actual
    setShowStatusModal(true)
  }, [task.status])

  // Cierra el modal de actualización de estado
  const closeStatusModal = useCallback(() => {
    setShowStatusModal(false)
  }, [])

  // Maneja la confirmación de la actualización de estado
  const handleStatusConfirm = useCallback(() => {
    if (!task.task_date || isNaN(new Date(task.task_date).getTime())) {
      toast.error("Fecha de tarea inválida. Verifica los datos.")
      return
    }
    updateTask(
      { taskId: task.id, task: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success("¡Estado de la tarea actualizado!")
          setShowStatusModal(false)
        },
        onError: (error) => {
          console.error("🔴 Error al actualizar tarea:", error)
          toast.error("Error al actualizar la tarea. Inténtalo de nuevo.")
        },
      }
    )
  }, [updateTask, task, newStatus])

  return (
    <>
      <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
        {role === "admin" && (
          <td className="px-4 py-5">{task.full_name || "Sin nombre"}</td>
        )}
        <td className="px-4 py-5">{formatDate(task.task_date)}</td>
        <td className="px-4 py-5">{task.entry_time}</td>
        <td className="px-4 py-5">{task.exit_time}</td>
        <td className="px-4 py-5">{task.company}</td>
        <td className="px-4 py-5">{task.project}</td>
        <td className="px-4 py-5">{task.hour_type}</td>
        <td className="px-4 py-5">{task.lunch_hours || "-"}</td>
        <td className="px-4 py-5">{task.worked_hours}</td>
        <td className="flex gap-2 px-4 py-5 text-right">
          <Button
            color="ghost"
            onClick={handleDeleteClick}
            disabled={deleteTaskIsLoading}
          >
            {deleteTaskIsLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin text-brand-text-gray" />
            ) : (
              <FaTrash className="h-5 w-5" />
            )}
          </Button>
          <Link to={`/task/${task.id}`}>
            <FaEdit className="h-5 w-5" />
          </Link>
          {role === "admin" ? (
            // Se envuelve el StatusIndicator en un div con onClick para disparar openStatusModal
            <div onClick={openStatusModal}>
              <StatusIndicator
                status={task.status}
                isLoading={updateTaskIsLoading}
                onChange={() => {}}
              />
            </div>
          ) : (
            <StatusIndicator
              status={task.status}
              isLoading={updateTaskIsLoading}
              onChange={() => {}}
            />
          )}
        </td>
      </tr>

      {showConfirm && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showStatusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">
              Actualizar Estado de Tarea
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleStatusConfirm()
              }}
            >
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(Number(e.target.value))}
                className="w-full rounded-lg border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="0">progreso</option>
                <option value="1">finalizado</option>
                <option value="2">facturado</option>
              </select>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={closeStatusModal}
                  disabled={updateTaskIsLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateTaskIsLoading}>
                  {updateTaskIsLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    "Confirmar"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    full_name: PropTypes.string,
    company: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired,
    task_date: PropTypes.string.isRequired,
    entry_time: PropTypes.string.isRequired,
    exit_time: PropTypes.string.isRequired,
    hour_type: PropTypes.string.isRequired,
    lunch_hours: PropTypes.string,
    worked_hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    status: PropTypes.number.isRequired,
  }).isRequired,
}

export default TaskItem
