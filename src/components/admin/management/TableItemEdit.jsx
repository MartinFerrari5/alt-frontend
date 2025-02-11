// /src/components/admin/management/TableItemView.jsx

import PropTypes from "prop-types"
import { FaSave, FaTimes, FaTrash } from "react-icons/fa"

const TableItemEdit = ({
    id,
    name,
    editValue,
    onEditChange,
    onSaveEdit,
    onCancelEdit,
    onDeleteClick,
}) => {
    return (
        <tr className="border-b bg-white transition-colors hover:bg-gray-50">
            <td className="px-6 py-4 font-medium text-gray-900">{id}</td>
            <td className="px-6 py-4">
                <input
                    type="text"
                    value={editValue || name}
                    onChange={onEditChange}
                    className="w-full max-w-[200px] rounded-md border border-gray-300 p-1"
                    autoFocus
                />
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                    <button
                        onClick={onSaveEdit}
                        className="flex items-center justify-center p-2 text-green-600 transition-colors hover:text-green-800"
                        title="Guardar"
                    >
                        <FaSave className="h-5 w-5" />
                    </button>
                    <button
                        onClick={onCancelEdit}
                        className="flex items-center justify-center p-2 text-gray-600 transition-colors hover:text-gray-800"
                        title="Cancelar"
                    >
                        <FaTimes className="h-5 w-5" />
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

TableItemEdit.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    editValue: PropTypes.string.isRequired,
    onEditChange: PropTypes.func.isRequired,
    onSaveEdit: PropTypes.func.isRequired,
    onCancelEdit: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
}

export default TableItemEdit
