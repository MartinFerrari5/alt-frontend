// /src/util/date.js

/**
 * Formatea la fecha de la tarea en formato YYYYMMDD.
 * Soporta objetos Date y strings.
 *
 * @param {Date|string} date - Fecha a formatear.
 * @returns {string} Fecha formateada.
 * @throws {Error} Si el formato de la fecha es inválido.
 */
export const formatTaskDate = (date) => {
    if (date instanceof Date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}${month}${day}`
    }
    if (typeof date === "string") {
        const parsedDate = new Date(date)
        if (!isNaN(parsedDate.getTime())) {
            return formatTaskDate(parsedDate)
        }
        // Si ya viene en el formato correcto (YYYYMMDD) se retorna
        if (/^\d{8}$/.test(date)) return date
    }
    throw new Error("Formato de fecha inválido")
}

/**
 * Asegura que la hora tenga formato HH:MM.
 * Si la hora viene en formato HH:MM:SS, extrae solo HH:MM.
 *
 * @param {string} timeStr - Hora en formato HH:MM:SS.
 * @returns {string} Hora formateada.
 */
export const formatTime = (timeStr) => {
    if (typeof timeStr !== "string") {
        throw new Error("La hora debe ser una cadena de texto.")
    }
    // Si la cadena contiene la forma extendida "HH:MM:SS", se extrae HH:MM.
    if (
        timeStr.length === 8 &&
        /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(timeStr)
    ) {
        return timeStr.slice(0, 5)
    }
    // Validamos el formato "HH:MM"
    if (timeStr.length === 5 && /^([01]\d|2[0-3]):[0-5]\d$/.test(timeStr)) {
        return timeStr
    }
    throw new Error("Formato de hora inválido")
}
