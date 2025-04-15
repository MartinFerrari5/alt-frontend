// src/pages/auth/SignIn.jsx
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios" // Importar axios
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../../store/modules/authStore"
import { LoadingSpinner } from "../../util/LoadingSpinner"
import { schemaSignIn } from "../../util/validationSchema"

const SignIn = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schemaSignIn),
    })

    const login = useAuthStore((state) => state.login)
    const navigate = useNavigate()
    const [message, setMessage] = useState(null)

    const onSubmit = async (data) => {
        try {
            // Reemplazar fetch con axios.post
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/login`,
                data
            )
            const { token, refreshToken } = response.data
            login({ token, refreshToken })
            navigate("/rraa")
        } catch (error) {
            console.error("Error de inicio de sesión:", error)
            let errorText = error.response?.data.message || "Error desconocido"
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
                    Reportes
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
                                        to="/rraa/reset-password"
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
                        to="/rraa/register"
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
