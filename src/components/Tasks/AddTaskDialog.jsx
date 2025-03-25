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
import { getCompanyProjects } from "../../hooks/data/options/options"

const AddTaskDialog = ({ isOpen, handleClose }) => {
    const nodeRef = useRef(null)
    const { addTaskMutation } = useTasks()
    const isAddingTask = addTaskMutation.isLoading

    // Estado para la fecha de la tarea
    const [taskDate, setTaskDate] = useState(() => {
        const initialDate = new Date()
        initialDate.setHours(0, 0, 0, 0)
        return initialDate
    })

    // Estado local para proyectos filtrados por compañía
    const [filteredProjects, setFilteredProjects] = useState([])

    // Obtener las opciones del store
    const { companies_table, hour_type_table, types_table, fetchOptions } =
        useOptionsStore()

    useEffect(() => {
        fetchOptions("companies_table")
        fetchOptions("hour_type_table")
        fetchOptions("projects_table")
        fetchOptions("types_table")
    }, [fetchOptions])

    // Flags de carga para cada select
    const isLoadingCompanies = !companies_table || companies_table.length === 0
    const isLoadingHourTypes = !hour_type_table || hour_type_table.length === 0
    // Para proyectos usaremos el estado filtrado
    const isLoadingProjects = !filteredProjects || filteredProjects.length === 0
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
            lunch_hours: "2",
            status: "progreso",
        },
    })

    // Asignar valores por defecto a los selects cuando carguen las opciones
    useEffect(() => {
        reset({
            ...watch(),
            company:
                companies_table && companies_table.length > 0
                    ? companies_table[0].relationship_id // se usa el relationship_id
                    : "",
            // Se deja project vacío hasta obtener los proyectos filtrados
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

    // Observar el cambio en la compañía seleccionada (valor = relationship_id)
    const selectedCompany = watch("company")
    useEffect(() => {
        if (selectedCompany) {
            getCompanyProjects(selectedCompany)
                .then((projects) => {
                    setFilteredProjects(projects)
                    if (projects.length > 0) {
                        reset({
                            ...watch(),
                            project: projects[0].option,
                        })
                    } else {
                        reset({
                            ...watch(),
                            project: "",
                        })
                    }
                })
                .catch((error) => {
                    toast.error(error.message)
                })
        } else {
            // Si no se ha seleccionado compañía, limpiar proyectos filtrados
            setFilteredProjects([])
            reset({
                ...watch(),
                project: "",
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCompany])

    const formatDateForBackend = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day} 00:00:00`
    }

    // Función que resetea el formulario conservando los valores de los dropdowns
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
            entry_time: "09:00",
            exit_time: "18:00",
            lunch_hours: "2",
        })
        // Reiniciar la fecha a la fecha actual
        setTaskDate(() => {
            const initialDate = new Date()
            initialDate.setHours(0, 0, 0, 0)
            return initialDate
        })
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
                                                items={hour_type_table}
                                                loadingText="Cargando tipos de hora..."
                                                errorText="Error cargando tipos de hora"
                                            />
                                        </div>

                                        <Dropdown
                                            id="task_type"
                                            label="Tipo de Tarea"
                                            register={register}
                                            error={errors.task_type?.message}
                                            isLoading={isLoadingTypesTable}
                                            isError={false}
                                            items={
                                                Array.isArray(types_table)
                                                    ? types_table
                                                    : []
                                            }
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
                                                    min="0.1"
                                                    max="4"
                                                    step="0.1"
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
