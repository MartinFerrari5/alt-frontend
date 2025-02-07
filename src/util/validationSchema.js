// validationSchema.js
import { z } from "zod"

export const schema = z.object({
    company: z.string().nonempty("Seleccioná una empresa."),
    project: z.string().nonempty("El nombre del proyecto es obligatorio."),
    task_type: z.string().nonempty("El tipo de tarea es obligatorio."),
    task_description: z
        .string()
        .min(10, "La descripción debe tener al menos 10 caracteres."),
    entry_time: z
        .string()
        .regex(/^\d{2}:\d{2}$/, "Formato de hora inválido (HH:MM)."),
    exit_time: z
        .string()
        .regex(/^\d{2}:\d{2}$/, "Formato de hora inválido (HH:MM)."),
    lunch_hours: z
        .string()
        .regex(
            /^[0-3](\.5)?$/,
            "Las horas de almuerzo deben ser entre 0 y 3 horas."
        ),
    status: z.string().nonempty("Seleccioná un estado."),
    hour_type: z.string().nonempty("Seleccioná un tipo de hora."),
})
