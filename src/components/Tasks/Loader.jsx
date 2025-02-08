// src/components/Tasks/Loader.jsx
const Loader = ({ text }) => (
    <div className="flex h-screen items-center justify-center">
        <span className="animate-spin">🔄</span>
        <span className="ml-2">{text}</span>
    </div>
)

export default Loader
