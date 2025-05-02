// /src/components/Tasks/SendToRRHHButton.jsx
import { useCallback, useState } from "react"
import PropTypes from "prop-types"
import Button from "../Button"
import { useSendStatusToRRHH } from "../../hooks/data/status/use-status-hooks"
import { toast } from "react-toastify"
import { LoadingSpinner } from "../../util/LoadingSpinner"
import StatusSelectModal from "../ui/StatusSelectModal"

const SendToRRHHButton = ({ tasks, queryParams, role }) => {
    const { mutate: sendToRRHH, isPending } = useSendStatusToRRHH()
    const [showModal, setShowModal] = useState(false)
    const [adminSelect, setAdminSelect] = useState("2") // por defecto "finalizado"

    const cleanQueryParams = (params) =>
        Object.entries(params).reduce((acc, [key, value]) => {
            if (value != null && value !== "") {
                acc[key] = value
            }
            return acc
        }, {})

    const doSend = useCallback(
        (selectValue) => {
            const cleanedParams = cleanQueryParams({
                company: queryParams.company,
                project: queryParams.project,
                date: queryParams.date,
            })

            cleanedParams.select = selectValue

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
            setShowModal(true)
        } else {
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

            <StatusSelectModal
                isOpen={showModal}
                adminSelect={adminSelect}
                onSelectChange={setAdminSelect}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
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
