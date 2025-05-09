// //Input.jsx

import PropTypes from "prop-types"
import { forwardRef } from "react"

import InputErrorMessage from "./InputErrorMessage"
import InputLabel from "./InputLabel"

const Input = forwardRef(({ label, errorMessage, ...rest }, ref) => {
    return (
        <div className="col-span-2">
            <InputLabel htmlFor={rest.id}>{label}</InputLabel>
            <input
                className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                ref={ref}
                {...rest}
            />
            {errorMessage && (
                <InputErrorMessage>{errorMessage}</InputErrorMessage>
            )}
        </div>
    )
})

Input.displayName = "Input"
Input.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
    placeholder: PropTypes.string,
}

export default Input

// className="rounded-lg border border-solid border-brand-border px-4 py-3 outline-brand-custom-green placeholder:text-sm placeholder:text-brand-text-gray"
