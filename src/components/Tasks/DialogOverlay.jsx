// /src/components/Tasks/DialogOverlay.jsx
import { createPortal } from "react-dom"
import { CSSTransition } from "react-transition-group"
import PropTypes from "prop-types"

const DialogOverlay = ({ isOpen, nodeRef, children }) => {
    return createPortal(
        <CSSTransition
            nodeRef={nodeRef}
            in={isOpen}
            timeout={500}
            classNames="dialog-transition"
            unmountOnExit
        >
            <div
                ref={nodeRef}
                className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur"
            >
                {children}
            </div>
        </CSSTransition>,
        document.body
    )
}

DialogOverlay.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    nodeRef: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
}

export default DialogOverlay
