// /src/components/admin/users/EditRelationModal.jsx
import { useState } from "react"
import Button from "../../Button"
import Dropdown from "../../Dropdown/Dropdown"

const EditRelationModal = ({
    title,
    associatedItems,
    availableItems,
    displayProp,
    onAddRelation,
    onClose,
}) => {
    const [selectedItem, setSelectedItem] = useState("")

    // Función register personalizada para inyectar onChange y value
    const customRegister = () => ({
        onChange: (e) => setSelectedItem(e.target.value),
        value: selectedItem,
    })

    const handleAddRelation = () => {
        if (selectedItem) {
            onAddRelation(selectedItem)
            setSelectedItem("")
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-11/12 rounded bg-white p-6 shadow-lg md:w-2/3 lg:w-1/2">
                <h3 className="mb-4 text-xl font-bold">Editar {title}</h3>
                <div className="flex gap-4">
                    {/* Panel de elementos ya asociados */}
                    <div className="w-1/2">
                        <h4 className="mb-2 text-lg font-semibold">
                            Asociados
                        </h4>
                        <ul className="max-h-64 overflow-y-auto">
                            {associatedItems && associatedItems.length > 0 ? (
                                associatedItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between border-b py-2"
                                    >
                                        <span>{item[displayProp]}</span>
                                    </li>
                                ))
                            ) : (
                                <li>No hay {title.toLowerCase()} asociados.</li>
                            )}
                        </ul>
                    </div>
                    {/* Panel de elementos disponibles con Dropdown */}
                    <div className="w-1/2">
                        <h4 className="mb-2 text-lg font-semibold">
                            Agregar {title}
                        </h4>
                        <Dropdown
                            id="availableItems"
                            label="Seleccionar"
                            register={customRegister}
                            error={null}
                            isLoading={false}
                            isError={false}
                            items={availableItems.map((item) => ({
                                id: item.id,
                                option: item[displayProp],
                            }))}
                            loadingText="Cargando..."
                            errorText="Error al cargar"
                            useIdAsValue={true} // Se usa el id como value
                        />

                        <Button
                            onClick={handleAddRelation}
                            disabled={!selectedItem}
                        >
                            Agregar
                        </Button>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={onClose}>Cerrar</Button>
                </div>
            </div>
        </div>
    )
}

export default EditRelationModal
