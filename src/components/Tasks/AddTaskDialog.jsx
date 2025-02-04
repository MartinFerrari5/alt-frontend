// // AddTaskDialog.jsx

import "./AddTaskDialog.css"
import PropTypes from "prop-types"
import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CSSTransition } from "react-transition-group"
import { toast } from "sonner"

import { LoaderIcon } from "../../assets/icons"
import { useAddTask } from "../../hooks/data/use-add-task"
import Button from "../Button"
import Input from "../Input"
import DatePicker from "./DatePicker"
import { companies, statusMap } from "../../util/taskConstants"
import { schema } from "../../util/validationSchema"

const AddTaskDialog = ({ isOpen, handleClose }) => {
    const { mutate: addTask } = useAddTask()
    const nodeRef = useRef()
    const [taskDate, setTaskDate] = useState(new Date())

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            company: companies[0],
            project: "Website Redesign",
            task_type: "Development",
            task_description: "",
            entry_time: "09:00",
            exit_time: "18:00",
            lunch_hours: "1",
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
        }
        addTask(taskPayload, {
            onSuccess: () => {
                handleClose()
                reset()
                toast.success("¡Tarea agregada con éxito!")
            },
            onError: (error) => {
                console.error("Error en la creación de tarea:", error)
                toast.error(
                    `Error: ${error.response?.data?.message || "No se pudo agregar la tarea"}`
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
                        <div className="relative rounded-xl bg-white shadow-sm">
                            <div className="flex items-center justify-center rounded-t border-b border-gray-200 p-4 md:p-5 dark:border-gray-600">
                                <h3 className="text-gray-900e text-lg font-semibold">
                                    Nueva Tarea
                                </h3>
                                {/* <p className="p-4 md:p-5 text-sm text-brand-text-gray">
                                  Ingresá la información a continuación
                              </p> */}
                            </div>
                            <form
                                onSubmit={handleSubmit(handleSaveClick)}
                                className="p-4 md:p-5"
                            >
                                <div className="mb-4 grid grid-cols-2 gap-4">
                                    <label>Empresa</label>
                                    <select
                                        {...register("company")}
                                        className="form-select"
                                    >
                                        {companies.map((company) => (
                                            <option
                                                key={company}
                                                value={company}
                                            >
                                                {company}
                                            </option>
                                        ))}
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
                                    <div className="col-span-2 sm:col-span-1">
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
                                    </div>
                                    <Input
                                        id="lunch_hours"
                                        label="Horas de Almuerzo"
                                        type="number"
                                        {...register("lunch_hours")}
                                        error={errors.lunch_hours}
                                    />
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
                                    {errors.status && (
                                        <p className="error">
                                            {errors.status.message}
                                        </p>
                                    )}
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
                                            Guardar
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
