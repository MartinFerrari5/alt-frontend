import "./AddTaskDialog.css"

import PropTypes from "prop-types"
import { useRef } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { CSSTransition } from "react-transition-group"
import { toast } from "sonner"
import { v4 } from "uuid"

import { LoaderIcon } from "../assets/icons"
import { useAddTask } from "../hooks/data/use-add-task"
import Button from "./Button"
import Input from "./Input"
import TimeSelect from "./TimeSelect"

const AddTaskDialog = ({ isOpen, handleClose }) => {
  const { mutate: addTask } = useAddTask()
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      time: "morning",
      description: "",
    },
  })
  const nodeRef = useRef()

  const handleSaveClick = async (data) => {
    addTask(
      {
        id: v4(),
        title: data.title.trim(),
        time: data.time,
        description: data.description.trim(),
        status: "not_started",
      },
      {
        onSuccess: () => {
          handleClose()
          reset({
            title: "",
            time: "morning",
            description: "",
          })
          toast.success("¡Tarea agregada con éxito!")
        },
        onError: () => {
          toast.error("Error al agregar la tarea. Por favor, intentá de nuevo.")
        },
      }
    )
  }

  const handleCancelClick = () => {
    reset({
      title: "",
      time: "morning",
      description: "",
    })
    handleClose()
  }

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={500}
      classNames="add-task-dialog"
      unmountOnExit
    >
      <div>
        {createPortal(
          <div
            ref={nodeRef}
            className="fixed bottom-0 left-0 top-0 flex h-screen w-screen items-center justify-center backdrop-blur"
          >
            {/* DIALOGO */}
            <div className="rounded-xl bg-white p-5 text-center shadow">
              <h2 className="text-xl font-semibold text-brand-dark-blue">
                Nueva Tarea
              </h2>
              <p className="mb-4 mt-1 text-sm text-brand-text-gray">
                Ingresá la información a continuación
              </p>

              <form
                onSubmit={handleSubmit(handleSaveClick)}
                className="flex w-[336px] flex-col space-y-4"
              >
                <Input
                  id="title"
                  label="Título"
                  placeholder="Ingresá el título de la tarea"
                  errorMessage={errors?.title?.message}
                  disabled={isSubmitting}
                  {...register("title", {
                    required: "El título es obligatorio.",
                    validate: (value) => {
                      if (!value.trim()) {
                        return "El título no puede estar vacío."
                      }
                      return true
                    },
                  })}
                />

                <TimeSelect
                  disabled={isSubmitting}
                  errorMessage={errors?.time?.message}
                  {...register("time", { required: true })}
                />

                <Input
                  id="description"
                  label="Descripción"
                  placeholder="Describí la tarea"
                  errorMessage={errors?.description?.message}
                  disabled={isSubmitting}
                  {...register("description", {
                    required: "La descripción es obligatoria.",
                    validate: (value) => {
                      if (!value.trim()) {
                        return "La descripción no puede estar vacía."
                      }
                      return true
                    },
                  })}
                />

                <div className="flex gap-3">
                  <Button
                    size="large"
                    className="w-full"
                    color="secondary"
                    onClick={handleCancelClick}
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="large"
                    className="w-full"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting && <LoaderIcon className="animate-spin" />}
                    Guardar
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
  handleSubmit: PropTypes.func.isRequired,
}

export default AddTaskDialog
