// src/components/Tasks/SendToRRHHButton.jsx
import Button from "../Button"
import { useSendStatusToRRHH } from "../../hooks/data/status/use-status-hooks"
import { toast } from "react-toastify"

const SendToRRHHButton = ({ tasks, queryParams }) => {
    const { mutate: sendToRRHH, isLoading } = useSendStatusToRRHH()

    const handleClick = () => {
        if (!tasks || tasks.length === 0) {
            toast.error("No hay tareas para enviar a RRHH.")
            return
        }

        // Definimos los campos obligatorios
        const requiredFields = ["company", "project", "fullname", "date"]
        // Filtramos cuáles campos vienen vacíos o no están definidos
        const missingFields = requiredFields.filter(
            (field) => !queryParams[field] || queryParams[field].trim() === ""
        )

        if (missingFields.length > 0) {
            toast.error(
                `Faltan los siguientes campos: ${missingFields.join(", ")}`
            )
            return
        }

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
