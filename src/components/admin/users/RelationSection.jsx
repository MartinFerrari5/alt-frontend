// src/components/admin/users/RelationSection.jsx
import { useState } from "react"
import { FaEdit, FaTrash } from "react-icons/fa"
import EditRelationModal from "./EditRelationModal"

const RelationSection = ({
    title,
    relatedItems,
    availableItems,
    displayProp,
    onAddRelation,
    onDeleteRelation,
}) => {
    const [showModal, setShowModal] = useState(false)

    return (
        <div className="mt-8">
            <h2 className="mb-2 flex items-center text-xl font-bold">
                {title} Asociadas
                <button
                    onClick={() => setShowModal(true)}
                    className="ml-2"
                    title={`Editar ${title}`}
                >
                    <FaEdit className="cursor-pointer" />
                </button>
            </h2>
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
                                    <button
                                        onClick={() =>
                                            onDeleteRelation(item.id)
                                        }
                                        title="Eliminar relación"
                                    >
                                        <FaTrash className="text-red-500 hover:text-red-700" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay {title.toLowerCase()} asociadas.</p>
                )}
            </div>
            {showModal && (
                <EditRelationModal
                    title={title}
                    associatedItems={relatedItems}
                    availableItems={availableItems}
                    displayProp={displayProp}
                    onAddRelation={(id) => {
                        onAddRelation(id)
                        setShowModal(false)
                    }}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    )
}

export default RelationSection
