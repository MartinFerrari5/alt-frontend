import { useNavigate } from "react-router-dom"

const CompaniesList = ({ title, data }) => {
    const navigate = useNavigate()

    const handleRowClick = (id) => {
        navigate(`/admin/companies/${id}`)
    }

    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">{title}</h2>
            {data.length > 0 ? (
                <table className="min-w-full border border-gray-200 bg-white">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2">ID</th>
                            <th className="border-b px-4 py-2">
                                Nombre de la Compañía
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((company) => (
                            <tr
                                key={company.id}
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => handleRowClick(company.id)}
                            >
                                <td className="border-b px-4 py-2">
                                    {company.id}
                                </td>
                                <td className="border-b px-4 py-2">
                                    {company.option}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No hay compañías disponibles.</p>
            )}
        </div>
    )
}

export default CompaniesList
