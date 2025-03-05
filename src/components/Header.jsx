// src/components/Header.jsx
import PropTypes from "prop-types"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import Button from "./Button"
import { AddIcon } from "../assets/icons"
import AddOptionDialog from "./email/AddOptionDialog"
import AddTaskDialog from "./Tasks/AddTaskDialog"
import DownloadExcelButton from "./admin/DownloadExcelButton"
import SendToRRHHButton from "./Tasks/SendToRRHHButton"
import useAuthStore from "../store/authStore"

function Header({ subtitle, title, tasks }) {
  const [addDialogIsOpen, setAddDialogIsOpen] = useState(false)
  const location = useLocation()

  // Obtener información del usuario desde el store
  const user = useAuthStore((state) => state.user)
  
  // Extraer lo que sigue a "/admin/"
  const adminPath = location.pathname.startsWith("/admin/")
    ? location.pathname.replace("/admin/", "")
    : ""

  // Usamos la información del usuario para los queryParams
  const queryParams = {
    company: "facebook", // o el valor que corresponda
    project: "reportes", // o el valor que corresponda
    fullname: user?.full_name || "", // obtenemos el nombre completo del usuario
    date: "2025-02-20 2025-03-18", // o bien, un valor dinámico
  }

  return (
    <div className="flex w-full justify-between">
      <div>
        <span className="text-xs font-semibold text-brand-custom-green">
          {subtitle}
        </span>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        {location.pathname === "/admin/exported" ||
        location.pathname === "/task/exported" ? (
          <DownloadExcelButton tasks={tasks} />
        ) : (
          <>
            <Button onClick={() => setAddDialogIsOpen(true)}>
              <AddIcon />
              {adminPath ? "" : "Nueva tarea"}
            </Button>

            {adminPath ? (
              <AddOptionDialog
                isOpen={addDialogIsOpen}
                handleClose={() => setAddDialogIsOpen(false)}
              />
            ) : (
              <AddTaskDialog
                isOpen={addDialogIsOpen}
                handleClose={() => setAddDialogIsOpen(false)}
              />
            )}

            {/* Botón para enviar tareas a RRHH, usando los queryParams que incluyen la info del usuario */}
            <SendToRRHHButton queryParams={queryParams} tasks={tasks} />
          </>
        )}
      </div>
    </div>
  )
}

Header.propTypes = {
  subtitle: PropTypes.string,
  title: PropTypes.string,
  tasks: PropTypes.array,
}

export default Header
