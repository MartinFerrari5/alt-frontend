// // TimeSelect.jsx

import PropTypes from "prop-types"
import { forwardRef } from "react"

import InputErrorMessage from "./InputErrorMessage"
import InputLabel from "./InputLabel"

const TimeSelect = forwardRef((props, ref) => {
    return (
        <div className="flex flex-col gap-1 text-left">
            <InputLabel htmlFor="time">Horario</InputLabel>

            <select
                id="time"
                className="border-brand-border outline-brand-custom-green placeholder:text-brand-text-gray rounded-lg border border-solid px-4 py-3 placeholder:text-sm"
                {...props}
                ref={ref}
            >
                <option value="morning">Mañana</option>
                <option value="afternoon">Tarde</option>
                <option value="evening">Noche</option>
            </select>

            {props.errorMessage && (
                <InputErrorMessage>{props.errorMessage}</InputErrorMessage>
            )}
        </div>
    )
})

TimeSelect.displayName = "TimeSelect"
TimeSelect.propTypes = {
    errorMessage: PropTypes.string,
}

export default TimeSelect
