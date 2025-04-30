// src/components/ui/pagination/Pagination.jsx
import PropTypes from "prop-types"

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
    const handleFirst = () => cp !== 1 && onPageChange(1)
    const handleLast = () => cp !== tp && onPageChange(tp)

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
                onClick={handleFirst}
                disabled={cp === 1}
                className="rounded px-2 py-1 disabled:opacity-50"
            >
                Primera
            </button>

            <button
                onClick={handlePrev}
                disabled={cp <= 1}
                className="rounded px-2 py-1 disabled:opacity-50"
            >
                Anterior
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
                className="rounded px-2 py-1 disabled:opacity-50"
            >
                Siguiente
            </button>

            <button
                onClick={handleLast}
                disabled={cp === tp}
                className="rounded px-2 py-1 disabled:opacity-50"
            >
                Última
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
