// /src/components/Tasks/AddTaskDialog.jsx
import PropTypes from "prop-types"
import { useRef } from "react"
import DialogOverlay from "./DialogOverlay"
import DialogHeader from "./DialogHeader"
import AddTaskForm from "./AddTaskForm"

const AddTaskDialog = ({ isOpen, handleClose }) => {
    const nodeRef = useRef(null)

    return (
        <div className="relative max-h-full w-full max-w-md p-4">
            <DialogOverlay isOpen={isOpen} nodeRef={nodeRef}>
                <div className="relative w-full max-w-lg rounded-xl bg-white shadow-sm">
                    <DialogHeader title="Nueva Tarea" />
                    <div className="p-4">
                        <AddTaskForm onClose={handleClose} />
                    </div>
                </div>
            </DialogOverlay>
        </div>
    )
}

AddTaskDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
}

export default AddTaskDialog
