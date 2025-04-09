import { useEffect } from "react"
import { useOptionsStore } from "../../../store/modules/optionsStore"
import Header from "../../layout/Header"
import DataTable from "./DataTable"
import {
    useEmailMutations,
    useGetEmails,
} from "../../../hooks/data/email/use-email-mutations"

const ManagementTables = () => {
    const {
        companies_table,
        hour_type_table,
        projects_table,
        types_table,
        fetchOptions,
    } = useOptionsStore()

    const {
        emails,
        isLoading: emailsLoading,
        error: emailsError,
    } = useGetEmails()
    const emailMutations = useEmailMutations()

    // Solicita datos para las opciones al montar el componente
    useEffect(() => {
        fetchOptions("companies_table")
        fetchOptions("hour_type_table")
        fetchOptions("projects_table")
        fetchOptions("types_table")
    }, [fetchOptions])

    return (
        <div className="w-full space-y-6">
            <Header subtitle="Gestión de Datos" title="Administración" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DataTable
                    title="Compañías"
                    data={Array.isArray(companies_table) ? companies_table : []}
                />
                <DataTable
                    title="Tipos de Hora"
                    data={Array.isArray(hour_type_table) ? hour_type_table : []}
                />
                <DataTable
                    title="Proyectos"
                    data={Array.isArray(projects_table) ? projects_table : []}
                />
                <DataTable
                    title="Tipos de Tarea"
                    data={Array.isArray(types_table) ? types_table : []}
                />
                <DataTable
                    title="Emails"
                    data={emails}
                    isEmailTable={true}
                    emailMutations={emailMutations}
                    loading={emailsLoading}
                    error={emailsError}
                />
            </div>
        </div>
    )
}

export default ManagementTables
