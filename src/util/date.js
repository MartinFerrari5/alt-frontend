// /src/util/date.js

/**
 * Formatea la fecha de la tarea en formato YYYYMMDD.
 * Soporta:
 *   - Objetos Date
 *   - Strings en formato ISO "YYYY-MM-DD"
 *   - Strings ya en "YYYYMMDD"
 *
 * @param {Date|string} date - Fecha a formatear.
 * @returns {string} Fecha formateada como "YYYYMMDD".
 * @throws {Error} Si el formato de la fecha es inválido.
 */
export const formatTaskDate = (date) => {
    // Caso 1: objeto Date
    if (date instanceof Date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}${month}${day}`
    }

    // Caso 2: string ISO "YYYY-MM-DD"
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split("-")
        return `${year}${month}${day}`
    }

    // Caso 3: string ya en "YYYYMMDD"
    if (typeof date === "string" && /^\d{8}$/.test(date)) {
        return date
    }

    // Caso 4: otras cadenas (por ejemplo, con hora)
    if (typeof date === "string") {
        const parsedDate = new Date(date)
        if (!isNaN(parsedDate.getTime())) {
            // Volvemos a formatear como Date (ver Caso 1)
            const year = parsedDate.getFullYear()
            const month = String(parsedDate.getMonth() + 1).padStart(2, "0")
            const day = String(parsedDate.getDate()).padStart(2, "0")
            return `${year}${month}${day}`
        }
    }

    throw new Error(
        "Formato de fecha inválido: se esperaba Date, 'YYYY-MM-DD' o 'YYYYMMDD'"
    )
}

/**
 * Asegura que la hora tenga formato HH:MM.
 * Si la hora viene en formato HH:MM:SS, extrae solo HH:MM.
 *
 * @param {string} timeStr - Hora en formato HH:MM o HH:MM:SS.
 * @returns {string} Hora formateada.
 * @throws {Error} Si el formato de la hora es inválido.
 */
export const formatTime = (timeStr) => {
    if (typeof timeStr !== "string") {
        throw new Error("La hora debe ser una cadena de texto.")
    }
    // Si es "HH:MM:SS", extraemos "HH:MM"
    if (
        timeStr.length === 8 &&
        /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(timeStr)
    ) {
        return timeStr.slice(0, 5)
    }
    // Si ya es "HH:MM"
    if (timeStr.length === 5 && /^([01]\d|2[0-3]):[0-5]\d$/.test(timeStr)) {
        return timeStr
    }
    throw new Error("Formato de hora inválido")
}
