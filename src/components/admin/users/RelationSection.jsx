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

export const RelationSection = ({
    icon,
    title,
    relatedItems,
    availableItems,
    displayProp,
    onAddRelation,
    onDeleteRelation,
    customModal,
    customSelector, // nuevo prop para renderizar un selector (por ejemplo, CompanySelector)
}) => {
    return (
        <div>
            <div className="mb-2 flex flex-col">
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        {icon && (
                            <span className="text-main-color">{icon}</span>
                        )}
                        Associated {title}
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
                                Add Company
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
                {customSelector && <div className="mt-2">{customSelector}</div>}
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
                                        onClick={() => onDeleteRelation(item)}
                                        title="Eliminar relación"
                                        className="text-red-500 hover:text-red-700"
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
        </div>
    )
}
