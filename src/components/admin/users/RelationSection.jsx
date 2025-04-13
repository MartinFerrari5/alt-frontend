import { Trash } from "lucide-react"
import EditRelationModal from "./EditRelationModal"
import Button from "../../../components/Button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../ui/dialog"
import DeleteConfirmationModal from "../../Tasks/DeleteConfirmationModal"
import { useState } from "react"

export const RelationSection = ({
    icon,
    title,
    relatedItems,
    availableItems,
    displayProp,
    onAddRelation,
    onDeleteRelation,
    customModal,
    customSelector,
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const handleDeleteClick = (item) => {
        setSelectedItem(item)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = () => {
        if (selectedItem) {
            onDeleteRelation(selectedItem)
        }
        setShowDeleteModal(false)
        setSelectedItem(null)
    }

    const handleCancelDelete = () => {
        setShowDeleteModal(false)
        setSelectedItem(null)
    }

    return (
        <div>
            <div className="mb-2 flex flex-col">
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        {icon && (
                            <span className="text-main-color">{icon}</span>
                        )}
                        {title}
                    </h3>
                    {/* Botón para abrir el modal de edición */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-1"
                                title={`Editar ${title}`}
                            >
                                <span className="h-4 w-4">+</span>
                                Agregar
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Asociación de {title}</DialogTitle>
                            </DialogHeader>
                            {customModal ? (
                                customModal({
                                    onClose: () => {
                                        const closeButton =
                                            document.querySelector(
                                                "[data-radix-dialog-close]"
                                            )
                                        if (closeButton) {
                                            closeButton.click()
                                        }
                                    },
                                })
                            ) : (
                                <EditRelationModal
                                    title={title}
                                    associatedItems={relatedItems}
                                    availableItems={availableItems}
                                    displayProp={displayProp}
                                    onAddRelation={onAddRelation}
                                />
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
                {/* Aquí se renderiza el componente selector, si se pasó */}
                {customSelector && <>{customSelector}</>}
            </div>

            <div className="bg-grey-bg rounded border p-2">
                {relatedItems && relatedItems.length > 0 ? (
                    <ul className="divide-grey-strong-bg divide-y">
                        {relatedItems.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between py-2"
                            >
                                <span>{item[displayProp]}</span>
                                {onDeleteRelation && (
                                    <button
                                        onClick={() => handleDeleteClick(item)}
                                        title="Eliminar relación"
                                        className="rounded-md border-2 p-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="py-2 text-center text-sm text-gray-500">
                        No {title.toLowerCase()} associated with this user
                    </div>
                )}
            </div>
            {/* Modal de confirmación */}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    message={`¿Estás seguro de que deseas eliminar esta ${title.toLowerCase()}?`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                />
            )}
        </div>
    )
}
