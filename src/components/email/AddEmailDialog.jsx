import PropTypes from "prop-types"
import { useRef } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CSSTransition } from "react-transition-group"
import { toast } from "sonner"

import { LoaderIcon } from "../../assets/icons"
import { useAddEmail } from "../../hooks/data/Use-add-email"
import Button from "../Button"
import Input from "../Input"

const AddEmailDialog = ({ isOpen, handleClose }) => {
    const { mutate: addEmail } = useAddEmail()
    const nodeRef = useRef()

    const schema = z.object({
        email: z.string().email("Debe ser un correo válido."),
    })

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: "" },
    })

    const handleSaveClick = async (data) => {
        addEmail(data, {
            onSuccess: () => {
                handleClose()
                reset()
                toast.success("¡Correo agregado con éxito!")
            },
            onError: (error) => {
                console.error("Error en la creación de correo:", error)
                toast.error(
                    `Error: ${error.response?.data?.message || "No se pudo agregar el correo"}`
                )
            },
        })
    }

    return createPortal(
        <CSSTransition
            nodeRef={nodeRef}
            in={isOpen}
            timeout={500}
            classNames="fade"
            unmountOnExit
        >
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="relative w-full max-w-md rounded-lg bg-white p-5 shadow-lg dark:bg-gray-700">
                    <div className="flex items-center justify-between border-b pb-3 dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Nuevo Correo
                        </h3>
                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={handleClose}
                        >
                            ✕
                        </button>
                    </div>
                    <form
                        onSubmit={handleSubmit(handleSaveClick)}
                        className="space-y-4 p-4"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Correo Electrónico
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                {...register("email")}
                                error={errors.email}
                                className="w-full rounded-lg border p-2.5 dark:border-gray-500 dark:bg-gray-600 dark:text-white"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                color="secondary"
                                onClick={handleClose}
                                className="rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                {isSubmitting && (
                                    <LoaderIcon className="mr-2 animate-spin" />
                                )}{" "}
                                Guardar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </CSSTransition>,
        document.body
    )
}

AddEmailDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
}

export default AddEmailDialog
