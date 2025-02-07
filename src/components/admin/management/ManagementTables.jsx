// /src/components/admin/management/ManagementTables.jsx

import { useGetHourTypes } from "../../../hooks/data/use-get-typeHour"
import { useGetCompanies } from "../../../hooks/data/use-get-companies"
import { useGetProjects } from "../../../hooks/data/projects/use-get-projects"
import Header from "../../Header"
import TableItem from "./TableItem"
import { useGetEmail } from "../../../hooks/data/email/Use-get-email"

const ManagementTables = () => {
    const { data: hourTypes = [] } = useGetHourTypes()
    const { data: companies = [] } = useGetCompanies()
    const { data: projects = [] } = useGetProjects()
    const { data: emails = [] } = useGetEmail()

    return (
        <div className="w-full space-y-6 px-8 py-16">
            <Header subtitle="Gestión de Datos" title="Administración" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DataTable title="Compañías" data={companies} />
                <DataTable title="Tipos de Hora" data={hourTypes} />
                <DataTable title="Proyectos" data={projects} />
                <DataTable title="Emails" data={emails} />
            </div>
        </div>
    )
}

const DataTable = ({ title, data }) => {
    return (
        <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
                {title}
            </h2>
            <div className="relative max-h-[400px] overflow-y-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="px-6 py-3">Id</th>
                            <th className="px-6 py-3">{title}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="2"
                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                >
                                    No hay datos disponibles.
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) =>
                                typeof item === "object" && item !== null ? (
                                    <TableItem
                                        key={item.id || index}
                                        id={item.id}
                                        name={item.email || "Sin email"}
                                    />
                                ) : (
                                    <TableItem
                                        key={index}
                                        id={index + 1}
                                        name={item}
                                    />
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManagementTables
