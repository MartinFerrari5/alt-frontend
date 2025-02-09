// /src/components/admin/management/TableItem.jsx

import PropTypes from "prop-types"

const TableItem = ({ id, name, onDelete }) => {
    return (
        <tr className="border-b bg-white">
            <td className="px-6 py-4 font-medium text-gray-900">{id}</td>
            <td className="px-6 py-4">{name}</td>
            <td className="px-6 py-4 text-right">
                <button
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-900"
                >
                    Eliminar
                </button>
            </td>
        </tr>
    )
}

TableItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default TableItem
