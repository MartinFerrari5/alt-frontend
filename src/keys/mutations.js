// /src/keys/mutations.js

export const taskMutationKeys = {
    add: () => ["add-task"],
    update: (taskId) => ["update-task", taskId],
    delete: (taskId) => ["delete-task", taskId],
}

export const userMutationKeys = {
    delete: () => ["deleteUser"],
    update: (userId) => ["updateUser", userId],
}

export const emailMutationKeys = {
    add: () => ["add-email"],
}

export const optionMutationKeys = {
    add: () => ["add-option"], // Clave para agregar una opción
    update: (optionId) => ["update-option", optionId], // Clave para actualizar una opción
    delete: (optionId) => ["delete-option", optionId], // Clave para eliminar una opción
}
