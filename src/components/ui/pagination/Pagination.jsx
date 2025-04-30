// src/components/ui/pagination/Pagination.jsx
import PropTypes from "prop-types"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

/**
 * Pagination component with first, prev, numbered pages, next, last, and ellipsis.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Ensure numeric values
    const cp = Number(currentPage) || 1
    const tp = Number(totalPages) || 1
    const neighborCount = 1 // pages to show around current

    const handlePrev = () => cp > 1 && onPageChange(cp - 1)
    const handleNext = () => cp < tp && onPageChange(cp + 1)

    // build page range with ellipsis
    const pages = []
    for (let page = 1; page <= tp; page++) {
        if (
            page === 1 ||
            page === tp ||
            (page >= cp - neighborCount && page <= cp + neighborCount)
        ) {
            pages.push(page)
        } else if (
            page === cp - neighborCount - 1 ||
            page === cp + neighborCount + 1
        ) {
            pages.push("ellipsis-" + page)
        }
    }

    return (
        <div className="flex items-center justify-center space-x-2 p-4">
            <button
                onClick={handlePrev}
                disabled={cp <= 1}
                className="flex items-center justify-center rounded px-2 py-1 disabled:opacity-50"
                aria-label="Anterior"
            >
                <FiChevronLeft size={20} />
            </button>

            {pages.map((p) =>
                typeof p === "string" ? (
                    <span key={p} className="px-2">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`rounded px-3 py-1 transition ${p === cp ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={handleNext}
                disabled={cp >= tp}
                className="flex items-center justify-center rounded px-2 py-1 disabled:opacity-50"
                aria-label="Siguiente"
            >
                <FiChevronRight size={20} />
            </button>
        </div>
    )
}

Pagination.propTypes = {
    currentPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    totalPages: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    onPageChange: PropTypes.func.isRequired,
}

export default Pagination
