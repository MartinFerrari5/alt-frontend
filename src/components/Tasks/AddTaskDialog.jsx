// /src/components/Tasks/AddTaskDialog.jsx
import "./AddTaskDialog.css"
import PropTypes from "prop-types"
import { useRef, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CSSTransition } from "react-transition-group"
import Swal from "sweetalert2"

import { LoaderIcon } from "../../assets/icons"
import { useAddTask } from "../../hooks/data/task/use-add-task"
import { useGetOptions } from "../../hooks/data/options/use-get-options"
import { useOptionsStore } from "../../store/optionsStore"
import Button from "../Button"
import Input from "../Input"
import DatePicker from "./DatePicker"
import { statusMap } from "../../util/taskConstants"
import { schema } from "../../util/validationSchema"

const AddTaskDialog = ({ isOpen, handleClose }) => {
    // Hook para agregar tarea
    const { mutate: addTask, isPending: isAddingTask } = useAddTask()
    const nodeRef = useRef(null)

    // Estado para la fecha de la tarea (se inicializa a hoy a medianoche)
    const [taskDate, setTaskDate] = useState(() => {
        const initialDate = new Date()
        initialDate.setHours(0, 0, 0, 0)
        return initialDate
    })

    // Disparar fetch de opciones (sin la barra inicial en el endpoint)
    useGetOptions("companies_table", "companies")
    useGetOptions("hour_type_table", "hourTypes")
    useGetOptions("projects_table", "projects")

    // Obtener data persistida del store de Zustand
    const companies = useOptionsStore((state) => state.companies) || []
    const hourTypes = useOptionsStore((state) => state.hourTypes) || []
    const projects = useOptionsStore((state) => state.projects) || []

    // Estados de carga y error para cada opción (provenientes del hook)
    const { isLoading: isLoadingCompanies, isError: isErrorCompanies } =
        useGetOptions("companies_table", "companies")
    const { isLoading: isLoadingHourTypes, isError: isErrorHourTypes } =
        useGetOptions("hour_type_table", "hourTypes")
    const { isLoading: isLoadingProjects, isError: isErrorProjects } =
        useGetOptions("projects_table", "projects")

    // Configuración de react-hook-form con validación vía Zod
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
            task_type: "Development",
            task_description: "",
            entry_time: "09:00",
            exit_time: "18:00",
            lunch_hours: "1",
            hour_type: "",
            status: "en progreso",
        },
    })

    // Actualizar valor por defecto para "company" cuando se carguen las empresas
    useEffect(() => {
        const currentCompany = watch("company")
        if (companies.length > 0 && !currentCompany) {
            reset({ ...watch(), company: companies[0] })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companies])

    // Actualizar valor por defecto para "project" cuando se carguen los proyectos
    useEffect(() => {
        const currentProject = watch("project")
        if (projects.length > 0 && !currentProject) {
            reset({ ...watch(), project: projects[0] })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projects])

    // Actualizar valor por defecto para "hour_type" cuando se carguen los tipos de hora
    useEffect(() => {
        const currentHourType = watch("hour_type")
        if (hourTypes.length > 0 && !currentHourType) {
            reset({ ...watch(), hour_type: hourTypes[0] })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hourTypes])

    // Función para formatear la fecha al formato requerido por el backend
    const formatDateForBackend = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day} 00:00:00`
    }

    // Función que se ejecuta al enviar el formulario
    const handleSaveClick = (data) => {
        const formattedDate = formatDateForBackend(taskDate)

        const taskPayload = {
            ...data,
            task_description: data.task_description.trim(),
            lunch_hours: data.lunch_hours.toString(),
            status: statusMap[data.status],
            task_date: formattedDate,
        }

        addTask(taskPayload, {
            onSuccess: () => {
                Swal.fire({
                    title: "¡Tarea creada con éxito!",
                    text: "Puedes seguir agregando más tareas.",
                    icon: "success",
                    confirmButtonText: "OK",
                })
                handleClose()
            },
            onError: (error) => {
                Swal.fire({
                    title: "Error",
                    text:
                        error.response?.data?.message ||
                        "No se pudo agregar la tarea",
                    icon: "error",
                    confirmButtonText: "OK",
                })
            },
        })
    }

    // Función auxiliar para renderizar las opciones de un select
    const renderOptions = (
        isLoading,
        isError,
        items,
        loadingText,
        errorText
    ) => {
        if (isLoading) {
            return <option>{loadingText}</option>
        }
        if (isError) {
            return <option className="text-red-500">{errorText}</option>
        }
        return items.map((item, index) => (
            <option key={index} value={item}>
                {item}
            </option>
        ))
    }

    return (
        <CSSTransition
            nodeRef={nodeRef}
            in={isOpen}
            timeout={500}
            classNames="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            unmountOnExit
        >
            <div className="relative max-h-full w-full max-w-md p-4">
                {createPortal(
                    <div
                        ref={nodeRef}
                        className="fixed inset-0 flex items-center justify-center backdrop-blur"
                    >
                        <div className="relative rounded-xl bg-white shadow-sm">
                            <div className="flex items-center justify-center rounded-t border-b border-gray-200 p-4 md:p-5 dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Nueva Tarea
                                </h3>
                            </div>
                            <form
                                onSubmit={handleSubmit(handleSaveClick)}
                                className="p-4"
                            >
                                <div className="mb-6 grid grid-cols-4 gap-4">
                                    {/* Company Dropdown */}
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="company"
                                            className="mb-1 block"
                                        >
                                            Empresa
                                        </label>
                                        <select
                                            id="company"
                                            {...register("company")}
                                            className="form-select"
                                            disabled={isLoadingCompanies}
                                        >
                                            {renderOptions(
                                                isLoadingCompanies,
                                                isErrorCompanies,
                                                companies,
                                                "Cargando empresas...",
                                                "Error cargando empresas"
                                            )}
                                        </select>
                                        {errors.company && (
                                            <p className="text-sm text-red-500">
                                                {errors.company.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Project Dropdown */}
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="project"
                                            className="mb-1 block"
                                        >
                                            Proyecto
                                        </label>
                                        <select
                                            id="project"
                                            {...register("project")}
                                            className="form-select"
                                            disabled={isLoadingProjects}
                                        >
                                            {renderOptions(
                                                isLoadingProjects,
                                                isErrorProjects,
                                                projects,
                                                "Cargando proyectos...",
                                                "Error cargando proyectos"
                                            )}
                                        </select>
                                        {errors.project && (
                                            <p className="text-sm text-red-500">
                                                {errors.project.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Task Type Input */}
                                    <Input
                                        id="task_type"
                                        label="Tipo de Tarea"
                                        {...register("task_type")}
                                        error={errors.task_type}
                                    />

                                    {/* Task Description Input */}
                                    <Input
                                        id="task_description"
                                        label="Descripción"
                                        {...register("task_description")}
                                        error={errors.task_description}
                                    />

                                    {/* Date Picker */}
                                    <DatePicker
                                        value={taskDate}
                                        onChange={setTaskDate}
                                        className="col-span-2"
                                    />

                                    {/* Time Inputs */}
                                    <Input
                                        id="entry_time"
                                        label="Hora de Entrada"
                                        type="time"
                                        {...register("entry_time")}
                                        error={errors.entry_time}
                                    />
                                    <Input
                                        id="exit_time"
                                        label="Hora de Salida"
                                        type="time"
                                        {...register("exit_time")}
                                        error={errors.exit_time}
                                    />

                                    {/* Lunch Hours Input */}
                                    <Input
                                        id="lunch_hours"
                                        label="Horas de Almuerzo"
                                        type="number"
                                        {...register("lunch_hours")}
                                        error={errors.lunch_hours}
                                    />

                                    {/* Hour Type Dropdown */}
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="hour_type"
                                            className="mb-1 block"
                                        >
                                            Tipo de Hora
                                        </label>
                                        <select
                                            id="hour_type"
                                            {...register("hour_type")}
                                            className="form-select"
                                            disabled={isLoadingHourTypes}
                                        >
                                            {renderOptions(
                                                isLoadingHourTypes,
                                                isErrorHourTypes,
                                                hourTypes,
                                                "Cargando tipos de hora...",
                                                "Error cargando tipos de hora"
                                            )}
                                        </select>
                                    </div>

                                    {/* Status Dropdown */}
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="status"
                                            className="mb-1 block"
                                        >
                                            Estado
                                        </label>
                                        <select
                                            id="status"
                                            {...register("status")}
                                            className="form-select"
                                        >
                                            {Object.keys(statusMap).map(
                                                (status) => (
                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        color="secondary"
                                        onClick={handleClose}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || isAddingTask}
                                    >
                                        {(isSubmitting || isAddingTask) && (
                                            <LoaderIcon className="mr-2 animate-spin" />
                                        )}
                                        Guardar y Continuar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </CSSTransition>
    )
}

AddTaskDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
}

export default AddTaskDialog
