// /src/components/Tasks/AddTaskForm.jsx
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { LoaderIcon } from "../../assets/icons"
import { useTasks } from "../../hooks/data/task/useTasks"
import { useOptionsStore } from "../../store/optionsStore"

import Dropdown from "../Dropdown/Dropdown"
import DatePicker from "./DatePicker"
import Input from "../Input"
import Button from "../Button"
import { schema } from "../../util/validationSchema"
import { statusMap } from "../../util/taskConstants"
import { getCompanyProjects } from "../../hooks/data/options/optionsService"

const AddTaskForm = ({ onClose }) => {
    const { addTaskMutation } = useTasks()
    const isAddingTask = addTaskMutation.isLoading

    // Fecha inicial (solo fecha sin hora)
    const [taskDate, setTaskDate] = useState(() => {
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        return date
    })

    // Proyectos filtrados según la compañía seleccionada
    const [filteredProjects, setFilteredProjects] = useState([])

    // Opciones desde el store
    const { companies_table, hour_type_table, types_table, fetchOptions } =
        useOptionsStore()

    useEffect(() => {
        fetchOptions("companies_table")
        fetchOptions("hour_type_table")
        fetchOptions("projects_table")
        fetchOptions("types_table")
    }, [fetchOptions])

    // Flags de carga
    const isLoadingCompanies = !companies_table || companies_table.length === 0
    const isLoadingHourTypes = !hour_type_table || hour_type_table.length === 0
    const isLoadingProjects = filteredProjects.length === 0
    const isLoadingTypesTable = !types_table || types_table.length === 0

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            company: "",
            project: "",
            task_type: "",
            hour_type: "",
            task_description: "Tarea de prueba",
            entry_time: "10:30",
            exit_time: "12:30",
            lunch_hours: "2",
            status: "progreso",
        },
    })

    // Asignar valores por defecto a los selects cuando se cargan las opciones
    useEffect(() => {
        reset({
            ...watch(),
            company:
                companies_table && companies_table.length > 0
                    ? companies_table[0].relationship_id
                    : "",
            project: "",
            hour_type:
                hour_type_table && hour_type_table.length > 0
                    ? hour_type_table[0].hour_type
                    : "",
            task_type:
                types_table && types_table.length > 0
                    ? types_table[0].type
                    : "",
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companies_table, hour_type_table, types_table])

    // Actualiza los proyectos al cambiar la compañía
    const selectedCompany = watch("company")
    useEffect(() => {
        if (selectedCompany) {
            getCompanyProjects(selectedCompany)
                .then((projects) => {
                    setFilteredProjects(projects)
                    reset({
                        ...watch(),
                        project:
                            projects.length > 0 ? projects[0].project_id : "",
                    })
                })
                .catch((error) => toast.error(error.message))
        } else {
            setFilteredProjects([])
            reset({ ...watch(), project: "" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCompany])

    const formatDateForBackend = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
    }

    const resetForm = () => {
        const currentValues = {
            company: watch("company"),
            project: watch("project"),
            hour_type: watch("hour_type"),
            task_type: watch("task_type"),
            status: watch("status"),
        }
        reset({
            ...currentValues,
            task_description: "Tarea de prueba",
            entry_time: "",
            exit_time: "",
            lunch_hours: "2",
        })
        const newDate = new Date()
        newDate.setHours(0, 0, 0, 0)
        setTaskDate(newDate)
    }

    const handleSaveClick = (data) => {
        const formattedDate = formatDateForBackend(taskDate)
        const { company, project, ...rest } = data
        const taskPayload = {
            ...rest,
            company_id: company,
            project_id: project,
            task_description: data.task_description.trim(),
            lunch_hours: parseFloat(data.lunch_hours),
            status: statusMap[data.status] || false,
            task_date: formattedDate,
        }

        addTaskMutation.mutate(taskPayload, {
            onSuccess: () => {
                toast.success(
                    "Tarea guardada. Puedes seguir agregando más tareas.",
                    { autoClose: 3000 }
                )
                resetForm()
            },
            onError: (error) => {
                toast.error(
                    error.response?.data?.message ||
                        "No se pudo agregar la tarea",
                    { autoClose: 5000 }
                )
            },
        })
    }

    return (
        <form onSubmit={handleSubmit(handleSaveClick)}>
            <div className="mx-auto grid max-w-md gap-6">
                <div className="grid md:grid-cols-2 md:gap-6">
                    <Dropdown
                        id="company"
                        label="Empresa"
                        register={register}
                        error={errors.company}
                        isLoading={isLoadingCompanies}
                        isError={false}
                        items={companies_table}
                        valueKey="id"
                    />
                    <Dropdown
                        id="project"
                        label="Proyecto"
                        register={register}
                        error={errors.project}
                        isLoading={isLoadingProjects}
                        isError={false}
                        items={filteredProjects}
                        valueKey="id"
                    />
                    <Dropdown
                        id="hour_type"
                        label="Tipo de Hora"
                        register={register}
                        error={errors.hour_type}
                        isLoading={isLoadingHourTypes}
                        isError={false}
                        items={hour_type_table}
                        valueKey="hour_type"
                    />
                </div>
                <Dropdown
                    id="task_type"
                    label="Tipo de Tarea"
                    register={register}
                    error={errors.task_type?.message}
                    isLoading={isLoadingTypesTable}
                    isError={false}
                    items={types_table}
                    valueKey="type"
                />
                <Input
                    id="task_description"
                    label="Descripción"
                    {...register("task_description")}
                    errorMessage={errors.task_description?.message}
                />
                <div className="grid md:grid-cols-2 md:gap-6">
                    <DatePicker
                        value={taskDate}
                        onChange={setTaskDate}
                        className="group relative z-0 mb-5 w-full"
                    />
                    <Input
                        id="entry_time"
                        label="Hora de Entrada"
                        type="time"
                        {...register("entry_time")}
                        errorMessage={errors.entry_time?.message}
                    />
                    <Input
                        id="exit_time"
                        label="Hora de Salida"
                        type="time"
                        {...register("exit_time")}
                        errorMessage={errors.exit_time?.message}
                    />
                    <Input
                        id="lunch_hours"
                        label="Horas de Almuerzo"
                        type="number"
                        min="0.1"
                        max="4"
                        step="0.1"
                        {...register("lunch_hours")}
                        errorMessage={errors.lunch_hours?.message}
                    />
                </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
                <Button type="button" color="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting || isAddingTask}>
                    {(isSubmitting || isAddingTask) && (
                        <LoaderIcon className="mr-2 animate-spin" />
                    )}
                    Guardar y Continuar
                </Button>
            </div>
        </form>
    )
}

export default AddTaskForm
