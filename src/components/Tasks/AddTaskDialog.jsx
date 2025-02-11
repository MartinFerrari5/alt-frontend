import "./AddTaskDialog.css";
import PropTypes from "prop-types";
import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CSSTransition } from "react-transition-group";
import { LoaderIcon } from "../../assets/icons";
import { useAddTask } from "../../hooks/data/task/use-add-task";
import { useGetOptions } from "../../hooks/data/options/use-get-options";
import { useOptionsStore } from "../../store/optionsStore";
import useTaskStore from "../../store/taskStore";
import Button from "../Button";
import Input from "../Input";
import DatePicker from "./DatePicker";
import { statusMap } from "../../util/taskConstants";
import { schema } from "../../util/validationSchema";
import Alert from "../Alert/Alert";
import Dropdown from "../Dropdown/Dropdown";

const AddTaskDialog = ({ isOpen, handleClose }) => {
    const { mutate: addTask, isPending: isAddingTask } = useAddTask();
    const nodeRef = useRef(null);

    const [taskDate, setTaskDate] = useState(() => {
        const initialDate = new Date();
        initialDate.setHours(0, 0, 0, 0);
        return initialDate;
    });

    const [alert, setAlert] = useState(null);

    // Use the task store for local state management
    const addTaskToStore = useTaskStore((state) => state.addTask);
    const updateTaskInStore = useTaskStore((state) => state.updateTask);

    // Fetch options for dropdowns
    useGetOptions("companies_table", "companies");
    useGetOptions("hour_type_table", "hourTypes");
    useGetOptions("projects_table", "projects");

    const companies = useOptionsStore((state) => state.companies) || [];
    const hourTypes = useOptionsStore((state) => state.hourTypes) || [];
    const projects = useOptionsStore((state) => state.projects) || [];

    const { isLoading: isLoadingCompanies, isError: isErrorCompanies } =
        useGetOptions("companies_table", "companies");
    const { isLoading: isLoadingHourTypes, isError: isErrorHourTypes } =
        useGetOptions("hour_type_table", "hourTypes");
    const { isLoading: isLoadingProjects, isError: isErrorProjects } =
        useGetOptions("projects_table", "projects");

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
    });

    // Memoized function to reset form fields
    const resetForm = useCallback(() => {
        const currentCompany = watch("company");
        const currentProject = watch("project");
        const currentHourType = watch("hour_type");

        if (companies.length > 0 && !currentCompany) {
            reset({ ...watch(), company: companies[0] });
        }
        if (projects.length > 0 && !currentProject) {
            reset({ ...watch(), project: projects[0] });
        }
        if (hourTypes.length > 0 && !currentHourType) {
            reset({ ...watch(), hour_type: hourTypes[0] });
        }
    }, [companies, projects, hourTypes, reset, watch]);

    // Reset form fields when options are loaded
    useEffect(() => {
        resetForm();
    }, [resetForm]);

    const formatDateForBackend = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day} 00:00:00`;
    };

    const handleSaveClick = (data) => {
        const formattedDate = formatDateForBackend(taskDate);

        const taskPayload = {
            ...data,
            task_description: data.task_description.trim(),
            lunch_hours: data.lunch_hours.toString(),
            status: statusMap[data.status],
            task_date: formattedDate,
        };

        // Add the task to the local state immediately
        addTaskToStore(taskPayload);

        // Make the API call to add the task to the backend
        addTask(taskPayload, {
            onSuccess: (createdTask) => {
                // Update the task in the local state with the response from the backend
                updateTaskInStore(createdTask.id, { status: createdTask.status });

                setAlert({
                    type: "success",
                    message: "Puedes seguir agregando más tareas.",
                });
                setTimeout(() => {
                    setAlert(null);
                    handleClose();
                }, 3000);
            },
            onError: (error) => {
                setAlert({
                    type: "danger",
                    message:
                        error.response?.data?.message ||
                        "No se pudo agregar la tarea",
                });
            },
        });
    };

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
                                {alert && (
                                    <Alert
                                        type={alert.type}
                                        message={alert.message}
                                        onClose={() => setAlert(null)}
                                    />
                                )}
                                <form onSubmit={handleSubmit(handleSaveClick)}>
                                    <div className="mb-6 grid grid-cols-2 gap-4">
                                        <Dropdown
                                            id="company"
                                            label="Empresa"
                                            register={register}
                                            error={errors.company}
                                            isLoading={isLoadingCompanies}
                                            isError={isErrorCompanies}
                                            items={companies}
                                            loadingText="Cargando empresas..."
                                            errorText="Error cargando empresas"
                                        />

                                        <Dropdown
                                            id="project"
                                            label="Proyecto"
                                            register={register}
                                            error={errors.project}
                                            isLoading={isLoadingProjects}
                                            isError={isErrorProjects}
                                            items={projects}
                                            loadingText="Cargando proyectos..."
                                            errorText="Error cargando proyectos"
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
                                            className="col-span-2"
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

                                        <Dropdown
                                            id="hour_type"
                                            label="Tipo de Hora"
                                            register={register}
                                            error={errors.hour_type}
                                            isLoading={isLoadingHourTypes}
                                            isError={isErrorHourTypes}
                                            items={hourTypes}
                                            loadingText="Cargando tipos de hora..."
                                            errorText="Error cargando tipos de hora"
                                        />

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
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </CSSTransition>
    );
};

AddTaskDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default AddTaskDialog;