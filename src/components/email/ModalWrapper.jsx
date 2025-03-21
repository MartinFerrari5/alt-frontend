// src/components/email/ModalWrapper.jsx
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import { createPortal } from "react-dom";

const ModalWrapper = ({ isOpen, children }) => {
  return createPortal(
    <CSSTransition in={isOpen} timeout={300} classNames="fade" unmountOnExit>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        {children}
      </div>
    </CSSTransition>,
    document.body
  );
};

ModalWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default ModalWrapper;
