// /src/components/Tasks/AddTaskDialog.jsx
import "./AddTaskDialog.css"
import PropTypes from "prop-types"
import { useRef, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CSSTransition } from "react-transition-group"
// Se elimina la importación de SweetAlert2, ya que se usará alerta inline

import { LoaderIcon } from "../../assets/icons"
import { useAddTask } from "../../hooks/data/task/use-add-task"
import { useGetOptions } from "../../hooks/data/options/use-get-options"
import { useOptionsStore } from "../../store/optionsStore"
import Button from "../Button"
import Input from "../Input"
import DatePicker from "./DatePicker"
import { statusMap } from "../../util/taskConstants"
import { schema } from "../../util/validationSchema"

/**
 * Componente de alerta inline usando el modelo proporcionado.
 * Se muestran diferentes estilos según el "type":
 * - "success": alerta de éxito (verde)
 * - "danger": alerta de error (rojo)
 * - Por defecto, se puede usar "info" (azul)
 */
const Alert = ({ type, message, onClose }) => {
    let classes = ""
    let title = ""
    if (type === "success") {
        classes =
            "flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
        title = "¡Tarea creada con éxito!"
    } else if (type === "danger") {
        classes =
            "flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
        title = "Error"
    } else {
        classes =
            "flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
        title = "Info"
    }
    return (
        <div className={classes} role="alert">
            <svg
                className="mr-3 inline h-4 w-4 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <div className="flex-1">
                <span className="font-medium">{title}</span> {message}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="ml-3 text-sm font-bold text-gray-500 hover:text-gray-900"
                    aria-label="Close"
                >
                    &times;
                </button>
            )}
        </div>
    )
}

Alert.propTypes = {
    type: PropTypes.oneOf(["success", "danger", "info"]).isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func,
}

const AddTaskDialog = ({ isOpen, handleClose }) => {
    // Hook para agregar la tarea
    const { mutate: addTask, isPending: isAddingTask } = useAddTask()
    const nodeRef = useRef(null)

    // Estado para la fecha de la tarea (se inicializa a hoy a medianoche)
    const [taskDate, setTaskDate] = useState(() => {
        const initialDate = new Date()
        initialDate.setHours(0, 0, 0, 0)
        return initialDate
    })

    // Estado para la alerta inline
    const [alert, setAlert] = useState(null)

    // Disparar fetch de opciones para actualizar el store de Zustand
    useGetOptions("companies_table", "companies")
    useGetOptions("hour_type_table", "hourTypes")
    useGetOptions("projects_table", "projects")

    // Obtener datos del store
    const companies = useOptionsStore((state) => state.companies) || []
    const hourTypes = useOptionsStore((state) => state.hourTypes) || []
    const projects = useOptionsStore((state) => state.projects) || []

    // Estados de carga y error para cada opción
    const { isLoading: isLoadingCompanies, isError: isErrorCompanies } =
        useGetOptions("companies_table", "companies")
    const { isLoading: isLoadingHourTypes, isError: isErrorHourTypes } =
        useGetOptions("hour_type_table", "hourTypes")
    const { isLoading: isLoadingProjects, isError: isErrorProjects } =
        useGetOptions("projects_table", "projects")

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

    // Actualizar valores por defecto en el formulario cuando se carguen las opciones
    useEffect(() => {
        const currentCompany = watch("company")
        if (companies.length > 0 && !currentCompany) {
            reset({ ...watch(), company: companies[0] })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companies])

    useEffect(() => {
        const currentProject = watch("project")
        if (projects.length > 0 && !currentProject) {
            reset({ ...watch(), project: projects[0] })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projects])

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
                // Mostrar alerta de éxito y auto-cerrar el diálogo después de 3 segundos
                setAlert({
                    type: "success",
                    message: "Puedes seguir agregando más tareas.",
                })
                setTimeout(() => {
                    setAlert(null)
                    handleClose()
                }, 3000)
            },
            onError: (error) => {
                // Mostrar alerta de error
                setAlert({
                    type: "danger",
                    message:
                        error.response?.data?.message ||
                        "No se pudo agregar la tarea",
                })
            },
        })
    }

    // Función auxiliar para renderizar las opciones de un <select>
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
                        <div className="relative w-full max-w-lg rounded-xl bg-white shadow-sm">
                            <div className="flex items-center justify-center rounded-t border-b p-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Nueva Tarea
                                </h3>
                            </div>
                            <div className="p-4">
                                {/* Se muestra la alerta si existe */}
                                {alert && (
                                    <Alert
                                        type={alert.type}
                                        message={alert.message}
                                        onClose={() => setAlert(null)}
                                    />
                                )}
                                <form onSubmit={handleSubmit(handleSaveClick)}>
                                    <div className="mb-6 grid grid-cols-2 gap-4">
                                        {/* Company Dropdown */}
                                        <div className="mb-6 grid grid-cols-2 gap-4">
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

                                    {/* Acciones del formulario */}
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
                                            disabled={
                                                isSubmitting || isAddingTask
                                            }
                                        >
                                            {(isSubmitting || isAddingTask) && (
                                                <LoaderIcon className="mr-2 animate-spin" />
                                            )}
                                            Guardar y Continuar
                                        </Button>
                                    </div>
                                </form>
                            </div>
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
