// src/components/Tasks/SendToRRHHButton.jsx
import Button from "../Button"
import { useSendStatusToRRHH } from "../../hooks/data/status/use-status-hooks"
import { toast } from "sonner"
import useAuthStore from "../../store/authStore"

const SendToRRHHButton = ({ tasks }) => {
    console.log("SendToRRHHButton tasks:", tasks)
  const { mutate: sendToRRHH, isLoading } = useSendStatusToRRHH()
  const user = useAuthStore((state) => state.user)

  // Definimos los query params basados en lo que espera el backend.
  // Puedes reemplazar los valores de "company" y "project" por valores dinámicos si lo necesitas.
  const queryParams = {
    company: "facebook",
    project: "reportes",
    fullname: user?.full_name || "user",
    date: "2025-02-20 2025-03-18",
  }

  const handleClick = () => {
    if (!tasks || tasks.length === 0) {
      toast.error("No hay tareas para enviar a RRHH.")
      return
    }

    // Ejecutamos la mutación pasando los parámetros y el body.
    // El body debe ser un objeto con la propiedad "tasks" que contenga el arreglo de tareas.
    sendToRRHH(
      { queryParams, payload: { tasks } },
      {
        onSuccess: () => {
          toast.success("Tareas enviadas a RRHH exitosamente!")
        },
        onError: () => {
          toast.error("Error al enviar tareas a RRHH.")
        },
      }
    )
  }

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      Enviar a RRHH
    </Button>
  )
}

export default SendToRRHHButton
