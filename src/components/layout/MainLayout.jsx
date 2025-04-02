import Sidebar from "./Sidebar"
import TopBar from "./TopBar"
import { useSidebar } from "../../hooks/use-sidebar"

const MainLayout = ({ children }) => {
    const { isOpen, setIsOpen, toggleSidebar } = useSidebar()

    return (
        <div className="flex h-screen bg-greyBg">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <TopBar toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    )
}

export default MainLayout
