// utils/date.js (Nuevo archivo)
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
        if (/^\d{8}$/.test(date)) return date
    }
    throw new Error("Formato de fecha inválido")
}
