// /src/components/Tasks/DialogHeader.jsx
import PropTypes from "prop-types"

const DialogHeader = ({ title }) => {
    return (
        <header className="flex items-center justify-center rounded-t border-b p-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </header>
    )
}

DialogHeader.propTypes = {
    title: PropTypes.string.isRequired,
}

export default DialogHeader
