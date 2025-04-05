import { FaEdit, FaTrash } from "react-icons/fa"
import EditRelationModal from "./EditRelationModal"
import Button from "../../Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"
import { Trash } from "lucide-react"

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

            <div className="bg-grey-bg rounded border p-2">
                {relatedItems && relatedItems.length > 0 ? (
                    <ul 
                    className="divide-grey-strong-bg divide-y"
                    >
                        {relatedItems.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between py-2"
                            >
                                <span>{item[displayProp]}</span>
                                {onDeleteRelation && (
                                    <button
                                        onClick={() =>
                                            onDeleteRelation(item)
                                        }
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