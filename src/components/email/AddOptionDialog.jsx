// src/components/email/AddOptionDialog.jsx
import PropTypes from "prop-types"
import { useState } from "react"
import { toast } from "react-toastify"
import { useOptionsStore } from "../../store/optionsStore"
import { useEmailMutations } from "../../hooks/data/email/use-email-mutations"
import ModalWrapper from "./ModalWrapper"
import Button from "../Button"

const AddOptionDialog = ({ isOpen, handleClose }) => {
    const addOptionAction = useOptionsStore((state) => state.addOption)
    const { add: addEmails } = useEmailMutations()

    const [selectedTable, setSelectedTable] = useState("projects_table")
    const [optionValue, setOptionValue] = useState("")

    // Función que retorna el placeholder según la opción seleccionada
    const getPlaceholder = () => {
        const placeholders = {
            emails: "Ingrese el email",
            projects_table: "Ingrese el nombre del proyecto",
            hour_type_table: "Ingrese el tipo de hora",
            companies_table: "Ingrese el nombre de la compañía",
            types_table: "Ingrese el tipo de trabajo",
        }
        return placeholders[selectedTable] || "Ingrese el nombre"
    }

    // Función para manejar la respuesta exitosa sin cerrar el modal
    const handleSuccess = () => {
        setOptionValue("")
        toast.success("¡Dato agregado con éxito!", { autoClose: 3000 })
    }

    const handleSaveClick = async () => {
        if (!optionValue.trim()) {
            toast.error("El valor no puede estar vacío", { autoClose: 5000 })
            return
        }

        if (selectedTable === "emails") {
            addEmails.mutate(
                { email: optionValue },
                {
                    onSuccess: () => {
                        handleSuccess()
                    },
                    onError: (error) => {
                        console.error("Error al agregar:", error)
                        toast.error(
                            `Error: ${error.response?.data?.message || "No se pudo agregar"}`,
                            { autoClose: 5000 }
                        )
                    },
                }
            )
        } else {
            try {
                await addOptionAction(selectedTable, optionValue)
                handleSuccess()
            } catch (error) {
                console.error("Error al agregar:", error)
                toast.error(
                    `Error: ${error.response?.data?.message || "No se pudo agregar"}`,
                    { autoClose: 5000 }
                )
            }
        }
    }

    return (
        <ModalWrapper isOpen={isOpen}>
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <h3 className="text-lg font-semibold">Agregar Opción</h3>
                <select
                    className="mt-2 w-full rounded border p-2"
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                >
                    <option value="projects_table">Proyecto</option>
                    <option value="hour_type_table">Tipo de Hora</option>
                    <option value="companies_table">Compañía</option>
                    <option value="types_table">Tipo de trabajo</option>
                    <option value="emails">Email</option>
                </select>
                <input
                    className="mt-2 w-full rounded border p-2"
                    type={selectedTable === "emails" ? "email" : "text"}
                    placeholder={getPlaceholder()}
                    value={optionValue}
                    onChange={(e) => setOptionValue(e.target.value)}
                />
                <div className="mt-4 flex justify-end gap-3">
                    <Button color="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveClick}>Guardar</Button>
                </div>
            </div>
        </ModalWrapper>
    )
}

AddOptionDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
}

export default AddOptionDialog
