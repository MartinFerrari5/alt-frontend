// src/components/admin/management/TableItemView.jsx
import PropTypes from "prop-types"
import { FaEdit, FaTrash } from "react-icons/fa"

const TableItemView = ({ id, name, onEditClick, onDeleteClick }) => {
    return (
        <tr className="border-b bg-white transition-colors hover:bg-gray-50">
            {/* <td className="px-6 py-4 font-medium text-gray-900">{id}</td> */}
            <td className="px-6 py-4">{name}</td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                    <button
                        onClick={onEditClick}
                        className="flex items-center justify-center p-2 text-blue-600 transition-colors hover:text-blue-800"
                        title="Editar"
                    >
                        <FaEdit className="h-5 w-5" />
                    </button>
                    <button
                        onClick={onDeleteClick}
                        className="flex items-center justify-center p-2 text-red-600 transition-colors hover:text-red-800"
                        title="Eliminar"
                    >
                        <FaTrash className="h-5 w-5" />
                    </button>
                </div>
            </td>
        </tr>
    )
}

TableItemView.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
}

export default TableItemView
