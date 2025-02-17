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
    edit: (emailId) => ["edit-email", emailId], // Se agrega la función "edit"
    remove: (emailId) => ["remove-email", emailId], // Se agrega la función "remove"
}

export const optionMutationKeys = {
    add: () => ["add-option"],
    update: (optionId) => ["update-option", optionId],
    delete: (optionId) => ["delete-option", optionId],
}
