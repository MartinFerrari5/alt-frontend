// src/pages/auth/SignIn.jsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import useAuthStore from "../../store/modules/authStore"


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

// Esquema de validación usando zod
const schema = z.object({
    email: z
        .string()
        .email("Formato de correo electrónico inválido")
        .nonempty("El correo electrónico es obligatorio"),
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .nonempty("La contraseña es obligatoria"),
})

const SignIn = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    })

    const login = useAuthStore((state) => state.login)
    const navigate = useNavigate()
    const [message, setMessage] = useState(null)

    const onSubmit = async (data) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            )

            if (!response.ok) {
                let errorMsg = "Error al iniciar sesión. Intenta nuevamente."
                try {
                    const errorData = await response.json()
                    if (errorData?.message) {
                        // Mensaje personalizado según el código de estado
                        if (response.status === 401) {
                            errorMsg =
                                "Credenciales incorrectas. Verifica tu correo y contraseña."
                        } else {
                            errorMsg = errorData.message
                        }
                    }
                } catch (parseError) {
                    console.error(
                        "Error al parsear la respuesta de error:",
                        parseError
                    )
                }
                setMessage({ type: "error", text: errorMsg })
                return
            }

            const { token, refreshToken } = await response.json()
            login({ token, refreshToken })
            setMessage({ type: "success", text: "¡Inicio de sesión exitoso!" })

            setTimeout(() => {
                navigate("/")
            }, 1000)
        } catch (error) {
            console.error("Error de red o inesperado:", error)
            let errorText = "Ocurrió un error inesperado. Intenta nuevamente."
            if (
                error.message === "Failed to fetch" ||
                error instanceof TypeError
            ) {
                errorText = "Error de red. Revisa tu conexión a internet."
            }
            setMessage({ type: "error", text: errorText })
        }
    }

    return (
        <section className="flex h-screen items-center justify-center bg-gradient-to-br from-green-200 to-white antialiased">
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
                            Inicia sesión en tu cuenta
                        </h1>
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-gray-500"
                                >
                                    Tu correo electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register("email")}
                                    className={`focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 ${
                                        errors.email ? "border-red-500" : ""
                                    }`}
                                    placeholder="nombre@empresa.com"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-gray-500"
                                >
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    {...register("password")}
                                    placeholder="••••••••"
                                    className={`focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 ${
                                        errors.password ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <a className="text-sm font-light">
                                    <Link
                                        to="/reset-password"
                                        className="text-primary-600 text-sm font-medium hover:underline"
                                    >
                                        ¿Olvidaste la contraseña?
                                    </Link>
                                </a>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            className="focus:ring-3 focus:ring-primary-300 h-4 w-4 rounded border border-gray-300 bg-gray-50"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="remember"
                                            className="text-gray-500"
                                        >
                                            Recuérdame
                                        </label>
                                    </div>
                                </div>
                            </div>
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
                                ) : (
                                    "Iniciar sesión"
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
                    ¿No tienes cuenta?{" "}
                    <Link
                        to="/register"
                        className="text-primary-600 font-medium hover:underline"
                    >
                        Regístrate
                    </Link>
                </p>
            </div>
        </section>
    )
}

export default SignIn
