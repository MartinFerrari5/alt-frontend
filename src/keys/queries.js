// /src/hooks/data/use-get-task.js

export const taskQueryKeys = {
    getAll: () => ["tasks"],
    getOne: (taskId) => ["task", taskId],
    // Nueva clave para la ruta /tasks/all
    getAllAll: () => ["allTasks"],
}

export const userQueryKeys = {
    getAll: () => ["users", "getAll"],
    getById: (userId) => ["users", "getById", userId],
}

export const emailQueryKeys = {
    getAll: () => ["emails"], // Clave para obtener todos los emails
    getById: (emailId) => ["emails", "getById", emailId], // Para obtener un email específico
}

export const optionQueryKeys = {
    getAll: () => ["options"], // Clave para obtener todas las opciones
    getByTable: (table) => ["options", "getByTable", table], // Clave para obtener opciones por tabla
    getById: (optionId) => ["options", "getById", optionId], // Clave para obtener una opción específica
}
