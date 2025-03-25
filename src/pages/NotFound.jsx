import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
    const navigate = useNavigate()
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    navigate("/")
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [navigate])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-center text-white">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="mt-4 text-xl">Página no encontrada</p>
            <p className="text-md mt-2">
                Serás redirigido en {countdown} segundos...
            </p>
            <button
                className="mt-6 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => navigate("/")}
            >
                Volver a inicio
            </button>
        </div>
    )
}
