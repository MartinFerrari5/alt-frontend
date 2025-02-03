import { useGetUsers } from "../../hooks/data/use-get-users"
import Header from "../Header"
import UsersItem from "./UsersItem"

const Users = () => {
    const { data: users = [] } = useGetUsers()

    return (
        <div className="w-full space-y-6 px-8 py-16">
            <Header subtitle="Lista de Usuarios" title="Usuarios" />
            <div className="rounded-xl bg-white p-6">
                {users.length === 0 ? (
                    <p className="text-sm text-brand-text-gray">
                        No hay usuarios disponibles.
                    </p>
                ) : (
                    users.map((user) => <UsersItem key={user.id} user={user} />)
                )}
            </div>
        </div>
    )
}

export default Users
