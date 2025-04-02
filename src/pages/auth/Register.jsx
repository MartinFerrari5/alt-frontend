// src/pages/auth/Register.jsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

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

// Componente LoadingSpinner reutilizable
const LoadingSpinner = () => (
    <div role="status" className="flex items-center justify-center">
        <svg
            aria-hidden="true"
            className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
            />
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
            />
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
)

/**
 * Componente auxiliar para renderizar campos de formulario.
 *
 * @param {{id: string, label: string, type?: string, placeholder?: string, inputProps?: object, error?: string}} props
 * @returns {JSX.Element}
 */
const FormField = ({
    id,
    label,
    type = "text",
    placeholder,
    inputProps,
    error,
}) => (
    <div className="mb-4">
        {/* Label del campo */}
        <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-gray-500"
        >
            {label}
        </label>
        {/* Input del campo */}
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            {...inputProps}
            className={`focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 ${
                error ? "border-red-500" : ""
            }`}
        />
        {/* Mostrar mensaje de error si existe */}
        {error && (
            <p className="mt-1 text-sm text-red-500">
                {/* Mensaje de error */}
                {error}
            </p>
        )}
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
        // Formatear los datos según la documentación
        const formattedData = {
            full_name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            password: data.password,
            role: "user", // Puedes ajustar el valor de role según tu lógica (ej. "user" o "admin")
        }

        try {
            // Se envía la solicitud al endpoint correcto
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formattedData),
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(
                    errorData.message || "Error al registrar usuario"
                )
            }

            setMessage({ type: "success", text: "¡Registro exitoso!" })
            setTimeout(() => navigate("/rraa/login"), 2000)
        } catch (error) {
            setMessage({ type: "error", text: error.message })
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
                                {isSubmitting ? (
                                    <LoadingSpinner />
                                ) : message?.type === "success" ? (
                                    "¡Registro exitoso!"
                                ) : message?.type === "error" ? (
                                    "Error en el registro"
                                ) : (
                                    "Registrar"
                                )}
                            </button>
                            {message && (
                                <p
                                    className={`mt-2 text-sm ${
                                        message.type === "error"
                                            ? "text-red-500"
                                            : "text-green-500"
                                    }`}
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
                        to="/rraa/login"
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
