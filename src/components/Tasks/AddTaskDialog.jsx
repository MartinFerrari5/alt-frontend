// src/components/Tasks/AddTaskDialog.jsx
import "./AddTaskDialog.css"
import PropTypes from "prop-types"
import { useRef, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CSSTransition } from "react-transition-group"
import { LoaderIcon } from "../../assets/icons"
import Button from "../Button"
import Input from "../Input"
import DatePicker from "./DatePicker"
import { statusMap } from "../../util/taskConstants"
import { schema } from "../../util/validationSchema"
import Dropdown from "../Dropdown/Dropdown"
import { useOptionsStore } from "../../store/optionsStore"
import { toast } from "react-toastify"
import { useTasks } from "../../hooks/data/task/useTasks"

const AddTaskDialog = ({ isOpen, handleClose }) => {
    const nodeRef = useRef(null)
    const { addTaskMutation } = useTasks()
    const isAddingTask = addTaskMutation.isLoading

    const [taskDate, setTaskDate] = useState(() => {
        const initialDate = new Date()
        initialDate.setHours(0, 0, 0, 0)
        return initialDate
    })

    // Obtener las opciones del store de opciones
    const {
        companies_table,
        hour_type_table,
        projects_table,
        types_table,
        fetchOptions,
    } = useOptionsStore()

    useEffect(() => {
        fetchOptions("companies_table")
        fetchOptions("hour_type_table")
        fetchOptions("projects_table")
        fetchOptions("types_table")
    }, [fetchOptions])

    const isLoadingCompanies = !companies_table || companies_table.length === 0
    const isLoadingHourTypes = !hour_type_table || hour_type_table.length === 0
    const isLoadingProjects = !projects_table || projects_table.length === 0
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
            entry_time: "09:00",
            exit_time: "18:00",
            lunch_hours: "1",
            status: "progreso",
        },
    })

    // Asignar el primer elemento de cada lista a su respectivo select al cargar las opciones
    useEffect(() => {
        reset({
            ...watch(),
            company:
                companies_table && companies_table.length > 0
                    ? companies_table[0].company
                    : "",
            project:
                projects_table && projects_table.length > 0
                    ? projects_table[0].project
                    : "",
            hour_type:
                hour_type_table && hour_type_table.length > 0
                    ? hour_type_table[0].hour_type
                    : "",
            task_type:
                types_table && types_table.length > 0
                    ? types_table[0].option
                    : "",
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companies_table, projects_table, hour_type_table, types_table, reset])

    const formatDateForBackend = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day} 00:00:00`
    }

    const handleSaveClick = (data) => {
        const formattedDate = formatDateForBackend(taskDate)
        const taskPayload = {
            ...data,
            task_description: data.task_description.trim(),
            lunch_hours: data.lunch_hours.toString(),
            status: statusMap[data.status],
            task_date: formattedDate,
        }

        // Llamada a la mutación para agregar la tarea (actualización optimista incluida)
        addTaskMutation.mutate(taskPayload, {
            onSuccess: () => {
                toast.success(
                    "Tarea guardada. Puedes seguir agregando más tareas.",
                    {
                        autoClose: 3000,
                    }
                )
                reset()
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
                                <form onSubmit={handleSubmit(handleSaveClick)}>
                                    <div className="mx-auto max-w-md">
                                        <div className="grid md:grid-cols-2 md:gap-6">
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
                                            <Dropdown
                                                id="hour_type"
                                                label="Tipo de Hora"
                                                register={register}
                                                error={errors.hour_type}
                                                isLoading={isLoadingHourTypes}
                                                isError={false}
                                                items={hour_type_table}
                                                loadingText="Cargando tipos de hora..."
                                                errorText="Error cargando tipos de hora"
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

                                        {/* Sección para Tipo de Tarea */}
                                        <Dropdown
                                            id="task_type"
                                            label="Tipo de Tarea"
                                            register={register}
                                            error={errors.task_type?.message}
                                            isLoading={isLoadingTypesTable}
                                            isError={false}
                                            items={types_table}
                                            loadingText="Cargando tipos de Tarea..."
                                            errorText="Error cargando tipos de tarea"
                                        />

                                        <Input
                                            id="task_description"
                                            label="Descripción"
                                            {...register("task_description")}
                                            errorMessage={
                                                errors.task_description?.message
                                            }
                                        />

                                        <div className="grid md:grid-cols-2 md:gap-6">
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
                                                    errorMessage={
                                                        errors.entry_time
                                                            ?.message
                                                    }
                                                />
                                            </div>
                                            <div className="group relative z-0 mb-5 w-full">
                                                <Input
                                                    id="exit_time"
                                                    label="Hora de Salida"
                                                    type="time"
                                                    {...register("exit_time")}
                                                    errorMessage={
                                                        errors.exit_time
                                                            ?.message
                                                    }
                                                />
                                            </div>
                                            <div className="group relative z-0 mb-5 w-full">
                                                <Input
                                                    id="lunch_hours"
                                                    label="Horas de Almuerzo"
                                                    type="number"
                                                    {...register("lunch_hours")}
                                                    errorMessage={
                                                        errors.lunch_hours
                                                            ?.message
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

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
