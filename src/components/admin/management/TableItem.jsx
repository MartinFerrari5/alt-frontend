// /src/components/admin/management/TableItem.jsx

import PropTypes from "prop-types"

const TableItem = ({ id, name }) => {
    return (
        <tr className="border-b bg-white">
            <td className="px-6 py-4 font-medium text-gray-900">{id}</td>
            <td className="px-6 py-4">{name}</td>
        </tr>
    )
}

TableItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
}

export default TableItem
