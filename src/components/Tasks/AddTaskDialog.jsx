// /src/components/Tasks/AddTaskDialog.jsx

import "./AddTaskDialog.css"
import PropTypes from "prop-types"
import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CSSTransition } from "react-transition-group"
import Swal from "sweetalert2"

import { LoaderIcon } from "../../assets/icons"
import { useAddTask } from "../../hooks/data/task/use-add-task"
import { useGetCompanies } from "../../hooks/data/use-get-companies"
import Button from "../Button"
import Input from "../Input"
import DatePicker from "./DatePicker"
import { statusMap } from "../../util/taskConstants"
import { schema } from "../../util/validationSchema"
import { useGetHourTypes } from "../../hooks/data/use-get-typeHour"

const AddTaskDialog = ({ isOpen, handleClose }) => {
    const { mutate: addTask } = useAddTask()
    const { data: companies = [], isLoading } = useGetCompanies()
    const { data: hourTypes = [], isLoading: isLoadingHourTypes } =
        useGetHourTypes()
    const nodeRef = useRef()
    const [taskDate, setTaskDate] = useState(new Date())

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            company: "",
            project: "Website Redesign",
            task_type: "Development",
            task_description: "",
            entry_time: "09:00",
            exit_time: "18:00",
            lunch_hours: "1",
            hour_type: hourTypes[0],
            status: "Not Started",
        },
    })

    const formatDateForBackend = (date) => {
        return date.toISOString().split("T")[0].replace(/-/g, "")
    }

    const handleSaveClick = async (data) => {
        const formattedDate =
            taskDate instanceof Date
                ? formatDateForBackend(taskDate)
                : formatDateForBackend(new Date())

        const taskPayload = {
            ...data,
            task_description: data.task_description.trim(),
            lunch_hours: data.lunch_hours.toString(),
            status: statusMap[data.status],
            task_date: formattedDate,
            hour_type: data.hour_type,
        }

        addTask(taskPayload, {
            onSuccess: () => {
                Swal.fire({
                    title: "¡Tarea creada con éxito!",
                    text: "Puedes seguir agregando más tareas.",
                    icon: "success",
                    confirmButtonText: "OK",
                })
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
                                className="p-4 md:p-5"
                            >
                                <div className="mb-4 grid grid-cols-2 gap-4">
                                    <label>Empresa</label>
                                    <select
                                        {...register("company")}
                                        className="form-select focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                                    >
                                        {isLoading ? (
                                            <option>Cargando...</option>
                                        ) : (
                                            companies.map((company, index) => (
                                                <option
                                                    key={index}
                                                    value={company}
                                                >
                                                    {company}
                                                </option>
                                            ))
                                        )}
                                    </select>

                                    {errors.company && (
                                        <p className="error">
                                            {errors.company.message}
                                        </p>
                                    )}
                                    <Input
                                        id="project"
                                        label="Proyecto"
                                        {...register("project")}
                                        error={errors.project}
                                    />
                                    <Input
                                        id="task_type"
                                        label="Tipo de Tarea"
                                        {...register("task_type")}
                                        error={errors.task_type}
                                    />
                                    <Input
                                        id="task_description"
                                        label="Descripción"
                                        {...register("task_description")}
                                        error={errors.task_description}
                                    />
                                    <DatePicker
                                        value={taskDate}
                                        onChange={setTaskDate}
                                    />
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
                                    <Input
                                        id="lunch_hours"
                                        label="Horas de Almuerzo"
                                        type="number"
                                        {...register("lunch_hours")}
                                        error={errors.lunch_hours}
                                    />
                                    <label>Tipo de Hora</label>
                                    <select
                                        {...register("hour_type")}
                                        className="form-select"
                                    >
                                        {isLoadingHourTypes ? (
                                            <option>Cargando...</option>
                                        ) : (
                                            hourTypes.map((typeHora, index) => (
                                                <option
                                                    key={index}
                                                    value={typeHora}
                                                >
                                                    {typeHora}
                                                </option>
                                            ))
                                        )}
                                    </select>

                                    <label>Estado</label>
                                    <select
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
                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            color="secondary"
                                            onClick={handleClose}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting && (
                                                <LoaderIcon className="animate-spin" />
                                            )}{" "}
                                            Guardar y Continuar
                                        </Button>
                                    </div>
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
