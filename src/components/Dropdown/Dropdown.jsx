import PropTypes from "prop-types"

const Dropdown = ({ id, label, register, error, isLoading, isError, items, loadingText, errorText }) => {
    return (
        <div className="mb-6">
            <label htmlFor={id} className="mb-1 block">
                {label}
            </label>
            <select
                id={id}
                {...register(id)}
                className="form-select"
                disabled={isLoading}
            >
                {isLoading ? (
                    <option>{loadingText}</option>
                ) : isError ? (
                    <option className="text-red-500">{errorText}</option>
                ) : (
                    items.map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))
                )}
            </select>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
    )
}

Dropdown.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    register: PropTypes.func.isRequired,
    error: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    loadingText: PropTypes.string.isRequired,
    errorText: PropTypes.string.isRequired,
}

export default Dropdown