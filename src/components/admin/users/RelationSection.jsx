// src/components/admin/users/RelationSection.jsx
import { useState } from "react"
import { FaEdit, FaTrash } from "react-icons/fa"
import EditRelationModal from "./EditRelationModal"

/**
 * Componente que muestra una sección de relaciones entre un usuario y otra
 * entidad (como compañías o proyectos). Permite editar la lista de relaciones
 * asociadas y eliminar relaciones.
 *
 * @param {string} title - Título de la sección (por ejemplo "Proyectos")
 * @param {Array} relatedItems - Arreglo de objetos con la información de las
 * relaciones asociadas (por ejemplo un arreglo de objetos con un id y un nombre)
 * @param {Array} availableItems - Arreglo de objetos con la información de las
 * relaciones disponibles para asociar (por ejemplo un arreglo de objetos con un
 * id y un nombre)
 * @param {string} displayProp - Nombre de la propiedad en los objetos de relatedItems
 * y availableItems que se utilizará para mostrar el nombre de la relación.
 * @param {function} onAddRelation - Función que se llamará cuando se asocie una
 * relación (recibe el id de la relación como parámetro)
 * @param {function} onDeleteRelation - Función que se llamará cuando se elimine
 * una relación (recibe el id de la relación como parámetro)
 * @param {ReactNode} customModal - Componente personalizado para mostrar el
 * formulario de edición de relaciones (opcional)
 *
 * @return {ReactNode} Componente que muestra la sección de relaciones y permite
 * editar la lista de relaciones asociadas y eliminar relaciones.
 */
export const RelationSection = ({
    title,
    relatedItems,
    availableItems,
    displayProp,
    onAddRelation,
    onDeleteRelation,
    customModal, // nuevo prop opcional
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
            {showModal &&
                (customModal ? (
                    // Clonamos el componente personalizado para inyectarle onClose y onAddRelation
                    // (asumiendo que el componente custom ya recibe las props necesarias)
                    customModal({ onClose: () => setShowModal(false) })
                ) : (
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
                ))}
        </div>
    )
}
