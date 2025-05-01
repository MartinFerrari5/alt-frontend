// /src/components/Tasks/SendToRRHHButton.jsx
import { useCallback, useState } from "react"
import PropTypes from "prop-types"
import Button from "../Button"
import { useSendStatusToRRHH } from "../../hooks/data/status/use-status-hooks"
import { toast } from "react-toastify"
import { LoadingSpinner } from "../../util/LoadingSpinner"

const SendToRRHHButton = ({ tasks, queryParams, role }) => {
    const { mutate: sendToRRHH, isPending } = useSendStatusToRRHH()
    const [showModal, setShowModal] = useState(false)
    const [adminSelect, setAdminSelect] = useState("2") // por defecto "finalizado"

    // Limpia solo los params que tienen valor no vacío
    const cleanQueryParams = (params) =>
        Object.entries(params).reduce((acc, [key, value]) => {
            if (value != null && value !== "") {
                acc[key] = value
            }
            return acc
        }, {})

    const doSend = useCallback(
        (selectValue) => {
            // 1. Limpiar filtros
            const cleanedParams = cleanQueryParams({
                company: queryParams.company,
                project: queryParams.project,
                date: queryParams.date,
            })

            // 2. Agregar select dinámico
            cleanedParams.select = selectValue

            // 3. Enviar payload
            sendToRRHH(
                { queryParams: cleanedParams, payload: { tasks } },
                {
                    onSuccess: () => {
                        toast.success(
                            role === "admin"
                                ? "Tareas finalizadas exitosamente!"
                                : "Tareas enviadas a RRHH exitosamente!"
                        )
                    },
                    onError: (error) => {
                        toast.error(
                            role === "admin"
                                ? `Error al finalizar tareas: ${error.message}`
                                : `Error al enviar tareas a RRHH: ${error.message}`
                        )
                    },
                }
            )
        },
        [tasks, queryParams, role, sendToRRHH]
    )

    const handleClick = () => {
        if (!tasks || tasks.length === 0) {
            toast.error("No hay tareas para enviar.")
            return
        }

        if (role === "admin") {
            // Mostrar modal para elegir progreso o finalizado
            setShowModal(true)
        } else {
            // Usuario normal: select=1
            doSend(1)
        }
    }

    const handleConfirm = () => {
        doSend(Number(adminSelect))
        setShowModal(false)
    }

    const handleCancel = () => {
        setShowModal(false)
    }

    return (
        <>
            <Button onClick={handleClick} disabled={isPending}>
                {isPending ? (
                    <LoadingSpinner />
                ) : role === "admin" ? (
                    "Finalizar tareas"
                ) : (
                    "Enviar a RRHH"
                )}
            </Button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold">
                            Selecciona estado final
                        </h2>
                        <select
                            className="mb-4 w-full rounded border p-2"
                            value={adminSelect}
                            onChange={(e) => setAdminSelect(e.target.value)}
                        >
                            <option value="0">Progreso</option>
                            <option value="2">Finalizado</option>
                        </select>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </button>
                            <button
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                onClick={handleConfirm}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
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
