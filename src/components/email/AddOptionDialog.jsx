import PropTypes from "prop-types";
import { useState } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import { toast } from "sonner";
import { useRef } from "react";
import { useAddOptions } from "../../hooks/data/projects/use-add-options";


import Button from "../Button";

const AddOptionDialog = ({ isOpen, handleClose }) => {
    const { mutate: addOptions } = useAddOptions();
    const nodeRef = useRef();
    
    const [selectedTable, setSelectedTable] = useState("projects_table");
    const [optionValue, setOptionValue] = useState("");

    const handleSaveClick = () => {
        if (!optionValue.trim()) {
            toast.error("El valor no puede estar vacío");
            return;
        }

        const payload = {
            table: selectedTable,
            option: optionValue,
        };

        addOptions(payload, {
            onSuccess: () => {
                handleClose();
                setOptionValue("");
                toast.success("¡Opción agregada con éxito!");
            },
            onError: (error) => {
                console.error("Error al agregar opción:", error);
                toast.error(
                    `Error: ${error.response?.data?.message || "No se pudo agregar la opción"}`
                );
            },
        });
    };

    return createPortal(
        <CSSTransition
            nodeRef={nodeRef}
            in={isOpen}
            timeout={500}
            classNames="fixed inset-0 flex items-center justify-center backdrop-blur"
            unmountOnExit
        >
            <div className="relative w-full max-w-md p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">Agregar Opción</h3>
                <select
                    className="w-full mt-2 p-2 border rounded"
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                >
                    <option value="projects_table">Proyecto</option>
                    <option value="hour_type_table">Tipo de Hora</option>
                    <option value="companies_table">Compañía</option>
                </select>
                <input
                    className="w-full mt-2 p-2 border rounded"
                    type="text"
                    placeholder="Ingrese el nombre"
                    value={optionValue}
                    onChange={(e) => setOptionValue(e.target.value)}
                />
                <div className="flex justify-end gap-3 mt-4">
                    <Button color="secondary" onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSaveClick}>Guardar</Button>
                </div>
            </div>
        </CSSTransition>,
        document.body
    );
};

AddOptionDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default AddOptionDialog;
