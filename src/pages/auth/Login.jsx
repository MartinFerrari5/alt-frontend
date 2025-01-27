import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom" // Usamos react-router-dom para Vite
import { z } from "zod"

// Esquema de validación usando zod
const schema = z.object({
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .nonempty("Password is required"),
})

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const navigate = useNavigate() // Sustituye a useRouter
  const [message, setMessage] = useState(null) // Manejar el mensaje de éxito o error

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
          text: `Login failed: ${errorData.message}`,
        })
        return
      }

      // const result = await response.json()
      setMessage({ type: "success", text: "Login successful!" })

      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate("/") // Redirige a la página principal
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      setMessage({
        type: "error",
        text: "An error occurred while logging in. Please try again.",
      })
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-100 to-white antialiased">
      <div className="container mx-auto px-6">
        <div className="flex h-full flex-col items-center justify-evenly text-center md:flex-row md:text-left">
          {/* Sección izquierda */}
          <div className="flex w-full flex-col md:w-1/2">
            <div>
              <svg
                className="fill-stroke mx-auto h-20 w-20 text-gray-800 md:float-left"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-gray-800">Client Area</h1>
            <p className="mx-auto w-5/12 text-gray-500 md:mx-0">
              Control and monitorize your website data from dashboard.
            </p>
          </div>

          {/* Sección derecha */}
          <div className="mx-auto w-full md:mx-0 md:w-1/2 lg:w-9/12">
            <div className="flex w-full flex-col rounded-xl bg-white p-10 shadow-xl">
              <h2 className="mb-5 text-left text-2xl font-bold text-gray-800">
                Signin
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                {/* Input de Email */}
                <div className="my-5 flex w-full flex-col">
                  <label htmlFor="email" className="mb-2 text-gray-500">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    placeholder="Please insert your email"
                    className={`appearance-none rounded-lg border-2 px-4 py-3 placeholder-gray-300 focus:shadow-lg focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-100 focus:ring-green-600"
                    }`}
                  />
                  {errors.email && (
                    <span className="text-sm text-red-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Input de Password */}
                <div className="my-5 flex w-full flex-col">
                  <label htmlFor="password" className="mb-2 text-gray-500">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register("password")}
                    placeholder="Please insert your password"
                    className={`appearance-none rounded-lg border-2 px-4 py-3 placeholder-gray-300 focus:shadow-lg focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-100 focus:ring-green-600"
                    }`}
                  />
                  {errors.password && (
                    <span className="text-sm text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {/* Botón de envío */}
                <div className="my-5 flex w-full flex-col">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full rounded-lg py-4 text-green-100 ${
                      isSubmitting
                        ? "cursor-not-allowed bg-green-400"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    <div className="flex flex-row items-center justify-center">
                      <span className="font-bold">
                        {isSubmitting ? "Signing in..." : "Signin"}
                      </span>
                    </div>
                  </button>
                  {message && (
                    <div
                      className={`mt-3 rounded-lg p-3 text-center text-sm ${
                        message.type === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}
                  <div className="mt-5 flex justify-evenly">
                    <a
                      href="#"
                      className="w-full text-center font-medium text-gray-500"
                    >
                      Recover password!
                    </a>
                    <a
                      href="#"
                      className="w-full text-center font-medium text-gray-500"
                    >
                      Signup!
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
