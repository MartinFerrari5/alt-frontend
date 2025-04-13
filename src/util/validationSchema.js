// /src/util/validationSchema.js
import { z } from "zod"

export const schema = z
    .object({
        company: z.string().nonempty("Seleccioná una empresa."),
        project: z.string().nonempty("El nombre del proyecto es obligatorio."),
        task_type: z.string().nonempty("El tipo de tarea es obligatorio."),
        task_description: z
            .string()
            .min(10, "La descripción debe tener al menos 10 caracteres.")
            .trim(),
        entry_time: z
            .string()
            .regex(/^\d{2}:\d{2}$/, "Formato de hora inválido (HH:MM)."),
        exit_time: z
            .string()
            .regex(/^\d{2}:\d{2}$/, "Formato de hora inválido (HH:MM)."),
        lunch_hours: z.preprocess(
            (val) => {
                if (typeof val === "string" || typeof val === "number") {
                    return Number(val)
                }
                return val
            },
            z
                .number({
                    invalid_type_error:
                        "El valor de las horas de almuerzo debe ser un número.",
                })
                .min(
                    0.1,
                    "Las horas de almuerzo no pueden ser menores a 0.1 horas."
                )
                .max(
                    4,
                    "Las horas de almuerzo no pueden ser mayores a 4 horas."
                )
                .refine(
                    (value) => value * 10 === Math.round(value * 10),
                    "Las horas de almuerzo deben ser en incrementos de 0.1."
                )
        ),
        status: z.string().nonempty("Seleccioná un estado."),
        hour_type: z.string().nonempty("Seleccioná un tipo de hora."),
    })
    .refine(
        (data) => {
            const [entryHour, entryMinute] = data.entry_time
                .split(":")
                .map(Number)
            const [exitHour, exitMinute] = data.exit_time.split(":").map(Number)
            return (
                exitHour > entryHour ||
                (exitHour === entryHour && exitMinute > entryMinute)
            )
        },
        {
            message: "La hora de salida debe ser mayor que la hora de entrada.",
            path: ["exit_time"],
        }
    )

// Esquema de validación usando zod Login
export const schemaSignIn = z.object({
    email: z
        .string()
        .email("Formato de correo electrónico inválido")
        .nonempty("El correo electrónico es obligatorio"),
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .nonempty("La contraseña es obligatoria"),
})
