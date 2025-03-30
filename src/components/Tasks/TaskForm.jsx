// /src/components/Tasks/TaskForm.jsx
import { useEffect, useState } from "react"
import Input from "../Input"
import DatePicker from "./DatePicker"
import Button from "../Button"
import Dropdown from "../Dropdown/Dropdown"

import { toast } from "react-toastify"
import { getCompanyProjects } from "../../hooks/data/options/optionsService"

const formatTimeForInput = (timeStr) => {
    if (!timeStr) return ""
    return timeStr.length > 5 ? timeStr.slice(0, 5) : timeStr
}

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
}) => {
    if (!task) return null

    const isLoadingCompanies = companies.length === 0
    const [filteredProjects, setFilteredProjects] = useState(projects)
    const isLoadingProjects = filteredProjects.length === 0
    const isLoadingHourTypes = hourTypes.length === 0

    const taskData = task || {}

    // Observar el valor seleccionado en el Dropdown de "Empresa"
    const selectedCompany = watch("company")
    useEffect(() => {
        if (selectedCompany) {
            getCompanyProjects(selectedCompany)
                .then((resp) => {
                    setFilteredProjects(resp)
                    // Aquí podrías actualizar el campo "project" si lo deseas
                })
                .catch((error) => {
                    toast.error(error.message)
                })
        } else {
            setFilteredProjects([])
        }
    }, [selectedCompany])
    if (!task) {
        return <p>No hay tarea para editar.</p>
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6 rounded-xl bg-brand-white p-6">
                {/* Dropdowns para Empresa, Proyecto y Tipo de Hora */}
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
                        useRelationshipId={true}
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
                    />
                </div>

                {/* Campo Tipo de Tarea */}
                <Input
                    id="task_type"
                    label="Tipo de Tarea"
                    {...register("task_type")}
                    defaultValue={taskData.task_type}
                    errorMessage={errors.task_type?.message}
                />

                {/* Campo Descripción */}
                <Input
                    id="task_description"
                    label="Descripción"
                    {...register("task_description")}
                    defaultValue={taskData.task_description}
                    errorMessage={errors.task_description?.message}
                />

                {/* Grid para DatePicker y horarios */}
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
                            defaultValue={formatTimeForInput(
                                taskData.entry_time
                            )}
                            errorMessage={errors.entry_time?.message}
                        />
                    </div>
                    <div className="group relative z-0 mb-5 w-full">
                        <Input
                            id="exit_time"
                            label="Hora de Salida"
                            type="time"
                            {...register("exit_time")}
                            defaultValue={formatTimeForInput(
                                taskData.exit_time
                            )}
                            errorMessage={errors.exit_time?.message}
                        />
                    </div>
                    <div className="group relative z-0 mb-5 w-full">
                        <Input
                            id="lunch_hours"
                            label="Horas de Almuerzo"
                            type="number"
                            {...register("lunch_hours")}
                            defaultValue={
                                taskData.lunch_hours?.toString() || "1"
                            }
                            errorMessage={errors.lunch_hours?.message}
                        />
                    </div>
                </div>
                <div className="mt-4 flex w-full justify-end gap-3">
                    <Button
                        size="large"
                        color="primary"
                        disabled={isSubmitting}
                        type="submit"
                    >
                        {isSubmitting && (
                            <span className="animate-spin">⏳</span>
                        )}{" "}
                        Guardar
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default TaskForm
