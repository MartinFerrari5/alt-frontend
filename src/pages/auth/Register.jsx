import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { api } from "../../lib/axios"

// Esquema de validación con Zod
const schema = z
    .object({
        firstName: z.string().min(2, "El nombre es obligatorio"),
        lastName: z.string().min(2, "El apellido es obligatorio"),
        email: z.string().email("Formato de correo inválido"),
        password: z
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    })

// Componente auxiliar para renderizar campos de formulario
const FormField = ({
    id,
    label,
    type = "text",
    placeholder,
    inputProps,
    error,
}) => (
    <div className="mb-4">
        <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-gray-500"
        >
            {label}
        </label>
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            {...inputProps}
            className={`focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 ${
                error ? "border-red-500" : ""
            }`}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
)

const PageRegister = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(schema) })
    const navigate = useNavigate()
    const [message, setMessage] = useState(null)

    const onSubmit = async (data) => {
        const formattedData = {
            full_name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            password: data.password,
        }

        try {
            const response = await fetch(`${api}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            })

            if (!response.ok) {
                throw new Error("Error al registrar usuario")
            }

            setMessage({ type: "success", text: "¡Registro exitoso!" })
            setTimeout(() => navigate("/login"), 2000)
        } catch (error) {
            setMessage({ type: "error", text: "Error al registrar usuario" })
        }
    }

    return (
        <section className="flex h-screen items-center justify-center bg-gradient-to-br from-green-200 to-white p-10 antialiased">
            <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
                <a
                    href="#"
                    className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-600"
                >
                    <img
                        className="w-18 mr-2 h-8"
                        src="/src/assets/icons/Alt_Logo.png"
                        alt="logo"
                    />
                    Tarea
                </a>
                <div className="flex w-full flex-col rounded-xl bg-white p-10 shadow-xl">
                    <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl">
                            Registrarse
                        </h1>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mx-auto max-w-md space-y-4 rounded-xl"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    id="firstName"
                                    label="Nombre"
                                    placeholder="Nombre"
                                    inputProps={register("firstName")}
                                    error={errors.firstName?.message}
                                />
                                <FormField
                                    id="lastName"
                                    label="Apellido"
                                    placeholder="Apellido"
                                    inputProps={register("lastName")}
                                    error={errors.lastName?.message}
                                />
                            </div>
                            <FormField
                                id="email"
                                label="Correo"
                                type="email"
                                placeholder="Correo"
                                inputProps={register("email")}
                                error={errors.email?.message}
                            />
                            <FormField
                                id="password"
                                label="Contraseña"
                                type="password"
                                placeholder="Contraseña"
                                inputProps={register("password")}
                                error={errors.password?.message}
                            />
                            <FormField
                                id="confirmPassword"
                                label="Confirmar contraseña"
                                type="password"
                                placeholder="Confirmar contraseña"
                                inputProps={register("confirmPassword")}
                                error={errors.confirmPassword?.message}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full rounded-lg py-4 text-green-100 ${
                                    isSubmitting
                                        ? "cursor-not-allowed bg-green-400"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {isSubmitting
                                    ? "Registrando..."
                                    : message?.type === "success"
                                      ? "¡Registro exitoso!"
                                      : message?.type === "error"
                                        ? "Error en el registro"
                                        : "Registrar"}
                            </button>
                            {message && (
                                <p
                                    className={`mt-2 text-sm ${message.type === "error" ? "text-red-500" : "text-green-500"}`}
                                >
                                    {message.text}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
                <p className="text-sm font-light text-gray-500">
                    ¿Ya tienes cuenta?{" "}
                    <Link
                        to="/login"
                        className="text-primary-600 font-medium hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </section>
    )
}

export default PageRegister
