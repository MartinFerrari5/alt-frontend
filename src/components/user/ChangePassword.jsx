// /src/components/ChangePassword.jsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import { changePassword } from "../../hooks/data/users/usersAlt"

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
            toast.error(error.message)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-md p-4"
        >
            <h2 className="mb-4 text-xl font-semibold">Cambiar contraseña</h2>
            <div className="mb-4">
                <label htmlFor="email" className="mb-1 block font-medium">
                    Correo electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    {...register("email")}
                    placeholder="tu@correo.com"
                    className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>
            <div className="mb-4">
                <label
                    htmlFor="old_password"
                    className="mb-1 block font-medium"
                >
                    Contraseña antigua
                </label>
                <input
                    type="password"
                    id="old_password"
                    {...register("old_password")}
                    placeholder="Ingresa tu contraseña actual"
                    className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.old_password && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.old_password.message}
                    </p>
                )}
            </div>
            <div className="mb-4">
                <label
                    htmlFor="new_password"
                    className="mb-1 block font-medium"
                >
                    Nueva contraseña
                </label>
                <input
                    type="password"
                    id="new_password"
                    {...register("new_password")}
                    placeholder="Ingresa la nueva contraseña"
                    className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.new_password && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.new_password.message}
                    </p>
                )}
            </div>
            <div className="mb-6">
                <label
                    htmlFor="confirm_new_password"
                    className="mb-1 block font-medium"
                >
                    Confirmar nueva contraseña
                </label>
                <input
                    type="password"
                    id="confirm_new_password"
                    {...register("confirm_new_password")}
                    placeholder="Repite la nueva contraseña"
                    className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirm_new_password && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.confirm_new_password.message}
                    </p>
                )}
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
                Cambiar contraseña
            </button>
        </form>
    )
}

export default ChangePassword
