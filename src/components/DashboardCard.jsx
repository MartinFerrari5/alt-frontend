// /src/components/DashboardCard.jsx
const DashboardCard = ({ icon, title, stats, onStatClick }) => {
    return (
        <div className="items-center justify-center gap-2 rounded-lg bg-white p-4 shadow">
            {title && (
                <h3 className="text-lg font-bold text-brand-dark-blue">
                    {/* <span className="text-2xl">{icon}</span> */}
                    {title}
                </h3>
            )}
            <div className="items-center gap-2">
                <div className="flex flex-col">
                    {stats &&
                        stats.map((stat, index) => (
                            <p
                                key={index}
                                className="cursor-pointer text-sm text-brand-dark-blue"
                                onClick={() => onStatClick && onStatClick(stat)}
                            >
                                <span className="font-semibold">
                                    {stat.label}:
                                </span>{" "}
                                {stat.value}
                            </p>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default DashboardCard
