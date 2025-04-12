// /src/components/DashboardCard.jsx
import PropTypes from "prop-types"

const DashboardCard = ({ title, stats, total, onStatClick }) => {
    return (
        <article className="rounded-lg bg-white p-4 shadow">
            {title && (
                <header className="mb-2">
                    <h3 className="text-brand-dark-blue text-2xl font-bold">
                        {title}
                    </h3>
                </header>
            )}

            {total && (
                <section className="mb-2">
                    <p className="text-lg text-gray-500">
                        <strong>Total:</strong> {total}
                    </p>
                </section>
            )}

            {stats && stats.length > 0 && (
                <section>
                    <ul className="flex flex-col gap-2">
                        {stats.map((stat, index) => (
                            <li key={index}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        onStatClick && onStatClick(stat)
                                    }
                                    className="text-brand-dark-blue w-full cursor-pointer text-left text-lg focus:outline-none"
                                >
                                    <strong className="font-semibold">
                                        {stat.label}:
                                    </strong>{" "}
                                    {stat.value}
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </article>
    )
}

DashboardCard.propTypes = {
    title: PropTypes.string,
    stats: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
        })
    ),
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onStatClick: PropTypes.func,
}

export default DashboardCard
