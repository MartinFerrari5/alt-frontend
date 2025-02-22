// src/components/Tasks/TaskFilter.jsx
import { useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import useAuthStore from "../../store/authStore"
import { useOptionsStore } from "../../store/optionsStore"
import Dropdown from "../Dropdown/Dropdown"
import { statusMap } from "../../util/taskConstants"

const TaskFilter = ({ onFilter }) => {
    const role = useAuthStore((state) => state.role)
    const [searchParams, setSearchParams] = useSearchParams()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullname: "",
            company: "",
            project: "",
            status: "",
            startDate: "",
            endDate: "",
        },
    })

    const { companies_table, projects_table, fetchOptions } = useOptionsStore()

    useEffect(() => {
        fetchOptions("companies_table")
        fetchOptions("projects_table")
    }, [fetchOptions])

    const isLoadingCompanies = !companies_table || companies_table.length === 0
    const isLoadingProjects = !projects_table || projects_table.length === 0

    // Helper para extraer los valores de filtro desde la URL
    const getUrlFilterValues = useCallback(() => {
        const fullname = searchParams.get("fullname") || ""
        const company = searchParams.get("company") || ""
        const project = searchParams.get("project") || ""
        const status = searchParams.get("status") || ""
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
        return { fullname, company, project, status, startDate, endDate }
    }, [searchParams])

    // Sincronizamos el formulario con los parámetros de la URL
    useEffect(() => {
        const filters = getUrlFilterValues()
        Object.entries(filters).forEach(([key, value]) => {
            setValue(key, value)
        })
    }, [searchParams, setValue, getUrlFilterValues])

    const onSubmit = (data) => {
        const { fullname, company, project, status, startDate, endDate } = data
        const dateRange =
            startDate && endDate ? `${startDate} ${endDate}` : startDate || ""
        const params = {
            ...(fullname && { fullname }),
            ...(company && { company }),
            ...(project && { project }),
            ...(status && { status }),
            ...(dateRange && { date: dateRange }),
        }
        setSearchParams(params)
        onFilter({ fullname, company, project, date: dateRange, status })
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
            {role === "admin" && (
                <>
                    <input
                        type="text"
                        placeholder="Buscar por nombre"
                        {...register("fullname")}
                        className="w-full rounded-lg border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="group relative z-0 mb-5 w-full">
                        <label
                            htmlFor="status"
                            className="mb-2 block text-sm font-medium"
                        >
                            Estado
                        </label>
                        <select
                            id="status"
                            {...register("status")}
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0"
                        >
                            <option value="">Seleccione un estado</option>
                            {Object.keys(statusMap).map((key) => (
                                <option key={key} value={key}>
                                    {statusMap[key]}
                                </option>
                            ))}
                        </select>
                        {errors.status && (
                            <p className="text-sm text-red-500">
                                {errors.status.message}
                            </p>
                        )}
                    </div>
                </>
            )}
            <Dropdown
                id="company"
                label="Empresa"
                register={register}
                error={errors.company}
                isLoading={isLoadingCompanies}
                isError={false}
                items={companies_table}
                loadingText="Cargando empresas..."
                errorText="Error cargando empresas"
            />
            <Dropdown
                id="project"
                label="Proyecto"
                register={register}
                error={errors.project}
                isLoading={isLoadingProjects}
                isError={false}
                items={projects_table}
                loadingText="Cargando proyectos..."
                errorText="Error cargando proyectos"
            />
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
