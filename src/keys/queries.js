export const taskQueryKeys = {
    getAll: () => ["tasks"],
    getOne: (taskId) => ["task", taskId],
}

export const userQueryKeys = {
    getAll: () => ["users", "getAll"],
    getById: (userId) => ["users", "getById", userId],
}
