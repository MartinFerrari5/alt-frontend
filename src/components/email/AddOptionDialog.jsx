import PropTypes from "prop-types"
import { useState, useRef } from "react"
import { createPortal } from "react-dom"
import { CSSTransition } from "react-transition-group"
import { toast } from "sonner"
import { useAddOptions } from "../../hooks/data/projects/use-add-options"
import Button from "../Button"
import { useAddEmail } from "../../hooks/data/email/Use-add-email"

const AddOptionDialog = ({ isOpen, handleClose }) => {
    const { mutate: addOptions } = useAddOptions()
    const { mutate: addEmails } = useAddEmail()
    const nodeRef = useRef()

    const [selectedTable, setSelectedTable] = useState("projects_table")
    const [optionValue, setOptionValue] = useState("")

    const handleSaveClick = () => {
        if (!optionValue.trim()) {
            toast.error("El valor no puede estar vacío")
            return
        }

        const payload =
            selectedTable === "emails"
                ? { email: optionValue }
                : { table: selectedTable, option: optionValue }

        const mutationFn = selectedTable === "emails" ? addEmails : addOptions

        mutationFn(payload, {
            onSuccess: () => {
                handleClose()
                setOptionValue("")
                toast.success("¡Dato agregado con éxito!")
            },
            onError: (error) => {
                console.error("Error al agregar:", error)
                toast.error(
                    `Error: ${error.response?.data?.message || "No se pudo agregar"}`
                )
            },
        })
    }

    return (
        <CSSTransition
            nodeRef={nodeRef}
            in={isOpen}
            timeout={300}
            classNames="fade"
            unmountOnExit
        >
            <div className="relative max-h-full w-full max-w-md p-4">
                {createPortal(
                    <div
                        ref={nodeRef}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    >
                        <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                            <h3 className="text-lg font-semibold">
                                Agregar Opción
                            </h3>
                            <select
                                className="mt-2 w-full rounded border p-2"
                                value={selectedTable}
                                onChange={(e) =>
                                    setSelectedTable(e.target.value)
                                }
                            >
                                <option value="projects_table">Proyecto</option>
                                <option value="hour_type_table">
                                    Tipo de Hora
                                </option>
                                <option value="companies_table">
                                    Compañía
                                </option>
                                <option value="emails">Email</option>{" "}
                                {/* 🆕 Opción agregada */}
                            </select>
                            <input
                                className="mt-2 w-full rounded border p-2"
                                type={
                                    selectedTable === "emails"
                                        ? "email"
                                        : "text"
                                } // 🛠 Input dinámico
                                placeholder={
                                    selectedTable === "emails"
                                        ? "Ingrese el email"
                                        : "Ingrese el nombre"
                                }
                                value={optionValue}
                                onChange={(e) => setOptionValue(e.target.value)}
                            />
                            <div className="mt-4 flex justify-end gap-3">
                                <Button color="secondary" onClick={handleClose}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleSaveClick}>
                                    Guardar
                                </Button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </CSSTransition>
    )
}

AddOptionDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
}

export default AddOptionDialog
