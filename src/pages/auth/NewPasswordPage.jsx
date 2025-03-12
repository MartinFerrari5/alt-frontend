// /src/pages/auth/NewPasswordPage.jsx
import { useState } from "react";
import { useResetPassword } from "../../hooks/data/users/useUserHooks";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewPasswordPage = () => {
  const [email, setEmail] = useState("");
  const resetPasswordMutation = useResetPassword();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => toast.success("Se ha enviado un correo con la nueva contraseña."),
        onError: (error) => toast.error(error.message || "Error al enviar el correo de reseteo."),
      }
    );
  };

  return (
    <section className="flex h-screen items-center justify-center bg-gradient-to-br from-green-200 to-white antialiased">
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
                            <a
                    href="#"
                    className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-600"
                >
                    <img
                        className="w-18 mr-2 h-8"
                        src="/src/assets/icons/Alt_Logo.png"
                        alt="logo"
                    />
                    Tarea
                </a>
            <div className="flex w-full flex-col rounded-xl bg-white p-10 shadow-xl">
                <div>
                <ToastContainer />
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl">Restablecer Contraseña</h1>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block font-semibold text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="user@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
                    />
                    </div>
                    <div className="flex items-center justify-between">
                    <Button type="submit">Enviar</Button>
                    <Button type="button" onClick={() => navigate(-1)}>
                        Cancelar
                    </Button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    </section>
  );
};

export default NewPasswordPage;
