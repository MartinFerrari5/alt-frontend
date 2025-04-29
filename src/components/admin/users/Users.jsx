// /src/components/Users/Users.jsx

import { useGetUsers } from "../../../store/modules/userStore"
import Header from "../../layout/Header"

import UsersItem from "./UsersItem"

const Users = () => {
    const { data: users = [], isLoading, error } = useGetUsers()

    if (isLoading) {
        return <div>Cargando usuarios...</div>
    }

    if (error) {
        return <div>Error al cargar usuarios: {error.message}</div>
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex w-full items-center justify-between rounded-lg bg-white px-6 py-4 shadow-md">
                <div>
                    <span className="text-brand-custom-green text-xl font-semibold">
                        Lista de Usuarios
                    </span>
                </div>
            </div>
            <div className="rounded-xl bg-white p-6">
                <div className="relative max-h-[900px] overflow-y-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-600 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-brand-text-gray px-6 py-4 text-center text-sm"
                                    >
                                        No hay usuarios disponibles.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <UsersItem key={user.id} user={user} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Users
