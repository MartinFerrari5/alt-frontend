// src/main.jsx
import "./index.css"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ToastContainer } from "react-toastify" // Importa ToastContainer de react‑toastify
import "react-toastify/dist/ReactToastify.css" // Importa el CSS de react‑toastify

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx"
import PageRegister from "./pages/auth/Register.jsx"
import Login from "./pages/auth/SignIn.jsx"
import DisboardPage from "./pages/Disboard.jsx"
import TaskDetailsPage from "./pages/TaskDetails.jsx"
import TasksPage from "./pages/Tasks.jsx"
import ManagementPage from "./pages/admin/Management.jsx"
import UsersPage from "./pages/admin/Users.jsx"
import NotFoundPage from "./pages/NotFound.jsx"
import { Status } from "./pages/admin/Status.jsx"

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <PageRegister />,
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <DisboardPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/tasks",
        element: (
            <ProtectedRoute>
                <TasksPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/task/:taskId",
        element: (
            <ProtectedRoute>
                <TaskDetailsPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin/management",
        element: (
            <ProtectedRoute adminOnly={true}>
                <ManagementPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin/users",
        element: (
            <ProtectedRoute adminOnly={true}>
                <UsersPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin/exported",
        element: (
            <ProtectedRoute adminOnly={true}>
                <Status />
            </ProtectedRoute>
        ),
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
])

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            {/* Aquí se agrega el ToastContainer para que las notificaciones se muestren globalmente */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
)
