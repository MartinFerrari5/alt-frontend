// /src/main.jsx

import "./index.css"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Toaster } from "sonner"

import { AuthProvider } from "./components/auth/AuthContext.jsx"
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx"
import PageRegister from "./pages/auth/Register.jsx"
import Login from "./pages/auth/SignIn.jsx"
import DisboardPage from "./pages/Disboard.jsx"
import TaskDetailsPage from "./pages/TaskDetails.jsx"
import TasksPage from "./pages/Tasks.jsx"
import ManagementPage from "./pages/admin/Management.jsx"
import UsersPage from "./pages/admin/Users.jsx"

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
])

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <Toaster toastOptions={{ style: { color: "#35383E" } }} />
                <RouterProvider router={router} />
            </QueryClientProvider>
        </AuthProvider>
    </React.StrictMode>
)
