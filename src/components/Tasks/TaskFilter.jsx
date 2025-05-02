// src/components/Tasks/TaskFilter.jsx
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import useAuthStore from "../../store/modules/authStore"
import Dropdown from "../Dropdown/Dropdown"
import Button from "../Button"
import { getCompanyProjects } from "../../hooks/data/options/optionsService"
import { useOptionsStore } from "../../store/modules/optionsStore"

/**
 * Componente para filtrar tareas.
 */
const TaskFilter = ({ onFilter, currentPath }) => {
    const user = useAuthStore((state) => state.user)
    const [searchParams, setSearchParams] = useSearchParams()
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullname: "",
            company: "",
            project: "",
            status: "",
            startDate: "",
            endDate: "",
            hourtype: "",
        },
    })

    const { companies_table, hour_type_table, fetchOptions } = useOptionsStore()
    const [filteredProjects, setFilteredProjects] = useState([])

    // Cargar empresas y tipos de hora
    useEffect(() => {
        fetchOptions("companies_table")
        fetchOptions("hour_type_table")
    }, [fetchOptions])

    // Sincronizar formulario con URL
    useEffect(() => {
        const fullname = searchParams.get("fullname") || ""
        const company = searchParams.get("company") || ""
        const project = searchParams.get("project") || ""
        const status = searchParams.get("status") || ""
        const hourtype = searchParams.get("hourtype") || ""
        const urlDate = searchParams.get("date") || ""

        let startDate = ""
        let endDate = ""
        if (urlDate) {
            const parts = urlDate.split(" ")
            if (parts.length === 2) {
                startDate = parts[0]
                endDate = parts[1]
            } else {
                startDate = urlDate
            }
        }

        setValue("fullname", fullname)
        setValue("company", company)
        setValue("project", project)
        setValue("status", status)
        setValue("hourtype", hourtype)
        setValue("startDate", startDate)
        setValue("endDate", endDate)
    }, [searchParams, setValue])

    // Cargar proyectos cuando cambia compañía (para todos los roles)
    const selectedCompany = watch("company")
    useEffect(() => {
        if (selectedCompany) {
            getCompanyProjects(selectedCompany)
                .then((projects) => {
                    // Asumimos que projects es array de { project_id, project_name }
                    setFilteredProjects(projects)
                    setValue("project", "")
                })
                .catch((err) => toast.error(err.message))
        } else {
            setFilteredProjects([])
            setValue("project", "")
        }
    }, [selectedCompany, setValue])

    // Envía filtros al padre
    const onSubmit = (data) => {
        const {
            fullname,
            company,
            project,
            status,
            startDate,
            endDate,
            hourtype,
        } = data
        const dateRange =
            startDate && endDate ? `${startDate} ${endDate}` : startDate || ""
        onFilter({
            fullname,
            company,
            project,
            status,
            date: dateRange,
            hourtype,
        })
        // Sincronizar en URL
        setSearchParams({
            fullname,
            company,
            project,
            status,
            hourtype,
            date: dateRange,
        })
    }

    // Opciones de estado
    const statusOptions = [
        { id: "0", option: "Progreso" },
        { id: "1", option: "Enviado a RRHH" },
        { id: "2", option: "Finalizado" },
    ]

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
            {user.role === "admin" && (
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    {...register("fullname")}
                    className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                />
            )}

            <Dropdown
                id="company"
                label="Empresa"
                register={register}
                error={errors.company}
                isLoading={!companies_table || companies_table.length === 0}
                isError={false}
                items={Array.isArray(companies_table) ? companies_table : []}
                loadingText="Cargando empresas..."
                errorText="Error cargando empresas"
                valueKey={user.role === "admin" ? "id" : "company_id"}
            />

            <Dropdown
                id="project"
                label="Proyecto"
                register={register}
                error={errors.project}
                isLoading={!filteredProjects || filteredProjects.length === 0}
                isError={false}
                items={Array.isArray(filteredProjects) ? filteredProjects : []}
                loadingText="Cargando proyectos..."
                errorText="Error cargando proyectos"
                valueKey={user.role === "admin" ? "id" : "project_id"}
            />

            <Dropdown
                id="hourtype"
                label="Tipo de Hora"
                register={register}
                error={errors.hourtype}
                isLoading={!hour_type_table || hour_type_table.length === 0}
                isError={false}
                items={Array.isArray(hour_type_table) ? hour_type_table : []}
                valueKey="hour_type_id"
                loadingText="Cargando tipos de hora..."
                errorText="Error cargando tipos de hora"
            />

            {currentPath === "/rraa/history" && (
                <Dropdown
                    id="status"
                    label="Estado"
                    register={register}
                    error={errors.status}
                    isLoading={false}
                    isError={false}
                    items={statusOptions}
                    valueKey="id"
                />
            )}

            <input
                type="date"
                {...register("startDate")}
                className="rounded-lg border p-2"
            />
            <input
                type="date"
                {...register("endDate")}
                className="rounded-lg border p-2"
            />

            <Button
                type="submit"
                color="primary"
                size="lg"
                className="rounded-lg transition-transform active:scale-95"
            >
                Filtrar
            </Button>
        </form>
    )
}

export default TaskFilter
