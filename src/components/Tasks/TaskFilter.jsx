// /src/components/Tasks/TaskFilter.jsx
import { useEffect, useCallback, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import useAuthStore from "../../store/modules/authStore"
import Dropdown from "../Dropdown/Dropdown"
import Button from "../Button"
import { getCompanyProjects } from "../../hooks/data/options/optionsService"
import { useOptionsStore } from "../../store/modules/optionsStore"

/**
 * Componente para filtrar tareas. Permite seleccionar empresa, proyecto,
 * tipo de hora y rango de fechas para filtrar las tareas.
 *
 * @param {function} onFilter - Función que se llamará cuando se envíe el formulario.
 * @param {string} currentPath - Ruta actual en la que se encuentra el componente.
 * @returns {ReactElement}
 */
const TaskFilter = ({ onFilter, currentPath }) => {
    const user = useAuthStore((state) => state.user)
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

    const { companies_table, hour_type_table, fetchOptions, projects_table } =
        useOptionsStore()
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

    // Sincronizar el formulario con los parámetros de la URL
    useEffect(() => {
        const filters = getUrlFilterValues()
        Object.entries(filters).forEach(([key, value]) => {
            setValue(key, value)
        })
    }, [searchParams, setValue, getUrlFilterValues])

    // Actualizar los proyectos relacionados basado en la compañía seleccionada.
    // En este caso, el dropdown de empresa envía el company_id (por eso usamos valueKey="company_id").
    // Se busca en companies_table el objeto que corresponda para extraer el relationship_id y obtener los proyectos.
    const selectedCompanyId = watch("company")
    useEffect(() => {
        if (
            user.role !== "admin" &&
            selectedCompanyId &&
            companies_table &&
            companies_table.length > 0
        ) {
            // Buscar la compañía cuyo company_id sea igual al valor seleccionado.
            const companyObj = companies_table.find(
                (c) =>
                    c.company_id === selectedCompanyId ||
                    c.id === selectedCompanyId
            )

            if ((companyObj && companyObj.company_id) || companyObj.id) {
                getCompanyProjects(companyObj.company_id || "")
                    .then((projects) => {
                        setFilteredProjects(projects)
                        // Si el usuario aún no ha seleccionado un proyecto, asignar el primer proyecto (usando project_id)
                        // if (!watch("project")) {
                        //     setValue(
                        //         "project",
                        //         projects.length > 0
                        //             ? projects[0].project_id
                        //             : ""
                        //     )
                        // }
                    })
                    .catch((error) => toast.error(error.message))
            } else {
                setFilteredProjects([])
                setValue("project", "")
            }
        } else if (user.role === "admin") {
            // Si es administrador, no buscar proyectos relacionados
            setFilteredProjects([])
            setValue("project", "")
        }
    }, [user.role, selectedCompanyId, companies_table, setValue, watch])

    /**
     * Función que se encarga de procesar la búsqueda de tareas cuando se envía el formulario.
     *
     * @param {Object} data - Objeto con los valores del formulario.
     */
    const onSubmit = (data) => {
        const {
            fullname, // Nombre del usuario
            company, // ID de la compañía
            project, // ID del proyecto
            status, // ID del estado
            startDate, // Fecha de inicio
            endDate, // Fecha de fin
            hourtype, // Tipo de hora (morning, afternoon, evening)
        } = data

        // Se crea un string con la fecha de inicio y fin (si se ha proporcionado)
        const dateRange =
            startDate && endDate ? `${startDate} ${endDate}` : startDate || ""

        // Se llama a la función onFilter con los datos procesados
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
            {user.role === "admin" && (
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
                isLoading={
                    user.role === "admin"
                        ? !projects_table || projects_table.length === 0
                        : !filteredProjects || filteredProjects.length === 0
                }
                isError={false}
                items={
                    user.role === "admin"
                        ? Array.isArray(projects_table)
                            ? projects_table
                            : []
                        : Array.isArray(filteredProjects)
                          ? filteredProjects
                          : []
                }
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
                <div className="group relative z-0 mb-5 w-full">
                    <label className="mb-2 block text-sm font-medium">
                        Tipo de estado
                    </label>
                    <select
                        {...register("status")}
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-500 focus:border-green-300 focus:outline-none focus:ring-0"
                    >
                        <option value="">estado</option>
                        <option value="0">En Progreso</option>
                        <option value="1">Enviado a RRHH</option>
                        <option value="2">Finalizado</option>
                    </select>
                </div>
            )}
            <input
                type="date"
                {...register("startDate")}
                className="w-full rounded-lg border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <input
                type="date"
                {...register("endDate")}
                className="w-full rounded-lg border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
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
