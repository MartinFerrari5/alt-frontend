import PropTypes from "prop-types"
import { useState } from "react"

import Button from "./Button"
import AddTaskDialog from "./Tasks/AddTaskDialog"

import { AddIcon, TrashIcon } from "../assets/icons"

function Header({ subtitle, title }) {
  const [addTaskDialogIsOpen, setAddTaskDialogIsOpen] = useState(false)
  return (
    <div className="flex w-full justify-between">
      <div>
        <span className="text-xs font-semibold text-brand-custom-green">
          {subtitle}
        </span>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <Button color="ghost">
          Limpiar tareas
          <TrashIcon />
        </Button>

        <Button onClick={() => setAddTaskDialogIsOpen(true)}>
          <AddIcon />
          Nueva tarea
        </Button>

        <AddTaskDialog
          isOpen={addTaskDialogIsOpen}
          handleClose={() => setAddTaskDialogIsOpen(false)}
        />
      </div>
    </div>
  )
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Header
