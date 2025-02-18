// src/components/DownloadExcelButton.jsx

import PropTypes from "prop-types"
import { useMutation } from "@tanstack/react-query"
import { FiDownload } from "react-icons/fi"
import Button from "../Button"
import { api } from "../../lib/axios"
import { toast } from "react-toastify"

/**
 * Componente para descargar un archivo Excel con las tareas.
 *
 * @param {Array} tasks - Array de tareas a enviar al endpoint.
 * @param {string} filename - Nombre del archivo descargado (opcional)
 */
const DownloadExcelButton = ({ tasks = [], filename = "tareas.xlsx" }) => {
    console.log("tasks Download:", tasks)

    const downloadMutation = useMutation({
        mutationFn: async () => {
            // Se arma el payload, enviando las tareas como JSON stringificado
            const payload = { tasks: JSON.stringify(tasks) }

            // Se asume que la instancia de axios tiene baseURL configurado correctamente.
            // Se utiliza la ruta "/status/download" para evitar duplicar segmentos en la URL.
            const response = await api.post("/status/download", payload, {
                responseType: "blob",
            })
            return response.data
        },
        onSuccess: (data) => {
            // Se crea un objeto URL a partir del blob recibido
            const url = window.URL.createObjectURL(new Blob([data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", filename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            toast.success("Archivo descargado correctamente!")
        },
        onError: (error) => {
            console.error("Error al descargar el archivo:", error)
            toast.error("Error al descargar el archivo, intente nuevamente.")
        },
    })

    const handleDownload = () => {
        if (tasks.length === 0) {
            toast.warn("No hay tareas para descargar.")
            return
        }
        downloadMutation.mutate()
    }

    return (
        <Button onClick={handleDownload} disabled={downloadMutation.isLoading}>
            <FiDownload />
            {downloadMutation.isLoading ? "Descargando..." : "Descargar"}
        </Button>
    )
}

DownloadExcelButton.propTypes = {
    tasks: PropTypes.array.isRequired,
    filename: PropTypes.string,
}

export default DownloadExcelButton
