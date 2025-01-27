import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom" // Usamos react-router-dom para Vite
import { z } from "zod"

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

  const navigate = useNavigate()
  const [message, setMessage] = useState(null)

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setMessage({
          type: "error",
          text: `Error al iniciar sesión: ${errorData.message}`,
        })
        return
      }

      setMessage({ type: "success", text: "¡Inicio de sesión exitoso!" })

      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      setMessage({
        type: "error",
        text: "Ocurrió un error al iniciar sesión. Intenta nuevamente.",
      })
    }
  }

  return (
    // <section className="bg-gray-50 dark:bg-gray-900">
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
                  name="email"
                  id="email"
                  {...register("email")}
                  className={`focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="nombre@empresa.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
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
                  name="password"
                  id="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className={`focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${errors.password ? "border-red-500" : ""}`}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500">
                      Recuérdame
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
                >
                  ¿Olvidaste la contraseña?
                </a>
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
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
              {message && (
                <p
                  className={`mt-2 text-sm ${message.type === "error" ? "text-red-500" : "text-green-500"}`}
                >
                  {message.text}
                </p>
              )}
              <p className="text-gray-00 text-sm font-light">
                ¿No tienes cuenta?{" "}
                <a
                  href="#"
                  className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                >
                  Regístrate
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignIn
