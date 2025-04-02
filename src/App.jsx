// src/main.jsx
import "./index.css"
import "react-toastify/dist/ReactToastify.css"
import "flowbite"

import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx"
import PageRegister from "./pages/auth/Register.jsx"
import Login from "./pages/auth/SignIn.jsx"
import DisboardPage from "./pages/Disboard.jsx"
import TaskDetailsPage from "./pages/TaskDetails.jsx"
import ManagementPage from "./pages/admin/Management.jsx"
import UsersPage from "./pages/admin/Users.jsx"
import UsersDetail from "./pages/admin/UsersDetail.jsx"
import UserProfilePage from "./pages/user/UserProfile.jsx"
import NotFoundPage from "./pages/NotFound.jsx"
import { Status } from "./pages/admin/Status.jsx"
import ResetPasswordPage from "./pages/auth/ResetPassword.jsx"
import NewPasswordPage from "./pages/user/NewPassword.jsx"
import TasksPage from "./pages/TasksPage.jsx"

const queryClient = new QueryClient()

const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/register", element: <PageRegister /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <TasksPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/user/user-profile",
        element: (
            <ProtectedRoute>
                <UserProfilePage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/user/password",
        element: (
            <ProtectedRoute>
                <NewPasswordPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/history",
        element: (
            <ProtectedRoute>
                <DisboardPage />
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
        path: "/task/exported",
        element: (
            <ProtectedRoute>
                <Status />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin/management",
        element: (
            <ProtectedRoute adminOnly>
                <ManagementPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin/users",
        element: (
            <ProtectedRoute adminOnly>
                <UsersPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin/users/:id",
        element: (
            <ProtectedRoute adminOnly>
                <UsersDetail />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin/exported",
        element: (
            <ProtectedRoute adminOnly>
                <Status />
            </ProtectedRoute>
        ),
    },
    { path: "*", element: <NotFoundPage /> },
])

const App = () => (
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
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

export default App
