import { useState } from "react";

function Login() {
    const [form, setForm] = useState({
        name: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Datos de login:", form);
        // acá hacés el fetch/axios a tu backend
    };

    return (
        <div className="w-full flex justify-center mt-10">
            <form 
                onSubmit={handleSubmit} 
                className="flex flex-col gap-4 p-6 rounded-xl shadow-md w-80"
            >
                <h2 className="text-xl font-bold text-center">Iniciar sesión</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Nombre de usuario"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <button 
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}

export default Login;
