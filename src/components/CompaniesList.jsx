import { useNavigate } from "react-router-dom"

const CompaniesList = ({ title, data }) => {
    const navigate = useNavigate()

    const handleRowClick = (id, name) => {
        // Se usa encodeURIComponent para asegurar que el nombre se codifique correctamente en la URL.
        navigate(`/rraa/admin/companies/${id}?name=${encodeURIComponent(name)}`)
    }

    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-bold text-foreground">{title}</h2>
            {data.length > 0 ? (
                <table className="min-w-full overflow-hidden rounded-md border border-border bg-card">
                    <thead className="bg-popover">
                        <tr>
                            <th className="border-b border-border px-4 py-2 text-left text-foreground">
                                ID
                            </th>
                            <th className="border-b border-border px-4 py-2 text-left text-foreground">
                                Nombre de la Compañía
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((company) => (
                            <tr
                                key={company.id}
                                className="cursor-pointer transition-colors hover:bg-muted"
                                onClick={() =>
                                    handleRowClick(company.id, company.option)
                                }
                            >
                                <td className="border-b border-border px-4 py-2 text-foreground">
                                    {company.id}
                                </td>
                                <td className="border-b border-border px-4 py-2 text-foreground">
                                    {company.option}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-muted">No hay compañías disponibles.</p>
            )}
        </div>
    )
}

export default CompaniesList
