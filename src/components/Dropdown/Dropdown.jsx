import PropTypes from "prop-types"

const Dropdown = ({
    id,
    label,
    register,
    error,
    isLoading,
    isError,
    items,
    loadingText,
    errorText,
}) => {
    return (
        <div className="group relative z-0 mb-5 w-full">
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
                    items.map((item) => (
                        <option key={item.id} value={item.options}>
                            {item.options}
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
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            options: PropTypes.string.isRequired,
        })
    ).isRequired,
    loadingText: PropTypes.string.isRequired,
    errorText: PropTypes.string.isRequired,
}

export default Dropdown
