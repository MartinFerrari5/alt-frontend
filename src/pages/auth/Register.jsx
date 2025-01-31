import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

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

const PageRegister = () => {
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
    const formattedData = {
      full_name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <section className="flex h-screen items-center justify-center bg-gradient-to-br from-green-200 to-white antialiased">
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-md space-y-4 rounded-xl bg-white p-10 shadow-xl"
        >
          <input
            {...register("firstName")}
            placeholder="Nombre"
            className="w-full border p-2"
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
          )}

          <input
            {...register("lastName")}
            placeholder="Apellido"
            className="w-full border p-2"
          />
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
          )}

          <input
            {...register("email")}
            placeholder="Correo"
            className="w-full border p-2"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <input
            {...register("password")}
            type="password"
            placeholder="Contraseña"
            className="w-full border p-2"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full border p-2"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}

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
              className={`mt-2 text-sm ${
                message.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default PageRegister
