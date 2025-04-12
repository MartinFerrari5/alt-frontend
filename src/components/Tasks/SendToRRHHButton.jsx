// /src/components/Tasks/SendToRRHHButton.jsx
import { useCallback } from "react"
import PropTypes from "prop-types"
import Button from "../Button"
import { useSendStatusToRRHH } from "../../hooks/data/status/use-status-hooks"
import { toast } from "react-toastify"
import { LoadingSpinner } from "../../util/LoadingSpinner"

const SendToRRHHButton = ({ tasks, queryParams, role }) => {
    // Cambiar isLoading por isPending
    const { mutate: sendToRRHH, isPending } = useSendStatusToRRHH()
    console.log("isPending:", isPending)

    // Función para eliminar parámetros vacíos del objeto queryParams
    const cleanQueryParams = (params) =>
        Object.entries(params).reduce((acc, [key, value]) => {
            if (value && value.trim() !== "") {
                acc[key] = value
            }
            return acc
        }, {})

    const handleClick = useCallback(() => {
        if (!tasks || tasks.length === 0) {
            toast.error("No hay tareas para enviar.")
            return
        }

        // Limpiar los query params antes de enviarlos
        const cleanedParams = cleanQueryParams(queryParams)

        // Crear el payload con solo los IDs de las tareas
        // const payloadTasks = tasks.map((task) => ({ id: task.id }))

        // Crear el payload con todas las tareas completas
        const payloadTasks = tasks

        // Diferenciar acción según rol:
        sendToRRHH(
            {
                queryParams: cleanedParams,
                payload: { tasks: payloadTasks },
            },
            {
                onSuccess: () => {
                    const successMessage =
                        role === "admin"
                            ? "Tareas finalizadas exitosamente!"
                            : "Tareas enviadas a RRHH exitosamente!"
                    toast.success(successMessage)
                },
                onError: (error) => {
                    const errorMessage =
                        role === "admin"
                            ? `Error al finalizar tareas: ${error.message}`
                            : `Error al enviar tareas a RRHH: ${error.message}`
                    toast.error(errorMessage)
                },
            }
        )
    }, [tasks, queryParams, sendToRRHH, role])

    return (
        // Usar isPending en lugar de isLoading
        <Button onClick={handleClick} disabled={isPending}>
            {isPending ? (
                <LoadingSpinner />
            ) : role === "admin" ? (
                "Finalizar tareas"
            ) : (
                "Enviar a RRHH"
            )}
        </Button>
    )
}

SendToRRHHButton.propTypes = {
    tasks: PropTypes.array.isRequired,
    queryParams: PropTypes.object.isRequired,
    role: PropTypes.string.isRequired,
}

export default SendToRRHHButton
