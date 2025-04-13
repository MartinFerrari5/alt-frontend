import { useState } from "react"
import Button from "../../Button"
import Dropdown from "../../Dropdown/Dropdown"
import { DialogClose } from "../../ui/dialog"
import { Save, X } from "lucide-react"

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
        // Contenedor general para controlar el scroll y el padding general del modal
        <div className="max-h-[90vh] overflow-y-auto p-4">
            {/* Contenedor principal del modal con mayor ancho y responsivo */}
            <div className="mx-auto w-full max-w-[95vw] rounded-lg bg-white p-8 shadow-xl sm:max-w-3xl md:max-w-5xl lg:max-w-6xl">
                {/* Encabezado del modal */}
                <header className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Asociación de {title}
                    </h2>
                </header>

                {/* Contenido principal dividido en dos paneles: asociados y disponibles */}
                <section className="flex flex-col gap-8 md:flex-row">
                    {/* Panel de elementos ya asociados */}
                    <article className="md:w-1/2">
                        <h3 className="mb-4 text-xl font-bold text-gray-800">
                            Asociados
                        </h3>
                        <ul className="max-h-80 overflow-y-auto rounded-lg border border-gray-200 p-4">
                            {associatedItems && associatedItems.length > 0 ? (
                                associatedItems.map((item) => (
                                    <li
                                        key={item.relationshipId || item.id}
                                        className="flex items-center justify-between border-b border-gray-100 py-2.5 last:border-0"
                                    >
                                        <span className="text-gray-700">
                                            {item[displayProp]}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <li className="py-2 italic text-gray-500">
                                    No hay {title.toLowerCase()} asociados.
                                </li>
                            )}
                        </ul>
                    </article>

                    {/* Panel de elementos disponibles para agregar */}
                    <article className="md:w-1/2">
                        <h3 className="mb-4 text-xl font-bold text-gray-800">
                            Agregar {title}
                        </h3>
                        <Dropdown
                            id="availableItems"
                            label="Seleccionar"
                            register={customRegister}
                            error={null}
                            isLoading={false}
                            isError={false}
                            items={availableItems.map((item) => ({
                                id: item.id || item.project_id,
                                option: item[displayProp] || item.options,
                            }))}
                            loadingText="Cargando..."
                            errorText="Error al cargar"
                            useIdAsValue={true}
                        />
                    </article>
                </section>

                {/* Sección de botones, con una separación mayor */}
                <footer className="mt-8 flex justify-end gap-4">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            className="text-red-600 hover:bg-red-100"
                        >
                            <X className="h-4 w-4" />
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleAddRelation}
                        disabled={!selectedItem}
                    >
                        <Save className="h-4 w-4" />
                        Agregar
                    </Button>
                </footer>
            </div>
        </div>
    )
}

export default EditRelationModal
