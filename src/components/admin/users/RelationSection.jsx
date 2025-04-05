import { FaEdit, FaTrash } from "react-icons/fa"
import EditRelationModal from "./EditRelationModal"
import Button from "../../Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"

export const RelationSection = ({
    title,
    relatedItems,
    availableItems,
    displayProp,
    onAddRelation,
    onDeleteRelation,
    customModal,
}) => {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">{title}</h3>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="flex items-center gap-1"
                            title={`Editar ${title}`}
                        >
                            <FaEdit className="cursor-pointer" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Editar {title}</DialogTitle>
                        </DialogHeader>
                        {customModal ? (
                               customModal({ 
                                onClose: () => {
                                    const closeButton = document.querySelector('[data-radix-dialog-close]');
                                    if (closeButton) {
                                        closeButton.click();
                                    }
                                }
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

            <div className="rounded bg-white p-4 shadow">
                {relatedItems && relatedItems.length > 0 ? (
                    <ul>
                        {relatedItems.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between border-b py-1"
                            >
                                <span>{item[displayProp]}</span>
                                {onDeleteRelation && (
                                    <Button
                                        onClick={() =>
                                            onDeleteRelation(item)
                                        }
                                        title="Eliminar relación"
                                    >
                                        <FaTrash className="text-red-500 hover:text-red-700" />
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay {title.toLowerCase()} asociadas.</p>
                )}
            </div>
        </div>
    )
}