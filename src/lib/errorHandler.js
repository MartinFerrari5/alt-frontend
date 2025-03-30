// src/lib/errorHandler.js
import { toast } from "react-toastify"

export const handleApiError = (error, defaultMessage = "Operación fallida") => {
    const errorData = error.response?.data
    const errorDetails = errorData?.details || []
    const mainMessage = errorData?.message || error.message || defaultMessage

    // Mostrar máximo 3 errores detallados
    const detailMessages = errorDetails
        .slice(0, 3)
        .map((d) => `${d.msg} (${d.path})`)
        .join(", ")

    const fullMessage = detailMessages
        ? `${mainMessage}: ${detailMessages}${errorDetails.length > 3 ? "..." : ""}`
        : mainMessage

    console.error("API Error:", { error, errorData })
    toast.error(fullMessage, {
        autoClose: 5000,
        toastId: errorData?.code || Date.now(),
    })

    return fullMessage
}
