// /src/components/Users/Users.jsx
import { useGetUsers } from "../../../hooks/data/use-get-users"
import Header from "../../Header"
import UsersItem from "./UsersItem"

const Users = () => {
    const { data: users = [] } = useGetUsers()

    return (
        <div className="w-full space-y-6 px-8 py-16">
            <Header subtitle="Lista de Usuarios" title="Usuarios" />
            <div className="rounded-xl bg-white p-6">
                <div className="relative max-h-[900px] overflow-y-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-600 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Rol</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-4 text-center text-sm text-brand-text-gray"
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
