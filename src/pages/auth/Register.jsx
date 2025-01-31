import { zodResolver } from "@hookform/resolvers/zod"
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
    phone: z
      .string()
      .regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, "Formato: 123-456-7890"),
    company: z.string().min(2, "El nombre de la empresa es obligatorio"),
    role: z.enum(["admin", "user", "program"], "Selecciona un perfil"),
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

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error al registrar usuario")
      }

      navigate("/dashboard")
    } catch (error) {
      console.error(error.message)
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

          <input
            {...register("phone")}
            placeholder="Teléfono (123-456-7890)"
            className="w-full border p-2"
          />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}

          <input
            {...register("company")}
            placeholder="Empresa"
            className="w-full border p-2"
          />
          {errors.company && (
            <p className="text-red-500">{errors.company.message}</p>
          )}

          {/* <select {...register("role")} className="border p-2 w-full">
                    <option value="">Selecciona un perfil</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="program">Program</option>
                </select>
                {errors.role && <p className="text-red-500">{errors.role.message}</p>} */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 p-2 text-white"
          >
            {isSubmitting ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </section>
  )
}

export default PageRegister
