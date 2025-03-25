// /src/pages/Tasks.jsx
import Sidebar from "../../components/Sidebar"
import ChangePassword from "../../components/user/ChangePassword"

const NewPasswordPage = () => (
    <div className="flex h-screen">
        <Sidebar />
        <main className="w-full lg:ml-72">
            <ChangePassword />
        </main>
    </div>
)

export default NewPasswordPage
