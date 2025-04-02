import { useCallback } from "react"
import PropTypes from "prop-types"
import Button from "../Button"
import { useSendStatusToRRHH } from "../../hooks/data/status/use-status-hooks"
import { toast } from "react-toastify"
import { LoadingSpinner } from "../../util/LoadingSpinner"

const SendToRRHHButton = ({ tasks, queryParams, role }) => {
    const { mutate: sendToRRHH, isLoading } = useSendStatusToRRHH()

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
            toast.error("No hay tareas para enviar a RRHH.")
            return
        }

        // Limpiar los query params antes de enviarlos
        const cleanedParams = cleanQueryParams(queryParams)

        // Enviar solo lo necesario: un arreglo de objetos con la propiedad id
        const payloadTasks = tasks.map((task) => ({ id: task.id }))

        sendToRRHH(
            { queryParams: cleanedParams, payload: { tasks: payloadTasks } },
            {
                onSuccess: () => {
                    toast.success("Tareas enviadas a RRHH exitosamente!")
                },
                onError: (error) => {
                    toast.error(
                        `Error al enviar tareas a RRHH: ${error.message}`
                    )
                },
            }
        )
    }, [tasks, queryParams, sendToRRHH])

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <Button onClick={handleClick} disabled={isLoading}>
                {role === "admin" ? "finalizar tareas" : "Enviar a RRHH"}
            </Button>
        </>
    )
}

SendToRRHHButton.propTypes = {
    tasks: PropTypes.array.isRequired,
    queryParams: PropTypes.object.isRequired,
}

export default SendToRRHHButton
