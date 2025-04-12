// /src/components/Tasks/AddTaskForm.jsx
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { LoaderIcon } from "../../assets/icons"
import { useTasks } from "../../hooks/data/task/useTasks"
import { useOptionsStore } from "../../store/modules/optionsStore"
import TaskFormFields from "./TaskFormFields"
import Button from "../Button"
import { schema } from "../../util/validationSchema"
import { formatTaskDate, formatTime } from "../../util/date"
import { useCompanyProjects } from "../../hooks/Tasks/TaskFormFields"

/**
 * Formulario para agregar una tarea.
 *
 * @param {Function} onClose - Función para cerrar el formulario.
 */
const AddTaskForm = ({ onClose }) => {
    const { addTaskMutation } = useTasks()
    const isAddingTask = addTaskMutation.isLoading

    // Fecha inicial (solo fecha sin hora)
    const [taskDate, setTaskDate] = useState(() => {
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        return date
    })

    // Opciones desde el store
    const { companies_table, hour_type_table, types_table, fetchOptions } =
        useOptionsStore()

    useEffect(() => {
        fetchOptions("companies_table")
        fetchOptions("hour_type_table")
        fetchOptions("projects_table")
        fetchOptions("types_table")
    }, [fetchOptions])

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
            entry_time: "",
            exit_time: "",
            lunch_hours: "1",
            status: "progreso",
        },
    })

    // Asignar valores por defecto a los selects cuando se cargan las opciones.
    useEffect(() => {
        reset({
            ...watch(),
            company:
                companies_table && companies_table.length > 0
                    ? companies_table[0].company_id
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

    // Obtenemos la compañía seleccionada (valor = relationship_id)
    const selectedCompany = watch("company")

    // Hook para obtener los proyectos de la compañía seleccionada.
    const filteredProjects = useCompanyProjects(selectedCompany, reset, watch)

    /**
     * Resetea el formulario a valores por defecto.
     */
    const resetDateTimeFields = () => {
        // Obtiene todos los valores actuales del formulario
        const currentValues = watch()

        // Resetea el formulario manteniendo los valores actuales,
        // excepto los campos de tiempo que se establecen a vacío/default.
        reset({
            ...currentValues, // Mantiene todos los valores existentes
            entry_time: "", // Resetea hora de entrada
            exit_time: "", // Resetea hora de salida
            lunch_hours: "1", // Resetea horas de almuerzo (o a tu valor por defecto preferido)
            // No reseteamos task_description aquí, se mantiene el valor actual
        })

        // Resetea la fecha al día actual sin hora
        const newDate = new Date()
        newDate.setHours(0, 0, 0, 0)
        setTaskDate(newDate)
    }

    /**
     * Maneja el clic en el botón Cancelar.
     * Resetea los campos de fecha/hora y luego cierra.
     */
    const handleCancelClick = () => {
        resetDateTimeFields() // Resetea solo fecha y horas
        onClose() // Llama a la función original para cerrar
    }

    /**
     * Maneja el guardado de la tarea.
     *
     * @param {Object} data - Datos del formulario.
     */
    const handleSaveClick = (data) => {
        const formattedDate = formatTaskDate(taskDate)
        const selectedCompanyObj = companies_table.find(
            (comp) => comp.relationship_id === data.company
        )

        const taskPayload = {
            company_id: selectedCompanyObj
                ? selectedCompanyObj.company_id
                : data.company,
            project_id: data.project,
            task_type: data.task_type.trim(),
            task_description: data.task_description.trim(),
            entry_time: formatTime(data.entry_time),
            exit_time: formatTime(data.exit_time),
            hour_type: data.hour_type,
            lunch_hours: parseFloat(data.lunch_hours),
            status: "0", // Para creación, se envía status "0"
            task_date: formattedDate,
        }

        addTaskMutation.mutate(taskPayload, {
            onSuccess: () => {
                toast.success(
                    "Tarea guardada. Puedes seguir agregando más tareas."
                )
                resetDateTimeFields()
            },
            onError: (error) => {
                toast.error(
                    error.response?.data?.message ||
                        "No se pudo agregar la tarea"
                )
            },
        })
    }

    return (
        <form onSubmit={handleSubmit(handleSaveClick)} className="w-full">
            <TaskFormFields
                companies_table={companies_table}
                hour_type_table={hour_type_table}
                types_table={types_table}
                filteredProjects={filteredProjects}
                taskDate={taskDate}
                setTaskDate={setTaskDate}
                register={register}
                errors={errors}
            />
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    color="secondary"
                    variant="outline"
                    onClick={handleCancelClick}
                >
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
