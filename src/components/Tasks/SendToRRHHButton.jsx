import { useCallback } from "react"
import PropTypes from "prop-types"
import Button from "../Button"
import { useSendStatusToRRHH } from "../../hooks/data/status/use-status-hooks"
import { toast } from "react-toastify"

const SendToRRHHButton = ({ tasks, queryParams }) => {
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

        // Verificar si faltan los campos obligatorios
        if (!queryParams.fullname || queryParams.fullname.trim() === "") {
            toast.error("Falta el nombre completo.")
            return
        }

        if (!queryParams.date || queryParams.date.trim() === "") {
            toast.error("Falta la fecha.")
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
        <Button onClick={handleClick} disabled={isLoading}>
            Enviar a RRHH
        </Button>
    )
}

SendToRRHHButton.propTypes = {
    tasks: PropTypes.array.isRequired,
    queryParams: PropTypes.object.isRequired,
}

export default SendToRRHHButton
