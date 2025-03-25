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
    // Estado para almacenar la lista de proyectos relacionados según la compañía seleccionada
    const [filteredProjects, setFilteredProjects] = useState([])

    // Al montar el componente, cargar las opciones necesarias
    useEffect(() => {
        fetchOptions("companies_table")
        fetchOptions("projects_table")
        fetchOptions("hour_type_table")
    }, [fetchOptions])

    // Función para extraer los filtros de la URL
    const getUrlFilterValues = useCallback(() => {
        const fullname = searchParams.get("fullname") || ""
        const company = searchParams.get("company") || ""
        const project = searchParams.get("project") || ""
        const status = searchParams.get("status") || ""
        const hourtype = searchParams.get("hourtype") || ""
        const urlDate = searchParams.get("date") || ""

        let startDate = ""
        let endDate = ""
        // Se usa el separador '+' porque la URL se arma de esa forma
        if (urlDate) {
            const dates = urlDate.split("+")
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

    // Sincronizar el formulario con los parámetros de la URL
    useEffect(() => {
        const filters = getUrlFilterValues()
        Object.entries(filters).forEach(([key, value]) => {
            setValue(key, value)
        })
    }, [searchParams, setValue, getUrlFilterValues])

    // Observar el valor de "company" para actualizar los proyectos relacionados.
    // Se espera que el valor de "company" sea el relationship_id, gracias a la prop "useRelationshipId" en el Dropdown.
    const selectedCompany = watch("company")
    console.log("Selected Company:", selectedCompany)
    useEffect(() => {
        console.log("Selected Company:", selectedCompany)
        if (selectedCompany) {
            getCompanyProjects(selectedCompany)
                .then((projects) => {
                    setFilteredProjects(projects)
                    // Si hay proyectos, asigna el primer valor por defecto en el campo "project"
                    setValue(
                        "project",
                        projects.length > 0 ? projects[0].option : ""
                    )
                })
                .catch((error) => toast.error(error.message))
        } else {
            setFilteredProjects([])
            setValue("project", "")
        }
    }, [selectedCompany, setValue])

    // Función de envío del formulario
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
        // Se usa el signo '+' como separador para la fecha
        const dateRange =
            startDate && endDate ? `${startDate}+${endDate}` : startDate || ""
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
                isLoading={!filteredProjects || filteredProjects.length === 0}
                isError={false}
                items={filteredProjects}
                loadingText="Cargando proyectos..."
                errorText="Error cargando proyectos"
            />
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
