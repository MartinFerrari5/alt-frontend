// /src/components/user/ChangePassword.jsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import { changePassword } from "../../hooks/data/users/usersAlt"
import { FaSpinner } from "react-icons/fa"

const schema = z
    .object({
        email: z.string().email({ message: "Correo electrónico inválido" }),
        old_password: z
            .string()
            .min(1, { message: "La contraseña antigua es obligatoria" }),
        new_password: z
            .string()
            .min(8, {
                message: "La nueva contraseña debe tener al menos 8 caracteres",
            })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
                message:
                    "La nueva contraseña debe contener mayúsculas, minúsculas y números",
            }),
        confirm_new_password: z
            .string()
            .min(1, { message: "Confirma la nueva contraseña" }),
    })
    .refine((data) => data.new_password === data.confirm_new_password, {
        path: ["confirm_new_password"],
        message: "Las contraseñas no coinciden",
    })

const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data) => {
        const { email, old_password, new_password } = data
        try {
            await changePassword({ email, old_password, new_password })
            toast.success("¡Contraseña cambiada exitosamente!")
            reset()
        } catch (error) {
            toast.error(
                error.message || "Ocurrió un error al cambiar la contraseña"
            )
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-md rounded bg-white p-6 shadow"
        >
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Cambiar contraseña
            </h2>
            <div className="mb-5">
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Correo electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    {...register("email")}
                    placeholder="tu@correo.com"
                    className="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                    <p className="mt-1 text-sm font-medium text-red-600">
                        {errors.email.message}
                    </p>
                )}
            </div>
            <div className="mb-5">
                <label
                    htmlFor="old_password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Contraseña antigua
                </label>
                <input
                    type="password"
                    id="old_password"
                    {...register("old_password")}
                    placeholder="Ingresa tu contraseña actual"
                    className="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.old_password && (
                    <p className="mt-1 text-sm font-medium text-red-600">
                        {errors.old_password.message}
                    </p>
                )}
            </div>
            <div className="mb-5">
                <label
                    htmlFor="new_password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Nueva contraseña
                </label>
                <input
                    type="password"
                    id="new_password"
                    {...register("new_password")}
                    placeholder="Ingresa la nueva contraseña"
                    className="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.new_password && (
                    <p className="mt-1 text-sm font-medium text-red-600">
                        {errors.new_password.message}
                    </p>
                )}
            </div>
            <div className="mb-6">
                <label
                    htmlFor="confirm_new_password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Confirmar nueva contraseña
                </label>
                <input
                    type="password"
                    id="confirm_new_password"
                    {...register("confirm_new_password")}
                    placeholder="Repite la nueva contraseña"
                    className="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirm_new_password && (
                    <p className="mt-1 text-sm font-medium text-red-600">
                        {errors.confirm_new_password.message}
                    </p>
                )}
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-75"
            >
                {isSubmitting && <FaSpinner className="mr-2 animate-spin" />}
                {isSubmitting ? "Procesando..." : "Cambiar contraseña"}
            </button>
        </form>
    )
}

export default ChangePassword
