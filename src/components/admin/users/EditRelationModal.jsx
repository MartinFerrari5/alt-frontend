import { useState } from "react"
import Button from "../../Button"
import Dropdown from "../../Dropdown/Dropdown"
import { DialogClose } from "../../ui/dialog"

const EditRelationModal = ({
    title,
    associatedItems,
    availableItems,
    displayProp,
    onAddRelation,
}) => {
    const [selectedItem, setSelectedItem] = useState("")

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
        <div className="max-h-[80vh] overflow-y-auto">
            <div className="flex gap-4">
                {/* Panel de elementos ya asociados */}
                <div className="w-1/2">
                    <h4 className="mb-2 text-lg font-semibold">Asociados</h4>
                    <ul className="max-h-64 overflow-y-auto">
                        {associatedItems && associatedItems.length > 0 ? (
                            associatedItems.map((item) => (
                                <li
                                    key={item.relationshipId || item.id}
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
                            id: item.id || item.company_id || item.project_id,
                            option: item[displayProp] || item.options,
                        }))}
                        loadingText="Cargando..."
                        errorText="Error al cargar"
                        useIdAsValue={true}
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
                <DialogClose asChild>
                    <Button className="bg-red-500 text-white hover:bg-red-600">
                        Cerrar
                    </Button>
                </DialogClose>
            </div>
        </div>
    )
}

export default EditRelationModal
