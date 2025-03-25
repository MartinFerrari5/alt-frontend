import { useEffect, useCallback, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import useAuthStore from "../../store/authStore"
import { useOptionsStore } from "../../store/optionsStore"
import Dropdown from "../Dropdown/Dropdown"
import { getCompanyProjects } from "../../hooks/data/options/options"

const TaskFilter = ({ onFilter, currentPath }) => {
    const role = useAuthStore((state) => state.role)
    const [searchParams] = useSearchParams()
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

    useEffect(() => {
        fetchOptions("companies_table")
        fetchOptions("projects_table")
        fetchOptions("hour_type_table")
    }, [fetchOptions])

    // Sincronizar los valores del formulario con los parámetros de la URL
    const getUrlFilterValues = useCallback(() => {
        const fullname = searchParams.get("fullname") || ""
        const company = searchParams.get("company") || ""
        const project = searchParams.get("project") || ""
        const status = searchParams.get("status") || ""
        const hourtype = searchParams.get("hourtype") || ""
        const urlDate = searchParams.get("date") || ""
        let startDate = ""
        let endDate = ""
        if (urlDate) {
            const dates = urlDate.split(" ")
            if (dates.length === 2) {
                startDate = dates[0]
                endDate = dates[1]
            } else {
                startDate = urlDate
            }
        }
        return {
            fullname,
            company,
            project,
            status,
            startDate,
            endDate,
            hourtype,
        }
    }, [searchParams])

    useEffect(() => {
        const filters = getUrlFilterValues()
        Object.entries(filters).forEach(([key, value]) => {
            setValue(key, value)
        })
    }, [searchParams, setValue, getUrlFilterValues])

    // Observar el valor seleccionado en el dropdown de compañía.
    // Se espera que el valor de "company" sea el relationship_id
    const selectedCompany = watch("company")
    useEffect(() => {
        if (selectedCompany) {
            getCompanyProjects(selectedCompany)
                .then((projects) => {
                    setFilteredProjects(projects)
                    // Opcional: si se desea asignar el primer proyecto obtenido por defecto
                    if (projects.length > 0) {
                        setValue("project", projects[0].option)
                    } else {
                        setValue("project", "")
                    }
                })
                .catch((error) => {
                    toast.error(error.message)
                })
        } else {
            setFilteredProjects([])
            setValue("project", "")
        }
    }, [selectedCompany, setValue])

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
            date: dateRange,
            status,
            hourtype,
        })
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-1 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
            {role === "admin" && (
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    {...register("fullname")}
                    className="w-full rounded-lg border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}
            <Dropdown
                id="company"
                label="Empresa"
                register={register}
                error={errors.company}
                isLoading={!companies_table || companies_table.length === 0}
                isError={false}
                items={companies_table}
                loadingText="Cargando empresas..."
                errorText="Error cargando empresas"
                useRelationshipId={true} // Se usará relationship_id como valor
            />
            <Dropdown
                id="project"
                label="Proyecto"
                register={register}
                error={errors.project}
                // Se utiliza el estado local con los proyectos filtrados por la compañía seleccionada
                isLoading={!filteredProjects || filteredProjects.length === 0}
                isError={false}
                items={filteredProjects}
                loadingText="Cargando proyectos..."
                errorText="Error cargando proyectos"
            />
            {/* Dropdown para "Tipo de Hora" */}
            <Dropdown
                id="hourtype"
                label="Tipo de Hora"
                register={register}
                error={errors.hourtype}
                isLoading={!hour_type_table || hour_type_table.length === 0}
                isError={false}
                items={hour_type_table}
                loadingText="Cargando tipos de hora..."
                errorText="Error cargando tipos de hora"
            />
            {currentPath === "/history" && (
                <select
                    {...register("status")}
                    className="w-full rounded-lg border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Seleccionar estado</option>
                    <option value="0">En Progreso</option>
                    <option value="1">Enviado a RRHH</option>
                    <option value="2">Finalizado</option>
                </select>
            )}
            <input
                type="date"
                {...register("startDate")}
                className="w-full rounded-lg border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="date"
                {...register("endDate")}
                className="w-full rounded-lg border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Filtrar
            </button>
        </form>
    )
}

export default TaskFilter
