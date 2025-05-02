// /src/components/Tasks/StatusSelectModal.jsx
import PropTypes from "prop-types"
import Button from "../Button"
import { LoadingSpinner } from "../../util/LoadingSpinner"

const StatusSelectModal = ({
    isOpen,
    adminSelect,
    onSelectChange,
    onCancel,
    onConfirm,
    isLoading, // <--- NUEVA PROP
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">
                    Selecciona estado final
                </h2>
                <select
                    className="mb-4 w-full rounded border p-2"
                    value={adminSelect}
                    onChange={(e) => onSelectChange(e.target.value)}
                >
                    <option value="0">Progreso</option>
                    <option value="2">Finalizado</option>
                </select>
                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        color="secondary"
                        variant="outline"
                        className="text-red-600 hover:bg-red-100"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading && <LoadingSpinner />}
                        Confirmar
                    </Button>
                </div>
            </div>
        </div>
    )
}

StatusSelectModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    adminSelect: PropTypes.string.isRequired,
    onSelectChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isLoading: PropTypes.bool, // <--- NUEVA PROP
}

StatusSelectModal.defaultProps = {
    isLoading: false,
}

export default StatusSelectModal
