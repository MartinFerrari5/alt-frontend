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
