import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import { toast } from "sonner";
import { useAddOptions } from "../../hooks/data/projects/use-add-options";
import Button from "../Button";
import { useAddEmail } from "../../hooks/data/email/Use-add-email";

const AddOptionDialog = ({ isOpen, handleClose }) => {
    const { mutate: addOptions } = useAddOptions();
    const { mutate: addEmails } = useAddEmail();
    const nodeRef = useRef();
    
    const [selectedTable, setSelectedTable] = useState("projects_table");
    const [optionValue, setOptionValue] = useState("");

    const handleSaveClick = () => {
        if (!optionValue.trim()) {
            toast.error("El valor no puede estar vacío");
            return;
        }

        const payload =
            selectedTable === "emails"
                ? { email: optionValue }
                : { table: selectedTable, option: optionValue };

        const mutationFn = selectedTable === "emails" ? addEmails : addOptions;

        mutationFn(payload, {
            onSuccess: () => {
                handleClose();
                setOptionValue("");
                toast.success("¡Dato agregado con éxito!");
            },
            onError: (error) => {
                console.error("Error al agregar:", error);
                toast.error(`Error: ${error.response?.data?.message || "No se pudo agregar"}`);
            },
        });
    };

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
                    <div ref={nodeRef} className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50">
                        <div className="relative rounded-xl bg-white shadow-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold">Agregar Opción</h3>
                            <select
                                className="w-full mt-2 p-2 border rounded"
                                value={selectedTable}
                                onChange={(e) => setSelectedTable(e.target.value)}
                            >
                                <option value="projects_table">Proyecto</option>
                                <option value="hour_type_table">Tipo de Hora</option>
                                <option value="companies_table">Compañía</option>
                                <option value="emails">Email</option> {/* 🆕 Opción agregada */}
                            </select>
                            <input
                                className="w-full mt-2 p-2 border rounded"
                                type={selectedTable === "emails" ? "email" : "text"} // 🛠 Input dinámico
                                placeholder={selectedTable === "emails" ? "Ingrese el email" : "Ingrese el nombre"}
                                value={optionValue}
                                onChange={(e) => setOptionValue(e.target.value)}
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <Button color="secondary" onClick={handleClose}>Cancelar</Button>
                                <Button onClick={handleSaveClick}>Guardar</Button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
             </div>
        </CSSTransition>
    );
};

AddOptionDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default AddOptionDialog;
