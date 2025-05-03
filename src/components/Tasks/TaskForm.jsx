// src/components/Tasks/TaskForm.jsx
import { useEffect, useState } from "react"
import Input from "../Input"
import DatePicker from "./DatePicker"
import Button from "../Button"
import Dropdown from "../Dropdown/Dropdown"
import { toast } from "react-toastify"
import { getCompanyProjects } from "../../hooks/data/options/optionsService"
import { LoadingSpinner } from "../../util/LoadingSpinner"

/**
 * Formulario de tarea que inicializa la empresa y proyecto al recargar.
 */
const TaskForm = ({
    register,
    watch,
    errors,
    handleSubmit,
    isSubmitting,
    taskDate,
    setTaskDate,
    task,
    companies,
    projects,
    hourTypes,
    typesTable,
    reset,
    setValue,
}) => {
    const isLoadingCompanies = companies.length === 0
    const [filteredProjects, setFilteredProjects] = useState([])
    const isLoadingProjects = filteredProjects.length === 0
    const isLoadingHourTypes = hourTypes.length === 0
    const isLoadingTypes = typesTable.length === 0

    const selectedCompany = watch("company")

    useEffect(() => {
        if (task) {
            setValue("company", task.company_id)
            getCompanyProjects(task.company_id)
                .then((resp) => {
                    setFilteredProjects(resp)
                    reset({
                        ...watch(),
                        company: task.company_id,
                        project: task.project_id,
                        task_type: task.task_type,
                        hour_type: task.hour_type,
                    })
                })
                .catch((err) =>
                    toast.error(
                        "Error cargando proyectos iniciales: " + err.message
                    )
                )
        } else {
            setFilteredProjects(projects)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task])

    useEffect(() => {
        if (selectedCompany && (!task || selectedCompany !== task.company_id)) {
            getCompanyProjects(selectedCompany)
                .then((resp) => {
                    setFilteredProjects(resp)
                    reset({
                        ...watch(),
                        project: resp.length > 0 ? resp[0].project_id : "",
                    })
                })
                .catch((err) => toast.error(err.message))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCompany])

    if (!task) return null

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-brand-white space-y-6 rounded-xl p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Dropdown
                        id="company"
                        label="Empresa"
                        register={register}
                        error={errors.company}
                        isLoading={isLoadingCompanies}
                        isError={false}
                        items={companies}
                        loadingText="Cargando empresas..."
                        errorText="Error cargando empresas"
                        valueKey="company_id"
                    />
                    <Dropdown
                        id="project"
                        label="Proyecto"
                        register={register}
                        error={errors.project}
                        isLoading={isLoadingProjects}
                        isError={false}
                        items={filteredProjects}
                        loadingText="Cargando proyectos..."
                        errorText="Error cargando proyectos"
                        valueKey="project_id"
                    />
                    <Dropdown
                        id="hour_type"
                        label="Tipo de Hora"
                        register={register}
                        error={errors.hour_type}
                        isLoading={isLoadingHourTypes}
                        isError={false}
                        items={hourTypes}
                        loadingText="Cargando tipos de hora..."
                        errorText="Error cargando tipos de hora"
                        valueKey="type"
                    />
                    <Dropdown
                        id="task_type"
                        label="Tipo de Tarea"
                        register={register}
                        error={errors.task_type}
                        isLoading={isLoadingTypes}
                        isError={false}
                        items={typesTable}
                        loadingText="Cargando tipos de tarea..."
                        errorText="Error cargando tipos de tarea"
                        valueKey="type"
                    />
                </div>
                <div>
                    <textarea
                        id="task_description"
                        {...register("task_description")}
                        rows={3}
                        className="focus:ring-primary-600 focus:border-primary-600 block w-full resize-y rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                        placeholder="Descripción"
                        style={{ minHeight: "3rem" }}
                    />
                    {errors.task_description && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.task_description.message}
                        </p>
                    )}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <DatePicker
                        value={taskDate}
                        onChange={setTaskDate}
                        className="group relative z-0 mb-5 w-full"
                    />
                    <div className="group relative z-0 mb-5 w-full">
                        <Input
                            id="entry_time"
                            label="Hora de Entrada"
                            type="time"
                            {...register("entry_time")}
                            errorMessage={errors.entry_time?.message}
                        />
                    </div>
                    <div className="group relative z-0 mb-5 w-full">
                        <Input
                            id="exit_time"
                            label="Hora de Salida"
                            type="time"
                            {...register("exit_time")}
                            errorMessage={errors.exit_time?.message}
                        />
                    </div>
                    <div className="group relative z-0 mb-5 w-full">
                        <Input
                            id="lunch_hours"
                            label="Horas de Almuerzo"
                            type="number"
                            {...register("lunch_hours")}
                            errorMessage={errors.lunch_hours?.message}
                        />
                    </div>
                </div>
                <div className="mt-4 flex w-full justify-end gap-3">
                    <Button
                        color="primary"
                        disabled={isSubmitting}
                        type="submit"
                    >
                        {isSubmitting ? <LoadingSpinner /> : "Guardar"}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default TaskForm
