// /src/components/Tasks/SendToRRHHButton.jsx
import { useCallback } from "react"
import PropTypes from "prop-types"
import Button from "../Button"
import { useSendStatusToRRHH } from "../../hooks/data/status/use-status-hooks"
import { toast } from "react-toastify"
import { LoadingSpinner } from "../../util/LoadingSpinner"

const SendToRRHHButton = ({ tasks, queryParams, role }) => {
    const { mutate: sendToRRHH, isPending } = useSendStatusToRRHH()

    // Limpia solo los params que tienen valor no vacío
    const cleanQueryParams = (params) =>
        Object.entries(params).reduce((acc, [key, value]) => {
            if (value != null && value !== "") {
                acc[key] = value
            }
            return acc
        }, {})

    const handleClick = useCallback(() => {
        if (!tasks || tasks.length === 0) {
            toast.error("No hay tareas para enviar.")
            return
        }

        // Para usuarios, asegurarnos de que haya filtros definidos
        // if (
        //   role === "user" &&
        //   (!queryParams.company || !queryParams.project || !queryParams.date)
        // ) {
        //   toast.error(
        //     "Debes elegir compañía, proyecto y fecha para poder enviar a RRHH."
        //   )
        //   return
        // }

        // 1. Limpiar los query params (queda solo company, project, date con valor)
        const cleanedParams = cleanQueryParams({
            company: queryParams.company,
            project: queryParams.project,
            date: queryParams.date,
        })

        // 2. Agregar select según rol
        cleanedParams.select = role === "admin" ? 2 : 1

        // 3. Payload con tareas completas
        const payloadTasks = tasks

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
    queryParams: PropTypes.shape({
        company: PropTypes.string,
        project: PropTypes.string,
        date: PropTypes.string,
    }).isRequired,
    role: PropTypes.string.isRequired,
}

export default SendToRRHHButton
