import PropTypes from "prop-types"

const InputLabel = (props) => {
    return (
        <label
            className="mb-2 block text-sm font-medium text-gray-900"
            {...props}
        >
            {props.children}
        </label>
    )
}

InputLabel.propTypes = {
    children: PropTypes.node.isRequired,
}

export default InputLabel
